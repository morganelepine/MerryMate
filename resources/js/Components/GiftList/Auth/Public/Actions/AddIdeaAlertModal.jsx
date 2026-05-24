import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import LinkButton from "@/Components/Buttons/LinkButton";
import { Link } from "@inertiajs/react";

export default function AddIdeaAlertModal({
    list,
    ideas_available,
    modalVisible,
    closeModal,
}) {
    let numberOfAvailableIdeas;
    if (ideas_available.length === 0) {
        numberOfAvailableIdeas = " d'idée disponible";
    } else {
        numberOfAvailableIdeas =
            ideas_available.length === 1
                ? ` qu'une idée disponible`
                : ` que ${ideas_available.length} idées disponibles`;
    }

    const handleNoReminder = () => {
        localStorage.setItem(
            `few-ideas-left-reminder-${list.id}`,
            "no-reminder",
        );
        closeModal();
    };

    return (
        <Modal show={modalVisible} onClose={closeModal}>
            <button
                onClick={closeModal}
                className="text-sm hover:text-orange-500 absolute top-2 right-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 28 28"
                    stroke="currentColor"
                    className="h-8 w-8"
                >
                    <path d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="py-8 px-16 align-center">
                <p className="text-gray-600 text-center">
                    Ça reste entre nous, mais il ne reste plus
                    {numberOfAvailableIdeas} dans votre liste...
                </p>
                <div className="mt-4 flex flex-col text-center">
                    <Link
                        as="button"
                        href={route("ideas.create", list.id)}
                        className="self-center px-5 pt-1 pb-1.5 bg-gradient-to-r from-bordeaux-500 to-orange-500 hover:from-orange-600 hover:to-pink-600 rounded-full text-sm text-white transition ease-in-out duration-150"
                    >
                        Ajouter des idées
                    </Link>
                    <LinkButton onClick={handleNoReminder}>
                        Ne plus me le rappeler
                    </LinkButton>
                    <div className="flex justify-center">
                        <p className="text-gray-600 text-xs italic">
                            ...pendant 30 jours
                        </p>
                        <span className="text-xs pl-1">😄</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

AddIdeaAlertModal.propTypes = {
    ideas_available: PropTypes.array,
    list: PropTypes.object,
    modalVisible: PropTypes.bool,
    closeModal: PropTypes.func,
};
