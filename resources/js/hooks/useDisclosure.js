import { useCallback, useEffect, useRef, useState } from "react";

// Open/close state for an inline form: on close, focus goes back to the trigger (`triggerRef`).
export default function useDisclosure() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const shouldRestoreFocus = useRef(false);

    useEffect(() => {
        if (!isOpen && shouldRestoreFocus.current) {
            shouldRestoreFocus.current = false;
            triggerRef.current?.focus();
        }
    }, [isOpen]);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => {
        shouldRestoreFocus.current = true;
        setIsOpen(false);
    }, []);

    return { isOpen, open, close, triggerRef };
}
