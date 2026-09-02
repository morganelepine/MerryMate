import React from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FollowedList from "@/Components/GiftList/User/ListFollowed/FollowedListCard";
import NoListFollowed from "@/Components/GiftList/User/ListFollowed/NoListFollowed";

export default function FollowedLists({ auth, followedLists }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Les listes suivies
                </h2>
            }
        >
            <Head title="Les listes à suivre" />
            <div className="max-w-7xl mx-auto pb-14 px-4 mt-6">
                <div className="mt-6 flex justify-center">
                    {followedLists.length > 0 ? (
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center">
                            {followedLists.map((followedList) => (
                                <div
                                    className="p-5 m-5 flex flex-col text-center shadow bg-white rounded-xl"
                                    key={followedList.id}
                                >
                                    <FollowedList
                                        followedList={followedList}
                                        auth={auth}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoListFollowed />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

FollowedLists.propTypes = {
    auth: PropTypes.object.isRequired,
    followedLists: PropTypes.array,
};
