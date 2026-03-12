/**
 * In-memory fixed window rate limiter.
 *
 * LIMITACIÓN: funciona solo dentro de una misma instancia del proceso.
 * En Vercel (serverless), cada invocación puede ser una instancia distinta,
 * por lo que este limiter no es estrictamente global entre requests concurrentes.
 * Es efectivo para protección básica y desarrollo local.
 *
 * TODO: reemplazar con Upstash Redis antes de escalar a producción:
 * https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Limpiar entradas expiradas periódicamente para evitar memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // cada 5 min
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref();

/**
 * Configuración leída desde env vars con defaults.
 * SESSION_RATE_LIMIT_MAX    — máximo de requests permitidos por ventana (default: 10)
 * SESSION_RATE_LIMIT_WINDOW_MS — tamaño de la ventana en ms (default: 60000)
 */
function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const rateLimitConfig = {
  session: {
    max: parsePositiveInt(process.env.SESSION_RATE_LIMIT_MAX, 10),
    windowMs: parsePositiveInt(process.env.SESSION_RATE_LIMIT_WINDOW_MS, 60_000),
  },
} as const;

/**
 * Verifica si la key está dentro del límite.
 * @returns true si la request está permitida, false si debe ser bloqueada
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
