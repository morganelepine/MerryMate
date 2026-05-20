import "./bootstrap";
import "../css/app.css";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "sonner";
import InstallPrompt from "@/Components/InstallPrompt";

const appName = import.meta.env.VITE_APP_NAME || "MerryMate";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <InstallPrompt />
                <Toaster
                    position="bottom-right"
                    expand={true}
                    richColors
                    // offset="50px"
                    // closeButton
                    toastOptions={
                        {
                            // style: { background: "orange-500" },
                            // className: "bg-orange-500",
                        }
                    }
                />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
