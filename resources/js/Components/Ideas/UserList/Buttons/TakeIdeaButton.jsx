import { useState } from "react";
import PropTypes from "prop-types";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import ChoiceField from "@/Components/Ideas/UserList/Buttons/ChoiceField";

// Reserves or purchases an idea. A multiple idea first asks which model is offered.
export default function TakeIdeaButton({
    idea,
    userName,
    routeName,
    label,
    icon,
    confirmLabel,
    successMessage,
}) {
    const [asking, setAsking] = useState(false);
    const [choice, setChoice] = useState("");
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const openModal = () => {
        // Buying a reserved idea: the model was already given when reserving it.
        setChoice(idea.choice ?? "");
        setErrors({});
        setAsking(true);
    };

    const closeModal = () => setAsking(false);

    const take = (chosenModel) =>
        router.patch(
            route(routeName, idea.id),
            { userName, choice: chosenModel },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    closeModal();
                    toast.success(successMessage);
                },
                onError: (errors) => {
                    setErrors(errors);
                    toast.error("Oops, une erreur est survenue.");
                },
            },
        );

    const submit = (e) => {
        e.preventDefault();
        take(choice);
    };

    return (
        <>
            <button
                type="button"
                onClick={() =>
                    idea.is_multiple === 1 ? openModal() : take("")
                }
                className="flex items-center justify-end text-xs text-gray-400 hover:text-gray-800"
                disabled={processing}
                title={label}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                    aria-hidden="true"
                >
                    <path d={icon} />
                </svg>
                <span className="block sm:hidden ml-1 mr-5">{label}</span>
            </button>

            <Modal show={asking} onClose={closeModal}>
                <div className="p-6 flex flex-col items-center">
                    <Modal.Title
                        as="h2"
                        className="text-lg text-center font-medium"
                    >
                        Quel modèle souhaites-tu offrir&nbsp;?
                    </Modal.Title>
                    <p className="mt-1 text-sm text-center text-gray-600">
                        Cela permettra aux autres personnes de ne pas acheter le
                        même modèle.
                    </p>

                    <form
                        onSubmit={submit}
                        className="flex flex-col space-y-2 mt-4 w-full sm:w-3/4"
                    >
                        <ChoiceField
                            value={choice}
                            onChange={setChoice}
                            error={errors.choice}
                            required
                        />

                        <div className="flex flex-col justify-center space-y-2 mt-4">
                            <PrimaryButton
                                size="small"
                                type="submit"
                                disabled={processing}
                            >
                                {confirmLabel}
                            </PrimaryButton>

                            <button
                                type="button"
                                onClick={() => take("")}
                                disabled={processing}
                                className="mt-2 underline underline-offset-4 text-gray-600 hover:text-orange-500 text-sm disabled:opacity-25"
                            >
                                Confirmer sans modèle
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

TakeIdeaButton.propTypes = {
    idea: PropTypes.shape({
        id: PropTypes.number.isRequired,
        is_multiple: PropTypes.number.isRequired,
        choice: PropTypes.string,
    }).isRequired,
    userName: PropTypes.string,
    routeName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    // SVG path.
    icon: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    successMessage: PropTypes.string.isRequired,
};
