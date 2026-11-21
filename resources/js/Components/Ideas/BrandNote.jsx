import PropTypes from "prop-types";
import Linkify from "linkify-react"; //rendre les liens cliquables

export default function BrandNote({ content, className = "mt-2" }) {
    if (!content) return null;

    return (
        <p
            className={`flex items-start gap-1.5 text-sm text-orange-600 break-words ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4 mt-0.5 shrink-0"
                aria-hidden="true"
            >
                <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path d="M6 6h.008v.008H6V6Z" />
            </svg>
            <span className="min-w-0 whitespace-pre-line">
                <Linkify
                    options={{
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className:
                            "underline underline-offset-2 hover:text-orange-900",
                    }}
                >
                    {content}
                </Linkify>
            </span>
        </p>
    );
}

BrandNote.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
};
