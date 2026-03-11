// Dashboard placeholder — será implementado en features 004–006
// Por ahora sirve como verificación de que el auth flow funciona

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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
