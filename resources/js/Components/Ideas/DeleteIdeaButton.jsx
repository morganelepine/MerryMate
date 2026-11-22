import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import DeleteButton from "@/Components/Buttons/DeleteButton";

export default function DeleteIdeaButton({ idea, onBlocked, className = "" }) {
    const { delete: destroy, processing } = useForm();

    const deleteIdea = (close) => {
        destroy(route("ideas.destroy", idea.id), {
            onSuccess: () => toast.info("Idée supprimée"),
            onError: () => {
                toast.error(
                    "Oops, cette idée a déjà été réservée ou achetée...",
                );
                close();
                onBlocked?.();
            },
        });
    };

    return (
        <DeleteButton
            label="Supprimer l'idée"
            question="Es-tu sûr·e de vouloir supprimer cette idée ?"
            onConfirm={deleteIdea}
            processing={processing}
            className={className}
        />
    );
}

DeleteIdeaButton.propTypes = {
    idea: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    // Called when the idea can no longer be deleted (already reserved or purchased).
    onBlocked: PropTypes.func,
    className: PropTypes.string,
};
