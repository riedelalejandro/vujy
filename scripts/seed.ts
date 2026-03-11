#!/usr/bin/env tsx
/**
 * Dev seed script — carga datos ficticios para desarrollo local.
 * NUNCA correr en producción.
 *
 * Uso: pnpm seed
 */

// Guard: solo en entorno de desarrollo
if (process.env.NODE_ENV === "production") {
  console.error("❌ ERROR: El seed no puede ejecutarse en producción.");
  process.exit(1);
}

import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const seedFile = join(process.cwd(), "supabase/seed/dev_seed.sql");

if (!existsSync(seedFile)) {
  console.error(`❌ ERROR: No se encontró el archivo de seed: ${seedFile}`);
  process.exit(1);
}

console.log("🌱 Ejecutando seed de desarrollo...");
console.log("   Archivo:", seedFile);
console.log("");

try {
  // supabase db reset aplica migraciones + seed en un solo paso
  // Para correr solo el seed sobre una DB ya reseteada:
  execSync("supabase db reset", {
    stdio: "inherit",
    env: { ...process.env },
  });

  console.log("");
  console.log("✅ Seed completado exitosamente.");
  console.log("");
  console.log("   Usuarios disponibles (magic link en http://127.0.0.1:54324):");
  console.log("   • admin@demo.vujy.app      → rol: admin");
  console.log("   • docente@demo.vujy.app    → rol: teacher");
  console.log("   • padre@demo.vujy.app      → rol: guardian (madre de Mati y Sofi)");
  console.log("   • alumno@demo.vujy.app     → rol: student");
  console.log("");
  console.log("   Supabase Studio: http://127.0.0.1:54323");
  console.log("   Inbucket (emails): http://127.0.0.1:54324");
} catch (error) {
  console.error("❌ ERROR ejecutando seed:", error);
  console.error("");
  console.error("   Asegurate de que Supabase está corriendo: supabase start");
  process.exit(1);
}
