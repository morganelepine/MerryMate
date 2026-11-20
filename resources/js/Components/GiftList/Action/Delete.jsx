import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";

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
            <button
                type="button"
                onClick={confirmListDeletion}
                aria-label={`Supprimer la liste ${list.name}`}
                title="Supprimer la liste"
                className="shrink-0 p-2 rounded-full text-gray-500 bg-gray-200 hover:text-orange-600 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

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
                        <CancelButton onClick={closeModal} />
                        <PrimaryButton
                            size="small"
                            href={route("lists.destroy", list.id)}
                            method="delete"
                        >
                            Supprimer la liste
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}

DeleteListButton.propTypes = {
    list: PropTypes.object,
};
