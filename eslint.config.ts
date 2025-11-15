import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      "@stylistic": stylistic,
      react: pluginReact,
    },
    extends: [
      "js/recommended",
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"],
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // Форсируем стиль добавления пустых строк между конструкциями для лучшей читаемости кода
      "@stylistic/padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          prev: "*",
          next: [
            "return",
            "export",
            "throw",
            "block-like",
            "enum",
            "interface",
            "type",
          ],
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var", "block-like"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "always", prev: ["case", "default"], next: "*" },
        {
          blankLine: "always",
          prev: "*",
          next: ["multiline-const", "multiline-expression"],
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-expression"],
          next: "*",
        },
      ],
      "react/no-irregular-whitespace": ["error", { skipStrings: true }],
    },
  },
  tseslint.configs.recommended,
]);
