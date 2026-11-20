import PropTypes from "prop-types";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ListOfIdeas from "@/Components/GiftList/Auth/Public/ListOfIdeas";
import ListTitle from "@/Components/GiftList/Action/ListTitle";
import ArchiveListButton from "@/Components/GiftList/Action/Archive";
import ShareListButton from "@/Components/GiftList/Action/ShareListButton";
import AddIdeaAlert from "@/Components/GiftList/Auth/Public/Actions/AddIdeaAlert";
import ArchiveReminder from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminder";
import EmptyPublicList from "@/Components/GiftList/Auth/Public/EmptyPublicList";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import {
    LIST_HEADER_CLOSED,
    LIST_WIDTH,
    PAGE_GUTTER,
} from "@/Layouts/Partials/pageContainer";

export default function AuthList({ auth, list, ideas, ideas_available }) {
    const daysSinceLastLogin = usePage().props.days_since_last_login;

    return (
        <AuthenticatedLayout
            user={auth.user}
            headerWidth={LIST_WIDTH}
            headerClassName={LIST_HEADER_CLOSED}
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <ListTitle list={list} />

                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                        <PrimaryButton
                            size="medium"
                            href={route("ideas.create", list.id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 mr-1.5 -ml-0.5"
                                aria-hidden="true"
                            >
                                <path d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Ajouter
                        </PrimaryButton>
                        <ShareListButton list={list} />
                        {ideas.length > 0 && <ArchiveListButton list={list} />}
                    </div>
                </div>
            }
        >
            <Head title={list.name} />

            <div className={`${LIST_WIDTH} ${PAGE_GUTTER} pt-8 pb-8`}>
                {ideas.length > 0 ? (
                    <ListOfIdeas ideas={ideas} />
                ) : (
                    <EmptyPublicList list={list} />
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
