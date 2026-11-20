import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreatePrivateIdea from "@/Components/Ideas/PrivateList/CreatePrivateIdea";
import CreateSharedIdea from "@/Components/Ideas/PublicList/CreateSharedIdea";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { PANEL } from "@/Components/Utils/surfaces";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

export default function Create({ auth, list }) {
    const isSharedList = list.isPrivate === 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Ajouter une idée"
            subtitle={`Liste « ${list.name} »`}
            actions={
                <OutlineButton
                    size="medium"
                    href={route("lists.show", list.id)}
                >
                    Voir la liste
                </OutlineButton>
            }
        >
            <Head title="Ajouter une idée" />

            <div className={PAGE_BODY}>
                {isSharedList ? (
                    <div className={`${PANEL} max-w-2xl`}>
                        <CreateSharedIdea list={list} auth={auth} />
                    </div>
                ) : (
                    <CreatePrivateIdea list={list} auth={auth} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Create.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object.isRequired,
};
