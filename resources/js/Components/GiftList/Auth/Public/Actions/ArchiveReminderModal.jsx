import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import useArchiveList from "@/hooks/useArchiveList";

export default function ArchiveReminderModal({
    list,
    modalVisible,
    closeModal,
}) {
    const { archiveList, processing } = useArchiveList(list, closeModal);

    return (
        <Modal show={modalVisible} onClose={closeModal}>
            <button
                type="button"
                onClick={closeModal}
                className="text-sm hover:text-orange-500 absolute top-2 right-2"
                aria-label="Fermer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 28 28"
                    stroke="currentColor"
                    className="h-8 w-8"
                    aria-hidden="true"
                >
                    <path d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="py-8 px-10 text-center">
                <Modal.Title as="h2" className="text-gray-600 font-bold">
                    L'événement est passé ?<br />
                    Pense à archiver ta liste !
                </Modal.Title>
                <p className="text-gray-600 mt-4">
                    Tous les cadeaux qui t’ont été offerts seront retirés de la
                    liste. Mais pas d'inquiétude, les idées toujours disponibles
                    resteront bien affichées dans ta liste.
                </p>
                <div className="mt-4 flex justify-center">
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

ArchiveReminderModal.propTypes = {
    list: PropTypes.object.isRequired,
    modalVisible: PropTypes.bool,
    closeModal: PropTypes.func,
};
