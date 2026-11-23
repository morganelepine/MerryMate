import PropTypes from "prop-types";

// Decorative: the person's name is always written next to it.
export default function InitialsAvatar({ name, lastName }) {
    const initials = [name, lastName]
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .join("");

    return (
        <span
            aria-hidden="true"
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-orange-100 text-sm font-semibold text-orange-600"
        >
            {initials}
        </span>
    );
}

InitialsAvatar.propTypes = {
    name: PropTypes.string,
    lastName: PropTypes.string,
};
