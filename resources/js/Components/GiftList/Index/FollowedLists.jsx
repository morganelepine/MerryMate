import { useState } from "react";
import PropTypes from "prop-types";
import FollowedListCard from "@/Components/GiftList/User/ListFollowed/FollowedListCard";
import FindListButton from "@/Components/GiftList/Action/FindListButton";
import LinkButton from "@/Components/Buttons/LinkButton";
import SectionHeader from "@/Components/Utils/SectionHeader";

const MOBILE_PREVIEW = 2;

export default function FollowedLists({ followedLists }) {
    const [showAll, setShowAll] = useState(false);

    return (
        <section>
            <SectionHeader title="Listes suivies" action={<FindListButton />} />

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
                    Tu ne suis pas encore de liste.
                </p>
            )}
        </section>
    );
}

FollowedLists.propTypes = {
    followedLists: PropTypes.array.isRequired,
};
