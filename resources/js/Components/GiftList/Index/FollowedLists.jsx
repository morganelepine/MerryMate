import { useState } from "react";
import PropTypes from "prop-types";
import FollowedListCard from "@/Components/GiftList/User/ListFollowed/FollowedListCard";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import LinkButton from "@/Components/Buttons/LinkButton";
import ColumnHeader from "@/Components/GiftList/Index/ColumnHeader";

const MOBILE_PREVIEW = 2;

export default function FollowedLists({ followedLists }) {
    const [showAll, setShowAll] = useState(false);

    return (
        <section>
            <ColumnHeader
                title="Listes suivies"
                count={followedLists.length}
                action={
                    <OutlineButton
                        size="medium"
                        href={route("lists.listsToFollow")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1.5 -ml-0.5"
                            aria-hidden="true"
                        >
                            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Trouver
                    </OutlineButton>
                }
            />

            {followedLists.length > 0 ? (
                <>
                    <div className="mt-4 space-y-3">
                        {followedLists.map((followedList, index) => (
                            // On mobile, only the first lists are shown until expanded.
                            <div
                                key={followedList.id}
                                className={
                                    !showAll && index >= MOBILE_PREVIEW
                                        ? "hidden sm:block"
                                        : ""
                                }
                            >
                                <FollowedListCard followedList={followedList} />
                            </div>
                        ))}
                    </div>
                    {followedLists.length > MOBILE_PREVIEW && (
                        <LinkButton
                            className="sm:hidden block w-full mt-2 text-center"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll
                                ? "Voir moins"
                                : "Voir toutes les listes suivies"}
                        </LinkButton>
                    )}
                </>
            ) : (
                <p className="mt-6 text-gray-600">
                    Vous ne suivez pas encore de liste.
                </p>
            )}
        </section>
    );
}

FollowedLists.propTypes = {
    followedLists: PropTypes.array.isRequired,
};
