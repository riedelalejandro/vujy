"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ErrorParams {
  error?: string;
  error_description?: string;
  error_code?: string;
}

interface Props {
  initialErrorParams?: ErrorParams;
}

function decodeParam(value: string | null) {
  if (!value) return "";
  return decodeURIComponent(value.replace(/\+/g, " "));
}

function buildLoginErrorMessage(params: URLSearchParams) {
  const errorCode = params.get("error_code");
  const errorDescription = decodeParam(params.get("error_description"));
  const error = decodeParam(params.get("error"));

  if (errorCode === "otp_expired") {
    return "El link de acceso venció o ya fue usado. Pedí uno nuevo.";
  }

  if (error === "otp_expired") {
    return "El link de acceso venció o ya fue usado. Pedí uno nuevo.";
  }

  if (errorDescription) {
    const normalized = errorDescription.toLowerCase();
    if (normalized.includes("expired") || normalized.includes("invalid")) {
      return "El link de acceso venció o fue invalidado. Pedí uno nuevo.";
    }
    return "No se pudo iniciar sesión. Pedí un nuevo link de acceso.";
  }

  if (error === "no_code") {
    return "El link de acceso es inválido. Pedí uno nuevo.";
  }

  if (error === "access_denied") {
    return "No se pudo validar el acceso. Pedí un nuevo link.";
  }

  if (error === "auth_callback_failed") {
    return "No se pudo validar el link de acceso. Pedí uno nuevo.";
  }

  if (error) {
    return "No se pudo iniciar sesión. Pedí un nuevo link de acceso.";
  }

  return null;
}

function getInitialErrorMessage(initialErrorParams?: ErrorParams) {
  const base = new URLSearchParams();
  if (initialErrorParams?.error) base.set("error", initialErrorParams.error);
  if (initialErrorParams?.error_code) base.set("error_code", initialErrorParams.error_code);
  if (initialErrorParams?.error_description) {
    base.set("error_description", initialErrorParams.error_description);
  }

  const queryErrorMessage = buildLoginErrorMessage(base);

  if (typeof window === "undefined") {
    return queryErrorMessage;
  }

  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return queryErrorMessage;
  }

  const hashParams = new URLSearchParams(hash.slice(1));
  return buildLoginErrorMessage(hashParams) ?? queryErrorMessage;
}

export default function LoginForm({ initialErrorParams }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(() => getInitialErrorMessage(initialErrorParams));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Hubo un problema al enviar el link. Intentá de nuevo.");
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Revisá tu email</h1>
          <p className="text-gray-600">
            Enviamos un link de acceso a <strong>{email}</strong>. Hacé click en el link para
            ingresar a Vujy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Ingresar a Vujy</h1>
        <p className="text-gray-600 mb-6">
          Ingresá tu email y te enviamos un link de acceso directo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Enviando..." : "Enviar link de acceso"}
          </button>
        </form>
      </div>
    </div>
  );
}
