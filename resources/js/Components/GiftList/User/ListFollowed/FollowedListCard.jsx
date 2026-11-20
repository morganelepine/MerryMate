import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { LIST_CARD, formatListDate } from "@/Components/GiftList/listCard";

const initials = (...names) =>
    names
        .filter(Boolean)
        .map((name) => name[0].toUpperCase())
        .join("");

export default function FollowedListCard({ followedList }) {
    const owner = [followedList.user_name, followedList.user_lastname]
        .filter(Boolean)
        .join(" ");

    return (
        <Link
            href={route("lists.show", followedList.id)}
            className={`${LIST_CARD} hover:border-gray-300 hover:shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300`}
        >
            <span
                aria-hidden="true"
                className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-orange-100 text-sm font-semibold text-orange-600"
            >
                {initials(followedList.user_name, followedList.user_lastname)}
            </span>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">
                    {followedList.name}
                </p>
                <p className="text-sm text-gray-600 truncate">{owner}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {formatListDate(followedList)}
                </p>
            </div>
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
        </Link>
    );
}

FollowedListCard.propTypes = {
    followedList: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        user_name: PropTypes.string,
        user_lastname: PropTypes.string,
        isEmpty: PropTypes.bool,
        formatted_created_at: PropTypes.string,
        formatted_updated_at: PropTypes.string,
    }).isRequired,
};
