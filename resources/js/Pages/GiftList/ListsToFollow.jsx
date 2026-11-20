import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SearchList from "@/Components/GiftList/Action/Search";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

export default function ListsToFollow({ auth, listsToFollow }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Chercher une liste"
            subtitle="Retrouve la liste d’un proche par son prénom ou le nom de la liste"
        >
            <Head title="Chercher une liste" />

            <div className={PAGE_BODY}>
                {listsToFollow.length > 0 ? (
                    <SearchList auth={auth} />
                ) : (
                    <p className="text-gray-600">
                        Il n’y a actuellement aucune liste à suivre. Reviens
                        plus tard&nbsp;!
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

ListsToFollow.propTypes = {
    auth: PropTypes.object.isRequired,
    listsToFollow: PropTypes.array.isRequired,
};
