import PropTypes from "prop-types";

// Decorative: the owner's name is always written next to it.
export default function OwnerAvatar({ list }) {
    const initials = [list.user_name, list.user_lastname]
        .filter(Boolean)
        .map((name) => name[0].toUpperCase())
        .join("");

    return (
        <span
            aria-hidden="true"
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-orange-100 text-sm font-semibold text-orange-800"
        >
            {initials}
        </span>
    );
}

OwnerAvatar.propTypes = {
    list: PropTypes.shape({
        user_name: PropTypes.string,
        user_lastname: PropTypes.string,
    }).isRequired,
};
