import { useId, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/Utils/TextInput";
import InputLabel from "@/Components/Utils/InputLabel";
import InputError from "@/Components/Utils/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import {
    BUDGET_CARDS_TITLE_ID,
    focusById,
} from "@/Components/Profile/Budget/budgetHelpers";
import useEscapeToClose from "@/hooks/useEscapeToClose";

// Without `recipient`, creates one (optionally pre-filled with `defaultName`).
export default function BudgetRecipientForm({
    recipient = null,
    defaultName = "",
    onClose,
    onSaved,
    className = "",
}) {
    const id = useId();
    const formRef = useRef(null);
    const isEditing = Boolean(recipient);
    const form = useForm({ name: recipient?.name ?? defaultName });
    const { data, setData, post, patch, processing, errors } = form;

    useEscapeToClose(formRef, onClose);

    const submit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                onSaved?.(data.name);
            },
        };
        if (isEditing) {
            patch(route("budget-recipients.update", recipient.id), options);
        } else {
            post(route("budget-recipients.store"), options);
        }
    };

    const destroy = () =>
        form.delete(route("budget-recipients.destroy", recipient.id), {
            preserveScroll: true,
            // The whole card is gone: land on the section title.
            onSuccess: () => focusById(BUDGET_CARDS_TITLE_ID),
        });

    return (
        <form ref={formRef} onSubmit={submit} className={className}>
            <InputLabel htmlFor={`${id}-name`} value="Prénom ou groupe" />
            <TextInput
                id={`${id}-name`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${id}-name-error` : undefined}
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                maxLength={255}
                placeholder="Maman, Cousins…"
                required
                isFocused
                className="text-sm"
            />
            <InputError
                id={`${id}-name-error`}
                message={errors.name}
                className="mt-1"
            />

            <div className="mt-3 flex flex-wrap items-center gap-y-2">
                <PrimaryButton size="small" type="submit" disabled={processing}>
                    {isEditing ? "Enregistrer" : "Ajouter"}
                </PrimaryButton>
                <CancelButton onClick={onClose} />
                {isEditing && (
                    <DeleteButton
                        label="Supprimer"
                        question={`Supprimer ${recipient.name} et tous ses cadeaux, toutes années confondues ?`}
                        onConfirm={destroy}
                        processing={processing}
                        className="ml-auto"
                    />
                )}
            </div>
        </form>
    );
}

BudgetRecipientForm.propTypes = {
    recipient: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }),
    defaultName: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    // Called with the saved name, once the page has the new props.
    onSaved: PropTypes.func,
    className: PropTypes.string,
};
