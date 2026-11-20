import PropTypes from "prop-types";
import { parseLink } from "@/Components/Ideas/ideaHelpers";

export default function IdeaLink({
    idea,
    color = "bg-orange-100 text-orange-700 hover:bg-orange-200",
    className = "",
    iconOnlyOnMobile = false,
}) {
    const link = parseLink(idea.link);

    if (!link) {
        // Free-text link: only worth showing when it isn't already used as the title.
        return idea.link && idea.idea ? (
            <span
                className={`max-w-full truncate text-sm text-gray-500 ${className}`}
            >
                {idea.link}
            </span>
        ) : null;
    }

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                iconOnlyOnMobile ? "p-1.5 sm:px-3 sm:py-1" : "px-3 py-1"
            } ${color} ${className}`}
        >
            {/* When icon-only, the domain stays available to screen readers. */}
            <span
                className={
                    iconOnlyOnMobile
                        ? "sr-only sm:not-sr-only sm:truncate"
                        : "truncate"
                }
            >
                {link.host}
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 shrink-0"
                aria-hidden="true"
            >
                <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span className="sr-only">(nouvel onglet)</span>
        </a>
    );
}

IdeaLink.propTypes = {
    idea: PropTypes.shape({
        idea: PropTypes.string,
        link: PropTypes.string,
    }).isRequired,
    // Background/text colours of the pill.
    color: PropTypes.string,
    // Layout classes from the parent (e.g. "ml-auto" to push it right).
    className: PropTypes.string,
    // Hides the domain on mobile (compact reserved/purchased cards).
    iconOnlyOnMobile: PropTypes.bool,
};
