import { useState } from "react";
import { Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";

export default function DeleteListButton({ list }) {
    const [confirmingListDeletion, setConfirmingListDeletion] = useState(false);

    const confirmListDeletion = () => {
        setConfirmingListDeletion(true);
    };

    const closeModal = () => {
        setConfirmingListDeletion(false);
    };

    return (
        <>
            <div className="group absolute right-0 justify-center hidden sm:block">
                <button
                    onClick={confirmListDeletion}
                    aria-label="Supprimer la liste"
                >
                    <svg
                        xmlns="https://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-300 hover:text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <span className="absolute top-8 left-0 scale-0 transition-all rounded bg-orange-100 py-1 px-2 text-xs text-center text-gray-900 group-hover:scale-100">
                    Supprimer la liste
                </span>
            </div>

            <Modal show={confirmingListDeletion} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium ">
                        Êtes-vous sûr·e de vouloir supprimer cette liste ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Une fois la liste supprimée, toutes les idées ajoutées
                        seront définitivement supprimées.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={closeModal}
                            className="text-sm mr-3 hover:text-orange-500"
                        >
                            Annuler
                        </button>
                        <Link
                            as="button"
                            href={route("lists.destroy", list.id)}
                            method="delete"
                            className="items-center px-3 py-1 bg-gradient-to-r from-bordeaux-500 to-orange-500 hover:from-orange-600 hover:to-pink-600 rounded-full text-sm text-white transition ease-in-out duration-150"
                        >
                            Supprimer la liste
                        </Link>
                    </div>
                </div>
            </Modal>
        </>
    );
}

DeleteListButton.propTypes = {
    list: PropTypes.object,
};
