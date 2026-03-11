import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Security: no unused vars (catches potential injection points)
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // No explicit any (except where absolutely necessary)
      "@typescript-eslint/no-explicit-any": "warn",
      // Enforce consistent imports
      "import/no-duplicates": "error",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "supabase/.branches/**",
      "supabase/.temp/**",
    ],
  },
];

export default config;
