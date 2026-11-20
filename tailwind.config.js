import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{js,jsx}",
    ],

    theme: {
        extend: {
            boxShadow: {
                up: "0 4px 4px 4px rgb(0 0 0 / 0.1)",
            },
            keyframes: {
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(1rem)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "slide-up": "slide-up 0.25s ease-out both",
            },
            fontSize: {
                "2xs": "0.6rem",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                yeseva: ["Yeseva One", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cream: "#fdf7f4",
                // Status colors: reserved ideas
                lilac: {
                    50: "#f6f7fc",
                    100: "#eceef8",
                    300: "#C3BEF7", //ref
                    600: "#7b7fca",
                    800: "#3f4483",
                },
                // Status colors: purchased ideas
                sage: {
                    50: "#f2f8f4",
                    100: "#e4f1e9",
                    300: "#89bd9e", //ref
                    600: "#4a8a66",
                    800: "#2f5e42",
                },
                orange: {
                    50: "#fef3f2",
                    100: "#fde4e3",
                    200: "#fbcdcc",
                    300: "#f7a9a8",
                    400: "#f07577",
                    500: "#e5484d", //ref
                    600: "#d1343a",
                    700: "#b0272d",
                    800: "#92242a",
                    900: "#7a2428",
                    950: "#420e11",
                },
            },
        },
    },

    plugins: [forms],
};
