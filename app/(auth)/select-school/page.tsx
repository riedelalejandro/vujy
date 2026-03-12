"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SchoolProfile {
  school_id: string;
  role: string;
  schools: { name: string; slug: string } | null;
}

export default function SelectSchoolPage() {
  const [profiles, setProfiles] = useState<SchoolProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfiles() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("school_id, role, schools(name, slug)")
        .eq("id", user.id)
        .is("deleted_at", null);

      setProfiles((data as unknown as SchoolProfile[]) ?? []);
      setLoading(false);
    }

    loadProfiles();
  }, [router]);

  async function selectSchool(schoolId: string) {
    setSelecting(schoolId);
    setError(null);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });
      if (!res.ok) {
        setError("No se pudo seleccionar la escuela. Intentá de nuevo.");
        setSelecting(null);
        return;
      }
    } catch {
      setError("Error de conexión. Verificá tu internet e intentá de nuevo.");
      setSelecting(null);
      return;
    }
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Seleccioná tu escuela</h1>
        <p className="text-gray-600 mb-6">
          Tenés acceso a más de una institución. ¿Con cuál querés trabajar ahora?
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">{error}</p>
        )}

        <div className="space-y-3">
          {profiles.map((profile) => (
            <button
              key={profile.school_id}
              onClick={() => selectSchool(profile.school_id)}
              disabled={selecting === profile.school_id}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <p className="font-medium text-gray-900">
                {profile.schools?.name ?? "Escuela"}
              </p>
              <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
