import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // One icon library only: Phosphor (docs/06-icons-and-inputs.md). Never draw custom icons.
  {
    rules: {
      "no-restricted-imports": ["error", {
        paths: ["lucide-react", "react-icons", "@heroicons/react", "@tabler/icons-react", "@radix-ui/react-icons", "react-feather"]
          .map(name => ({ name, message: "Use Phosphor (@phosphor-icons/react/ssr) for all icons." })),
        patterns: [{ group: ["react-icons/*", "@heroicons/react/*", "@tabler/icons-react/*"], message: "Use Phosphor (@phosphor-icons/react/ssr) for all icons." }],
      }],
    },
  },
  // Vendored Untitled UI code (copied from their kit; kept close to upstream so updates stay easy).
  // Only style/compiler rules it wasn't written for are relaxed; the icon rule above still applies.
  {
    files: ["src/components/base/**", "src/components/application/**", "src/components/foundations/**", "src/hooks/**", "src/utils/**", "src/providers/**"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
