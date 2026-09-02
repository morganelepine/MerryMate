import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchList from "@/Components/GiftList/Action/Search";

export default function ListsToFollow({ auth, listsToFollow, token }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Les listes à suivre
                </h2>
            }
        >
            <Head title="Les listes à suivre" />
            <div className="max-w-7xl mx-auto pb-14 px-4 sm:flex justify-center">
                <div className="mt-6 sm:w-80">
                    {listsToFollow.length > 0 ? (
                        <SearchList auth={auth} token={token} />
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-center">
                                Il n'y a actuellement aucune liste à suivre.
                                Revenez plus tard&nbsp;!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

ListsToFollow.propTypes = {
    auth: PropTypes.object.isRequired,
    listsToFollow: PropTypes.array,
};
