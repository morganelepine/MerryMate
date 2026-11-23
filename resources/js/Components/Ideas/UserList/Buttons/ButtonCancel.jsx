import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { STATUS_ICONS } from "@/Components/Ideas/statusIcons";

export default function ButtonCancel({ idea, type }) {
    const { patch, processing, reset } = useForm();
    const cancelRoute =
        idea.is_multiple === 0 ? "ideas.cancel" : "multiple-ideas.cancel";

    const cancelReserve = (e) => {
        e.preventDefault();
        patch(route(cancelRoute, idea.id), {
            preserveScroll: true,
            // Keeps the list's open tab (IdeasToReserve state) after the reload.
            preserveState: true,
            onSuccess: () => {
                reset();
                toast.info(
                    type === "reservation"
                        ? "Réservation annulée"
                        : "Achat annulé",
                );
            },
            onError: () => toast.error("Oops, une erreur est survenue."),
        });
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
                    <path d={STATUS_ICONS.cancel} />
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
