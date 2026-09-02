import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

const a11yWarnings = Object.fromEntries(
    Object.entries(jsxA11y.flatConfigs.recommended.rules).map(
        ([rule, severity]) => [
            rule,
            Array.isArray(severity) ? ["warn", ...severity.slice(1)] : "warn",
        ],
    ),
);

export default [
    js.configs.recommended,
    react.configs.flat.recommended,
    {
        files: ["resources/js/**/*.{js,jsx}"],
        plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: {
                ...globals.browser,
                // Fonction globale exposée par Ziggy (@routes côté Blade).
                route: "readonly",
            },
        },
        settings: { react: { version: "18.2" } },
        rules: {
            ...a11yWarnings,

            "no-console": ["warn", { allow: ["warn", "error"] }],

            // Seule règle hooks non négociable : un Hook appelé
            // conditionnellement casse les règles de base de React.
            "react-hooks/rules-of-hooks": "error",
            // Utile mais avec des faux positifs connus (setters de hooks
            // tiers comme useForm que la règle ne peut pas savoir stables) :
            // averti, pas bloquant.
            "react-hooks/exhaustive-deps": "warn",

            // Le typage runtime des props est déjà géré via le paquet
            // `prop-types`, et le nouveau JSX transform (React 18) rend
            // l'import de React inutile dans chaque fichier.
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",

            // Inadapté à une application en français : "l'idée",
            // "d'accéder", "qu'un"... déclencheraient une erreur à chaque
            // apostrophe du texte affiché.
            "react/no-unescaped-entities": "off",
        },
    },
];
