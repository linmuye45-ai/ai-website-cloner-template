import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated headless test build (compiled from src/game).
    ".smoke-build/**",
  ]),
  {
    // Node CommonJS tooling: headless smoke tests, sprite/OG renderers and
    // long-run simulators run directly under Node, so require() and
    // callback-style `this` capture are intentional there.
    files: ["scripts/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
]);

export default eslintConfig;
