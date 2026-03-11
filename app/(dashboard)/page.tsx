// Dashboard placeholder — será implementado en features 004–006
// También actúa como landing para el PKCE auth callback (/?code=...)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ code?: string; error?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;

  // PKCE magic link callback: Supabase redirige a /?code=... cuando el
  // emailRedirectTo no está en el allowlist. Reenviamos al callback route.
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}`);
  }

  if (params.error) {
    redirect(`/login?error=${encodeURIComponent(params.error)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Vujy — Foundation</h1>
        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <p className="text-green-600 font-medium">✓ Auth funcionando</p>
          <p className="text-gray-700">
            <span className="font-medium">Usuario:</span> {user.email}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            El asistente conversacional se implementa en features 004–006.
          </p>
        </div>
      </div>
    </div>
  );
}
