import { Head, Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AuthListCard from "@/Components/GiftList/Auth/AuthListCard";
import NoListCreated from "@/Components/GiftList/Auth/NoListCreated";

export default function AuthLists({ auth, publicLists, privateLists }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="sm:flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Consulter et compléter mes listes
                    </h2>
                    {(publicLists.length > 0 || privateLists.length > 0) && (
                        <Link
                            as="button"
                            href={route("lists.create")}
                            className="flex items-center mt-2 sm:mt-0 hover:text-orange-500"
                        >
                            <div className="h-6 w-6 mr-1 flex items-center justify-center rounded-full">
                                <svg
                                    xmlns="https://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm">Créer une liste</p>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Mes listes" />

            <div className="max-w-7xl mx-auto px-4 sm:p-4">
                <div className="sm:mt-6 sm:flex justify-evenly pb-20 sm:space-x-14">
                    <div className="flex flex-col items-center sm:w-80 mt-12 sm:mt-0">
                        <h1 className="text-xl text-center font-semibold mb-2">
                            Mes listes partagées
                        </h1>
                        {publicLists.length ? (
                            <div className="w-full space-y-3">
                                {publicLists.map((list) => (
                                    <AuthListCard key={list.id} list={list} />
                                ))}
                            </div>
                        ) : (
                            <NoListCreated listType="à partager" />
                        )}
                    </div>

                    <div className="flex flex-col items-center sm:w-80 mt-12 sm:mt-0">
                        <h1 className="text-xl text-center font-semibold mb-2">
                            Mes listes privées
                        </h1>
                        {privateLists.length ? (
                            <div className="w-full space-y-3">
                                {privateLists.map((list) => (
                                    <AuthListCard key={list.id} list={list} />
                                ))}
                            </div>
                        ) : (
                            <NoListCreated listType="privée" />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

AuthLists.propTypes = {
    auth: PropTypes.object.isRequired,
    publicLists: PropTypes.array,
    privateLists: PropTypes.array,
};
