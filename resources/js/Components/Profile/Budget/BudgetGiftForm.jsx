import { useId, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import TextInput, { INPUT_CLASSES } from "@/Components/Utils/TextInput";
import InputLabel from "@/Components/Utils/InputLabel";
import InputError from "@/Components/Utils/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import DeleteButton from "@/Components/Buttons/DeleteButton";
import { priceToInput } from "@/Components/Ideas/ideaHelpers";
import {
    ALL_OCCASIONS,
    BUDGET_FORM,
    DEFAULT_OCCASION,
    GIFT_STATUS,
    OCCASIONS,
    cardAddButtonId,
    focusById,
    matchesOccasion,
} from "@/Components/Profile/Budget/budgetHelpers";
import useEscapeToClose from "@/hooks/useEscapeToClose";

const EDITABLE_STATUSES = ["idea", "purchased"];

export default function BudgetGiftForm({
    recipient,
    year,
    gift = null,
    occasionFilter,
    onClose,
}) {
    const id = useId();
    const formRef = useRef(null);
    const isEditing = Boolean(gift);
    const form = useForm({
        budget_recipient_id: recipient.id,
        year,
        title: gift?.title ?? "",
        price: priceToInput(gift?.price),
        status: gift?.status ?? "idea",
        // A new gift defaults to the occasion being looked at.
        occasion:
            gift?.occasion ??
            (occasionFilter === ALL_OCCASIONS
                ? DEFAULT_OCCASION
                : occasionFilter),
    });
    const { data, setData, post, patch, processing, errors } = form;

    useEscapeToClose(formRef, onClose);

    const submit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                // Moved to an occasion filtered out: its row is gone.
                if (!matchesOccasion(data.occasion, occasionFilter)) {
                    focusById(cardAddButtonId(recipient.name));
                }
            },
        };
        if (isEditing) {
            patch(route("budget-gifts.update", gift.id), options);
        } else {
            post(route("budget-gifts.store"), options);
        }
    };

    const destroy = () =>
        form.delete(route("budget-gifts.destroy", gift.id), {
            preserveScroll: true,
            // The row and its form are gone: land on the card's "add" button.
            onSuccess: () => focusById(cardAddButtonId(recipient.name)),
        });

    return (
        <form
            ref={formRef}
            onSubmit={submit}
            className={BUDGET_FORM}
            aria-label={
                isEditing
                    ? `Modifier le cadeau ${gift.title}`
                    : `Ajouter un cadeau pour ${recipient.name}`
            }
        >
            <div>
                <InputLabel htmlFor={`${id}-title`} value="Cadeau" />
                <TextInput
                    id={`${id}-title`}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={
                        errors.title ? `${id}-title-error` : undefined
                    }
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    maxLength={255}
                    required
                    isFocused
                    className="text-sm"
                />
                <InputError
                    id={`${id}-title-error`}
                    message={errors.title}
                    className="mt-1"
                />
            </div>

            <div>
                <InputLabel htmlFor={`${id}-price`} value="Prix (€)" />
                <TextInput
                    id={`${id}-price`}
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={
                        errors.price ? `${id}-price-error` : undefined
                    }
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    inputMode="decimal"
                    placeholder="34,99"
                    className="text-sm"
                />
                <InputError
                    id={`${id}-price-error`}
                    message={errors.price}
                    className="mt-1"
                />
            </div>

            <div>
                <InputLabel htmlFor={`${id}-occasion`} value="Occasion" />
                <select
                    id={`${id}-occasion`}
                    value={data.occasion}
                    onChange={(e) => setData("occasion", e.target.value)}
                    className={`${INPUT_CLASSES} text-sm`}
                >
                    {Object.entries(OCCASIONS).map(([value, { label }]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <InputError message={errors.occasion} className="mt-1" />
            </div>

            <fieldset>
                <legend className="text-sm font-medium text-gray-800">
                    Statut
                </legend>
                <div className="mt-1 flex gap-4">
                    {EDITABLE_STATUSES.map((status) => (
                        <label
                            key={status}
                            className="inline-flex items-center gap-2 text-sm"
                        >
                            <input
                                type="radio"
                                name={`${id}-status`}
                                value={status}
                                checked={data.status === status}
                                onChange={() => setData("status", status)}
                                className="text-orange-600 focus:ring-orange-300"
                            />
                            {GIFT_STATUS[status].label}
                        </label>
                    ))}
                </div>
                <InputError message={errors.status} className="mt-1" />
            </fieldset>

            <div className="flex flex-wrap items-center pt-4">
                <PrimaryButton size="small" type="submit" disabled={processing}>
                    {isEditing ? "Enregistrer" : "Ajouter"}
                </PrimaryButton>
                <CancelButton onClick={onClose} />
                {isEditing && (
                    <DeleteButton
                        label="Supprimer"
                        question={`Supprimer « ${gift.title} » ?`}
                        onConfirm={destroy}
                        processing={processing}
                        className="ml-auto"
                    />
                )}
            </div>
        </form>
    );
}

BudgetGiftForm.propTypes = {
    recipient: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    year: PropTypes.number.isRequired,
    gift: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number,
        status: PropTypes.string.isRequired,
        occasion: PropTypes.string,
    }),
    occasionFilter: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
