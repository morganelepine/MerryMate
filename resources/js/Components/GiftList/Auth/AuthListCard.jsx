import PropTypes from "prop-types";
import ShowPrivateCode from "@/Components/GiftList/Action/ShowPrivateCode";
import DeleteListButton from "@/Components/GiftList/Action/Delete";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { LIST_CARD, formatListDate } from "@/Components/GiftList/listCard";

export default function AuthListCard({ list }) {
    const isSharedList = list.isPrivate === 0;

    return (
        <div className={LIST_CARD}>
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">
                    {list.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                    {formatListDate(list)}
                </p>
                <div className="mt-2">
                    {isSharedList ? (
                        <ShowPrivateCode list={list} />
                    ) : (
                        <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                            Privée
                        </span>
                    )}
                </div>
            </div>

            <OutlineButton size="small" href={route("lists.show", list.id)}>
                Ouvrir<span className="sr-only"> la liste {list.name}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-3.5 h-3.5 ml-1"
                    aria-hidden="true"
                >
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </OutlineButton>

            <DeleteListButton list={list} />
        </div>
    );
}

AuthListCard.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        isPrivate: PropTypes.number,
    }).isRequired,
};
