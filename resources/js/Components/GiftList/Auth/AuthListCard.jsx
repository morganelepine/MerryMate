import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import ShowPrivateCode from "@/Components/GiftList/Action/ShowPrivateCode";
import DeleteListButton from "@/Components/GiftList/Action/Delete";
import CardArrow from "@/Components/GiftList/CardArrow";
import {
    LIST_CARD,
    LIST_CARD_HOVER,
    formatListDate,
} from "@/Components/GiftList/listCard";

// The whole card opens the list ("stretched link" on the title), while the
// code toggle stays clickable on top of it. A button can't live inside a link.
export default function AuthListCard({ list, showDelete = false }) {
    const isSharedList = list.isPrivate === 0;

    return (
        <div className="flex items-center gap-2">
            <div
                className={`relative flex-1 min-w-0 ${LIST_CARD} ${LIST_CARD_HOVER}`}
            >
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                        <Link
                            href={route("lists.show", list.id)}
                            className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-orange-300"
                        >
                            {list.name}
                        </Link>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {formatListDate(list)}
                    </p>
                    <div className="mt-2">
                        {isSharedList ? (
                            <div className="relative z-10 w-fit">
                                <ShowPrivateCode list={list} />
                            </div>
                        ) : (
                            <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                                Privée
                            </span>
                        )}
                    </div>
                </div>
                <CardArrow />
            </div>

            {showDelete && <DeleteListButton list={list} />}
        </div>
    );
}

AuthListCard.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        isPrivate: PropTypes.number,
    }).isRequired,
    // Only on the "Mes listes" page; the home overview stays read-only.
    showDelete: PropTypes.bool,
};
