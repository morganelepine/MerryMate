import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import OwnerAvatar from "@/Components/GiftList/OwnerAvatar";
import CardArrow from "@/Components/GiftList/CardArrow";
import {
    LIST_CARD,
    LIST_CARD_HOVER,
    formatListDate,
    formatOwner,
} from "@/Components/GiftList/listCard";

export default function FollowedListCard({ followedList }) {
    return (
        <Link
            href={route("lists.show", followedList.id)}
            className={`${LIST_CARD} ${LIST_CARD_HOVER} focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300`}
        >
            <OwnerAvatar list={followedList} />
            <div className="min-w-0 flex-1">
                <p className="truncate">
                    <span className="font-semibold text-gray-900">
                        {followedList.name}
                    </span>
                    <span className="ml-1.5 text-sm text-gray-600">
                        ~ {formatOwner(followedList)}
                    </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {formatListDate(followedList)}
                </p>
            </div>
            <CardArrow />
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
