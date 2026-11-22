import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";

// Save, cancel and, when editing, delete: shared by the budget's inline forms.
export default function BudgetFormActions({
    isEditing,
    processing,
    onClose,
    deleteQuestion,
    onDelete,
    className = "",
}) {
    return (
        <div className={`flex flex-wrap items-center gap-y-2 ${className}`}>
            <PrimaryButton size="small" type="submit" disabled={processing}>
                {isEditing ? "Enregistrer" : "Ajouter"}
            </PrimaryButton>
            <CancelButton onClick={onClose} />
            {isEditing && (
                <DeleteButton
                    label="Supprimer"
                    question={deleteQuestion}
                    onConfirm={onDelete}
                    processing={processing}
                    className="ml-auto"
                />
            )}
        </div>
    );
}

BudgetFormActions.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    processing: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // Both required when editing.
    deleteQuestion: PropTypes.string,
    onDelete: PropTypes.func,
    className: PropTypes.string,
};
