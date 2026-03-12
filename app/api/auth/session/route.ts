import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 10 requests por minuto por usuario — protege contra spam de JWT updates
  if (!checkRateLimit(`session:${user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const { schoolId } = body as { schoolId?: string };

  if (!schoolId) {
    return NextResponse.json({ error: "schoolId is required" }, { status: 400 });
  }

  // Validate the user actually has a profile in this school
  const profile = await db
    .select({ role: profiles.role, schoolId: profiles.schoolId })
    .from(profiles)
    .where(
      and(eq(profiles.id, user.id), eq(profiles.schoolId, schoolId), isNull(profiles.deletedAt))
    )
    .limit(1);

  if (!profile.length) {
    return NextResponse.json(
      { error: "No profile found for this school" },
      { status: 403 }
    );
  }

  // Set school_id and role as custom claims in the user's JWT
  // These claims are read by get_my_school_id() for RLS
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(user.id, {
    app_metadata: {
      school_id: schoolId,
      role: profile[0].role,
    },
  });

  if (error) {
    console.error("[session] Failed to update JWT claims for user", user.id, ":", error.message);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }

  // Force session refresh so the new claims take effect immediately
  await supabase.auth.refreshSession();

  return NextResponse.json({ ok: true, schoolId, role: profile[0].role });
}
