import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
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
    await fetch(`${origin}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId }),
    });
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Multiple schools — redirect to school selector
  return NextResponse.redirect(`${origin}/select-school`);
}
