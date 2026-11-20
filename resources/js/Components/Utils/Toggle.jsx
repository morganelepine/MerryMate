import PropTypes from "prop-types";

// Full class strings so Tailwind can detect them.
const SIZES = {
    default: {
        gap: "gap-3",
        track: "w-10 h-6",
        thumb: "after:w-5 after:h-5 peer-checked:after:translate-x-4",
        label: "text-sm",
    },
    // Smaller on mobile, default size from `sm` up.
    responsive: {
        gap: "gap-2 sm:gap-3",
        track: "w-8 h-5 sm:w-10 sm:h-6",
        thumb: "after:w-4 after:h-4 sm:after:w-5 sm:after:h-5 peer-checked:after:translate-x-3 sm:peer-checked:after:translate-x-4",
        label: "text-xs sm:text-sm",
    },
};

// Native checkbox exposed as a switch, so keyboard and screen readers work out of the box.
export default function Toggle({
    id,
    label,
    size = "default",
    className = "",
    ...props
}) {
    const s = SIZES[size];

    return (
        <label
            htmlFor={id}
            className={`inline-flex items-center cursor-pointer ${s.gap} ${className}`}
        >
            <input
                {...props}
                id={id}
                type="checkbox"
                role="switch"
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={`relative shrink-0 rounded-full bg-gray-300 transition-colors motion-reduce:transition-none peer-checked:bg-orange-600 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-300 peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:rounded-full after:bg-white after:shadow after:transition-transform motion-reduce:after:transition-none ${s.track} ${s.thumb}`}
            />
            <span className={`text-gray-800 ${s.label}`}>{label}</span>
        </label>
    );
}

Toggle.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    size: PropTypes.oneOf(Object.keys(SIZES)),
    className: PropTypes.string,
};
