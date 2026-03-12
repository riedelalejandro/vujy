import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack for faster local dev
  turbopack: {},

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS — enforces HTTPS for 1 year (includeSubDomains; no preload until ready)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // CSP — tightened per stack (Next.js + Supabase + no external scripts)
          // 'unsafe-inline' required by Next.js for styles; scripts served from same origin.
          // connect-src covers Supabase REST + Realtime (wss). Tighten to specific domains in prod.
          // TODO: replace connect-src wildcard with explicit Supabase project URL at deploy time.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://*.supabase.com wss://*.supabase.co http://127.0.0.1:* ws://127.0.0.1:*",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
