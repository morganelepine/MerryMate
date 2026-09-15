import React from "react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import CreatePrivateIdea from "@/Components/Ideas/PrivateList/CreatePrivateIdea";
import CreateSharedIdea from "@/Components/Ideas/PublicList/CreateSharedIdea";

export default function Create({ auth, list }) {
    const isSharedList = list.isPrivate === 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="sm:flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Compléter ma liste : {list.name}
                    </h2>
                    <Link
                        as="button"
                        href={route("lists.show", list.id)}
                        className="flex items-center mt-2 sm:mt-0 hover:text-orange-500 "
                    >
                        <div className="h-6 w-6 mr-1 flex items-center justify-center rounded-full">
                            <svg
                                xmlns="https://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-sm">Consulter la liste</p>
                    </Link>
                </div>
            }
        >
            <Head title="Compléter ma liste" />
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                {isSharedList ? (
                    <CreateSharedIdea list={list} auth={auth} />
                ) : (
                    <CreatePrivateIdea list={list} auth={auth} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Create.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
};
