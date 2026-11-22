import PropTypes from "prop-types";

// Heroicons outline path, decorative: the label always sits next to it.
export default function OutlineIcon({ path, className = "h-5 w-5" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            className={className}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

OutlineIcon.propTypes = {
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
};
