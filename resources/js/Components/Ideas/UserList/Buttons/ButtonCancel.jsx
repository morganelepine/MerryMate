import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function ButtonCancel({ idea, type }) {
    const { patch, processing, reset } = useForm();
    const cancelRoute =
        idea.is_multiple === 0 ? "ideas.cancel" : "multiple-ideas.cancel";

    const cancelReserve = (e) => {
        e.preventDefault();
        patch(route(cancelRoute, idea.id), {
            onSuccess: () => reset(),
        });
        toast.info(
            type === "reservation" ? "Réservation annulée" : "Achat annulé",
        );
    };

    return (
        <form onSubmit={cancelReserve}>
            <button
                className="flex items-center justify-end text-xs text-gray-400 hover:text-gray-800"
                disabled={processing}
                title={
                    type === "reservation"
                        ? "Annuler la réservation"
                        : "Annuler l'achat"
                }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                >
                    <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="block sm:hidden ml-1 mr-3">
                    {type === "reservation"
                        ? "Annuler la réservation"
                        : "Annuler l'achat"}
                </p>
            </button>
        </form>
    );
}

ButtonCancel.propTypes = {
    idea: PropTypes.object,
    type: PropTypes.string,
};
