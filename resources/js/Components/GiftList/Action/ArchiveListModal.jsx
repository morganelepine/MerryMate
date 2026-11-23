import { useForm } from "@inertiajs/react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import { toast } from "sonner";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";

export default function ArchiveListModal({ list, show, onClose }) {
    const { patch, processing } = useForm();

    const archiveList = () =>
        patch(route("lists.archive", list), {
            onSuccess: () => {
                onClose();
                toast.success("Liste archivée !");
            },
            onError: (errors) => {
                console.error(
                    "Erreur lors de l'archivage de la liste :",
                    errors,
                );
                toast.error(
                    "Oops, une erreur est survenue lors de l'archivage.",
                );
            },
        });

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <Modal.Title as="h2" className="text-lg font-medium">
                    Es-tu sûr·e de vouloir archiver cette liste ?
                </Modal.Title>

                <p className="mt-1 text-sm text-gray-600">
                    Une fois la liste archivée, toutes les idées qui t’ont été
                    offertes seront définitivement supprimées de ta liste.
                </p>

                <div className="mt-6 flex justify-end">
                    <CancelButton onClick={onClose} />
                    <PrimaryButton
                        type="button"
                        size="small"
                        onClick={archiveList}
                        disabled={processing}
                    >
                        Archiver la liste
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}

ArchiveListModal.propTypes = {
    list: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
