import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FollowedListCard from "@/Components/GiftList/User/ListFollowed/FollowedListCard";
import FindListButton from "@/Components/GiftList/Action/FindListButton";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

export default function FollowedLists({ auth, followedLists }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Listes suivies"
            subtitle="Les listes de tes proches"
            actions={<FindListButton />}
        >
            <Head title="Listes suivies" />

            <div className={PAGE_BODY}>
                {followedLists.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {followedLists.map((followedList) => (
                            <FollowedListCard
                                key={followedList.id}
                                followedList={followedList}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">
                        Tu ne suis pas encore de liste.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

FollowedLists.propTypes = {
    auth: PropTypes.object.isRequired,
    followedLists: PropTypes.array.isRequired,
};
