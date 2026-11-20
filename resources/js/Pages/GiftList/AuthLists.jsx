import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AuthListCard from "@/Components/GiftList/Auth/AuthListCard";
import CreateListButton from "@/Components/GiftList/Action/CreateListButton";
import SectionHeader from "@/Components/Utils/SectionHeader";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

function ListSection({ title, lists, emptyText }) {
    return (
        <section>
            <SectionHeader title={title} count={lists.length} />
            {lists.length > 0 ? (
                <div className="mt-4 space-y-3">
                    {lists.map((list) => (
                        <AuthListCard key={list.id} list={list} />
                    ))}
                </div>
            ) : (
                <p className="mt-6 text-gray-600">{emptyText}</p>
            )}
        </section>
    );
}

ListSection.propTypes = {
    title: PropTypes.string.isRequired,
    lists: PropTypes.array.isRequired,
    emptyText: PropTypes.string.isRequired,
};

export default function AuthLists({ auth, publicLists, privateLists }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Mes listes"
            subtitle="Les listes que vous avez créées"
            actions={<CreateListButton />}
        >
            <Head title="Mes listes" />

            <div className={`${PAGE_BODY} grid gap-12 md:grid-cols-2`}>
                <ListSection
                    title="Partagées"
                    lists={publicLists}
                    emptyText="Aucune liste partagée pour le moment."
                />
                <ListSection
                    title="Privées"
                    lists={privateLists}
                    emptyText="Aucune liste privée pour le moment."
                />
            </div>
        </AuthenticatedLayout>
    );
}

AuthLists.propTypes = {
    auth: PropTypes.object.isRequired,
    publicLists: PropTypes.array.isRequired,
    privateLists: PropTypes.array.isRequired,
};
