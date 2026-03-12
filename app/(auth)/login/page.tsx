import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./login-form";

interface Props {
  searchParams: Promise<{ error?: string; error_description?: string; error_code?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;
  return <LoginForm initialErrorParams={params} />;
}
