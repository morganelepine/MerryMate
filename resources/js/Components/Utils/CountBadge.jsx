import PropTypes from "prop-types";

// Fixed height + equal min-width: a circle for one digit, a pill beyond.
const SIZES = {
    sm: "h-5 min-w-[1.25rem]",
    md: "h-6 min-w-[1.5rem]",
};

export default function CountBadge({
    count,
    size = "sm",
    // Colours (and positioning when needed) from the caller.
    className = "bg-black/5",
    children,
    ...props
}) {
    return (
        <span
            {...props}
            className={`inline-flex shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums ${SIZES[size]} ${className}`}
        >
            {count}
            {children}
        </span>
    );
}

CountBadge.propTypes = {
    count: PropTypes.number.isRequired,
    size: PropTypes.oneOf(Object.keys(SIZES)),
    className: PropTypes.string,
    // Extra content, e.g. screen-reader-only text.
    children: PropTypes.node,
};
