import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq, and, isNull, asc } from "drizzle-orm";
import { checkRateLimit, rateLimitConfig } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(`session:${user.id}`, rateLimitConfig.session.max, rateLimitConfig.session.windowMs)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { schoolId } = body as { schoolId?: unknown };

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (typeof schoolId !== "string" || !UUID_RE.test(schoolId)) {
    return NextResponse.json({ error: "schoolId must be a valid UUID" }, { status: 400 });
  }

  // Validate the user actually has a profile in this school
  const profile = await db
    .select({ role: profiles.role, schoolId: profiles.schoolId })
    .from(profiles)
    .where(
      and(eq(profiles.id, user.id), eq(profiles.schoolId, schoolId), isNull(profiles.deletedAt))
    )
    .orderBy(asc(profiles.createdAt))
    .limit(1);

  if (!profile.length) {
    return NextResponse.json(
      { error: "No profile found for this school" },
      { status: 403 }
    );
  }

  // Set school_id and role as custom claims in the user's JWT
  // These claims are read by get_my_school_id() for RLS
  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (e) {
    console.error("[session] createAdminClient failed:", e);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const { error } = await adminClient.auth.admin.updateUserById(user.id, {
    app_metadata: {
      school_id: schoolId,
      role: profile[0].role,
    },
  });

  if (error) {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }

  // Force session refresh so the new claims take effect immediately
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    // Claims were updated in app_metadata but the client cookie won't reflect
    // the new school_id until the next token refresh (handled automatically by Supabase).
    console.warn("[session] refreshSession failed after updateUserById:", refreshError.message);
  }

  return NextResponse.json({ ok: true, schoolId, role: profile[0].role });
}
