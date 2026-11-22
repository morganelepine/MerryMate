import { useEffect } from "react";

// Listens on the document rather than on the form: React bubbles keydown through portals,
// so Escape in a confirmation modal opened from the form would close the form too.
export default function useEscapeToClose(ref, onClose) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === "Escape" &&
                ref.current?.contains(document.activeElement)
            ) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [ref, onClose]);
}
