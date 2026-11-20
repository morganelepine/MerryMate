import PropTypes from "prop-types";
import { parseLink } from "@/Components/Ideas/ideaHelpers";

export default function IdeaLink({ idea, color }) {
    const link = parseLink(idea.link);

    if (!link) {
        // Free-text link: only worth showing when it isn't already used as the title.
        return idea.link && idea.idea ? (
            <span className={`ml-auto max-w-full truncate text-sm ${color}`}>
                {idea.link}
            </span>
        ) : null;
    }

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-auto inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${color}`}
        >
            <span className="truncate">{link.host}</span>
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
};
