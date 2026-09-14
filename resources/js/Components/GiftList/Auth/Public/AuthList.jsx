import { useState } from "react";
import PropTypes from "prop-types";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ListOfIdeas from "@/Components/GiftList/Auth/Public/ListOfIdeas";
import EditListTitle from "@/Components/GiftList/Action/EditTitle";
import ArchiveListButton from "@/Components/GiftList/Action/Archive";
import ShareListButton from "@/Components/GiftList/Action/ShareListButton";
import AddIdeaAlert from "@/Components/GiftList/Auth/Public/Actions/AddIdeaAlert";
import ArchiveReminder from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminder";
import EmptyPublicList from "./EmptyPublicList";

export default function AuthList({ auth, list, ideas, ideas_available }) {
    const [editing, setEditing] = useState(false);

    const daysSinceLastLogin = usePage().props.days_since_last_login;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="sm:flex items-center justify-between">
                    <div className="flex items-center">
                        {editing ? (
                            <EditListTitle
                                list={list}
                                setEditing={setEditing}
                            />
                        ) : (
                            <>
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight mr-3">
                                    Ma liste "{list.name}"
                                </h2>
                                <button
                                    onClick={() => setEditing(true)}
                                    aria-label="Modifier le titre de la liste"
                                >
                                    <svg
                                        xmlns="https://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400 hover:text-orange-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex gap-4 mt-2 sm:mt-0">
                        {ideas.length > 0 && <ArchiveListButton list={list} />}
                        <ShareListButton list={list} />
                        <Link
                            as="button"
                            href={route("ideas.create", list.id)}
                            className="flex items-center hover:text-orange-500"
                            title="Ajouter une idée"
                        >
                            <svg
                                xmlns="https://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5 mr-1"
                            >
                                <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">Compléter</p>
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="max-w-4xl mx-auto pb-14 px-4 mt-6">
                {ideas.length > 0 ? (
                    <div className="flex w-full" key={list.id}>
                        <ListOfIdeas list={list} ideas={ideas} auth={auth} />
                    </div>
                ) : (
                    <EmptyPublicList auth={auth} list={list} ideas={ideas} />
                )}
            </div>

            <AddIdeaAlert
                list={list}
                ideas={ideas}
                ideas_available={ideas_available}
                daysSinceLastLogin={daysSinceLastLogin}
            />

            <ArchiveReminder
                list={list}
                daysSinceLastLogin={daysSinceLastLogin}
            />
        </AuthenticatedLayout>
    );
}

AuthList.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
    ideas: PropTypes.array,
    ideas_available: PropTypes.array,
};
