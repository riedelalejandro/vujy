import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Use connection pooling URL from Supabase (port 6543, pgbouncer)
// For migrations, use the direct URL (port 5432)
const client = postgres(process.env.DATABASE_URL, {
  prepare: false, // Required for Supabase connection pooler (pgbouncer)
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
