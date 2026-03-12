import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function mapCallbackErrorCode(error: { message?: string; status?: number }) {
  const message = (error.message ?? "").toLowerCase();
  if (message.includes("expired") || message.includes("invalid") || message.includes("otp")) {
    return "otp_expired";
  }
  if (error.status === 403 || message.includes("access denied")) {
    return "access_denied";
  }
  return "auth_callback_failed";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Validate next is a safe relative path — prevent open redirect
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("://")
    ? rawNext
    : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorCode = mapCallbackErrorCode(error);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorCode)}`
    );
  }

  // Check how many schools this user belongs to
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("school_id, schools(name, slug)")
    .eq("id", user.id)
    .is("deleted_at", null);

  if (!profiles || profiles.length === 0) {
    // New user with no profile — this shouldn't happen in normal flow
    // (profiles are created by admins when onboarding users)
    return NextResponse.redirect(`${origin}/login?error=no_profile`);
  }

  if (profiles.length === 1) {
    // Single school — set school_id in session and proceed
    const schoolId = profiles[0].school_id;
    const sessionRes = await fetch(`${origin}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId }),
    });
    if (!sessionRes.ok) {
      return NextResponse.redirect(`${origin}/login?error=session_error`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Multiple schools — redirect to school selector
  return NextResponse.redirect(`${origin}/select-school`);
}
