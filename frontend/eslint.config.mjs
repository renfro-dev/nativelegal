import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "**/frontend/.next/**",
      "frontend/.next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/next-env.d.ts",
      "scripts/**",
      "public/**",
      "content/**",
      "docs/**",
      "*.config.js",
      "*.config.mjs",
      "vercel.json",
      ".next/types/**",
      "**/types/routes.d.ts",
    ],
  },
];

export default eslintConfig;
