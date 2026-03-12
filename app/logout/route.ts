import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=logout_failed`);
  }

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`);
}
