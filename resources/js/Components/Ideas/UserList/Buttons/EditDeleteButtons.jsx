import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import PencilIcon from "@/Components/Utils/PencilIcon";
import { getIdeaTitle } from "@/Components/Ideas/ideaHelpers";

const ICON_BUTTON =
    "p-1 rounded-full text-gray-500 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300";

export default function EditDeleteButtons({ idea, setEditing }) {
    const title = getIdeaTitle(idea);
    const { delete: destroy, processing } = useForm();
    const deleteIdea = (e) => {
        e.preventDefault();
        destroy(route("ideas.destroy", idea.id), {
            onSuccess: () => toast.info("Idée supprimée"),
            onError: () => {
                toast.error(
                    "Oops, cette idée a déjà été réservée ou achetée...",
                );
            },
        });
    };

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);

    const openDeleteModal = () => {
        setConfirmingDeletion(true);
    };

    const closeDeleteModal = () => {
        setConfirmingDeletion(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label={`Modifier l'idée ${title}`}
                className={ICON_BUTTON}
            >
                <PencilIcon />
            </button>

            <button
                type="button"
                onClick={openDeleteModal}
                aria-label={`Supprimer l'idée ${title}`}
                className={ICON_BUTTON}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                    aria-hidden="true"
                >
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>

            <Modal show={confirmingDeletion} onClose={closeDeleteModal}>
                <div className="flex flex-col items-center p-6">
                    <h2 className="text-lg text-center font-medium">
                        Es-tu sûr·e de vouloir supprimer cette idée ?
                    </h2>

                    <div className="mt-4">
                        <PrimaryButton
                            size="small"
                            onClick={deleteIdea}
                            disabled={processing}
                        >
                            Supprimer
                        </PrimaryButton>
                        <CancelButton onClick={closeDeleteModal} />
                    </div>
                </div>
            </Modal>
        </>
    );
}

EditDeleteButtons.propTypes = {
    idea: PropTypes.shape({
        id: PropTypes.number.isRequired,
        idea: PropTypes.string,
        link: PropTypes.string,
    }).isRequired,
    setEditing: PropTypes.func.isRequired,
};
