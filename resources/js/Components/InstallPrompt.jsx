import { useState, useEffect } from "react";

const STORAGE_KEY = "merrymate-install-dismissed";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function isIos() {
    return (
        /iphone|ipad|ipod/i.test(globalThis.navigator.userAgent) &&
        !globalThis.MSStream
    );
}

function isStandalone() {
    return (
        globalThis.matchMedia("(display-mode: standalone)").matches ||
        globalThis.navigator.standalone === true
    );
}

function wasDismissedRecently() {
    const ts = globalThis.localStorage.getItem(STORAGE_KEY);
    return ts && Date.now() - Number(ts) < DISMISS_TTL_MS;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const [ios, setIos] = useState(false);

    useEffect(() => {
        if (isStandalone() || wasDismissedRecently()) return;

        if (isIos()) {
            setIos(true);
            setVisible(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        globalThis.addEventListener("beforeinstallprompt", handler);
        return () =>
            globalThis.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") dismiss();
        setDeferredPrompt(null);
    };

    const dismiss = () => {
        setVisible(false);
        globalThis.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    if (!visible) return null;

    return (
        <header className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-sm animate-slide-up font-sans sm:bottom-4 sm:left-4 sm:right-4 sm:max-w-md">
            <div className="flex items-center gap-2.5 rounded-2xl border border-bordeaux-100 bg-white p-3 shadow-up sm:gap-3 sm:p-4">
                <img
                    src="/icons/logo-MerryMate-192.png"
                    alt="MerryMate"
                    className="h-10 w-10 flex-shrink-0 rounded-xl sm:h-11 sm:w-11"
                />

                <div className="min-w-0 flex-1">
                    <p className="font-yeseva text-sm text-orange-500 sm:text-base">
                        Installer MerryMate
                    </p>
                    {ios ? (
                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                            Appuyez sur{" "}
                            <ShareIcon className="mb-0.5 inline h-3 w-3 sm:h-3.5 sm:w-3.5" />{" "}
                            puis{" "}
                            <span className="font-medium">
                                &laquo;&nbsp;Sur l&apos;écran
                                d&apos;accueil&nbsp;&raquo;
                            </span>
                        </p>
                    ) : (
                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                            Pour y accéder depuis votre écran d&apos;accueil
                            comme une application
                        </p>
                    )}
                </div>

                {!ios && (
                    <button
                        onClick={handleInstall}
                        className="flex-shrink-0 rounded-lg bg-indigo-500 px-2.5 py-1.5 text-xs text-white transition-colors hover:bg-orange-500 sm:px-3 sm:text-sm"
                    >
                        Installer
                    </button>
                )}

                <button
                    onClick={dismiss}
                    aria-label="Fermer"
                    className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}

function ShareIcon({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
    );
}
