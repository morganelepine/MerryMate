import { forwardRef, useEffect, useRef } from "react";

export const INPUT_CLASSES =
    "mt-2 w-full rounded-xl shadow-sm border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const input = ref ?? localRef;

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={`${INPUT_CLASSES} ${className}`}
            ref={input}
        />
    );
});
