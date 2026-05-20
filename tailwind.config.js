import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
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
                lavande: {
                    10: "#fefefe",
                    20: "#fdfdfd",
                    30: "#fcfcfc",
                    40: "#fbfbfb",
                    50: "#f5f7ff",
                },
                bordeaux: {
                    50: "#fcf3f8",
                    100: "#fbe8f2",
                    200: "#f9d1e6",
                    300: "#f5acd0",
                    400: "#ed79b0",
                    500: "#e35192",
                    600: "#d13170",
                    700: "#b52158",
                    800: "#A40E4C",
                    900: "#821f42", //ref
                    950: "#4c0b22",
                },
                orange: {
                    50: "#fff3ef", //fff6f5
                    100: "#ffe3df",
                    200: "#ffcbc5",
                    300: "#ffa89d",
                    400: "#ff7564",
                    500: "#ff452e", //ref
                    600: "#ed2d15",
                    700: "#c8220d",
                    800: "#a5200f",
                    900: "#882114",
                    950: "#4b0c04",
                },
                charcoal: {
                    50: "#f1f9fa",
                    100: "#dceff1",
                    200: "#bde0e4",
                    300: "#8fc9d1",
                    400: "#59a9b7",
                    500: "#3e8d9c",
                    600: "#367484",
                    700: "#315f6d",
                    800: "#2f505b",
                    900: "#273e47", //ref
                    950: "#182c34",
                },
                emerald: {
                    500: "#23CE6B", //ref
                },
            },
        },
    },

    plugins: [forms],
};
