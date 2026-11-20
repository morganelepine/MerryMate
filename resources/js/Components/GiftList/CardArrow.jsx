// Decorative "go to" arrow at the end of a clickable list card.
export default function CardArrow() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 shrink-0 text-gray-400"
            aria-hidden="true"
        >
            <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}
