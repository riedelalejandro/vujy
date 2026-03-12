import coreWebVitals from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...tsConfig,
  {
    settings: {
      react: { version: "19" },
    },
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
