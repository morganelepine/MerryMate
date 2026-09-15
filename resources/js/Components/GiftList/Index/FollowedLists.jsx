import { useState } from "react";
import PropTypes from "prop-types";
import FollowedList from "@/Components/GiftList/User/ListFollowed/FollowedListCard";
import NoListFollowed from "@/Components/GiftList/User/ListFollowed/NoListFollowed";
import LinkButton from "@/Components/Buttons/LinkButton";

export default function FollowedLists({ auth, followedLists }) {
    const [showAll, setShowAll] = useState(false);
    const displayedLists = showAll ? followedLists : followedLists.slice(0, 2);

    return (
        <div className="flex flex-col items-center text-center md:w-1/3 mt-8 md:mt-0">
            <h1 className="text-xl font-semibold mb-2">Listes suivies</h1>
            {followedLists.length > 0 ? (
                <>
                    <div className="sm:hidden">
                        {displayedLists.map((followedList) => (
                            <div
                                className="p-5 my-2 flex flex-col text-center shadow bg-white rounded-xl w-full"
                                key={followedList.id}
                            >
                                <FollowedList
                                    followedList={followedList}
                                    auth={auth}
                                />
                            </div>
                        ))}
                        {followedLists.length > 2 && (
                            <LinkButton onClick={() => setShowAll(!showAll)}>
                                {showAll
                                    ? "Voir moins"
                                    : "Voir toutes les listes suivies"}
                            </LinkButton>
                        )}
                    </div>
                    <div className="hidden sm:flex sm:flex-col w-full">
                        {followedLists.map((followedList) => (
                            <div
                                className="p-5 my-2 flex flex-col text-center shadow bg-white rounded-xl w-full"
                                key={followedList.id}
                            >
                                <FollowedList
                                    followedList={followedList}
                                    auth={auth}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <NoListFollowed />
            )}
        </div>
    );
}

FollowedLists.propTypes = {
    auth: PropTypes.object.isRequired,
    followedLists: PropTypes.array,
};
