import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ListTitle from "@/Components/GiftList/Action/ListTitle";
import MakeListPublicButton from "@/Components/GiftList/Action/MakeListPublic";
import {
    LIST_HEADER_CLOSED,
    LIST_WIDTH,
    PAGE_BOTTOM,
    PAGE_GUTTER,
} from "@/Layouts/Partials/pageContainer";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CreatePrivateIdea from "@/Components/Ideas/PrivateList/CreatePrivateIdea";
import ShowPrivateIdea from "@/Components/Ideas/PrivateList/ShowPrivateIdea";

export default function AuthPrivateList({ auth, list, ideas }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            headerWidth={LIST_WIDTH}
            headerClassName={LIST_HEADER_CLOSED}
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <ListTitle list={list} />
                    <MakeListPublicButton list={list} />
                </div>
            }
        >
            <Head title={list.name} />

            <div className={`${LIST_WIDTH} ${PAGE_GUTTER} pt-8 ${PAGE_BOTTOM}`}>
                {ideas.length > 0 ? (
                    <>
                        {/* ADD IDEA FORM */}
                        <CreatePrivateIdea auth={auth} list={list} />

                        {/* LIST OF IDEAS */}
                        <div className="mt-10">
                            {ideas.map((idea) => (
                                <div key={idea.id} className="mb-5 flex">
                                    <ShowPrivateIdea auth={auth} idea={idea} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col text-center gap-4">
                        <p>
                            Ta liste est vide. Clique sur ce bouton pour la
                            compléter :
                        </p>
                        <PrimaryButton href={route("ideas.create", list.id)}>
                            Commencer la liste
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

AuthPrivateList.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
    ideas: PropTypes.array,
};
