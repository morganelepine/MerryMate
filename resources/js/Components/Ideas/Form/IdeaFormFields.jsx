import { useId } from "react";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import TextInputSmall from "@/Components/Utils/TextInputSmall";
import Checkbox from "@/Components/Utils/Checkbox";

const EDIT_FIELD_CLASSNAME =
    "block w-full mt-1 border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md shadow-sm";

// Opens the numeric keypad (with a comma) on mobile.
const PRICE_INPUT_PROPS = { inputMode: "decimal" };
const DATE_INPUT_PROPS = { type: "date" };

export default function IdeaFormFields({ variant, data, setData, errors }) {
    const isEdit = variant === "edit";
    const Input = isEdit ? TextInputSmall : TextInput;
    const inputClassName = isEdit ? EDIT_FIELD_CLASSNAME : "py-1";
    // Several edit forms can be open at once: ids must stay unique on the page.
    const formId = useId();
    const idFor = (name) => `${formId}-${name}`;

    const field = (
        name,
        label,
        placeholder,
        {
            className = inputClassName,
            wrapperClassName = "",
            labelClassName = "",
            inputProps = {},
            // A date input shows no placeholder: its label must stay visible.
            showEditLabel = false,
        } = {},
    ) => (
        <div className={wrapperClassName}>
            {/* The edit variant has no visible labels: its placeholders name the fields. */}
            <InputLabel
                htmlFor={idFor(name)}
                value={isEdit ? placeholder : label}
                className={
                    isEdit
                        ? showEditLabel
                            ? "text-sm text-gray-600"
                            : "sr-only"
                        : labelClassName
                }
            />
            <Input
                id={idFor(name)}
                name={name}
                value={data[name]}
                placeholder={placeholder}
                className={className}
                isFocused={name === "idea"}
                onChange={(e) => setData(name, e.target.value)}
                {...inputProps}
            />
            <InputError message={errors[name]} className="mt-2" />
        </div>
    );

    const checkboxField = (
        name,
        label,
        wrapperClassName = "flex items-center mt-3 mb-4",
    ) => (
        <div className={wrapperClassName}>
            {isEdit ? (
                <TextInputSmall
                    id={idFor(name)}
                    name={name}
                    type="checkbox"
                    checked={Boolean(data[name])}
                    onChange={(e) => setData(name, e.target.checked)}
                    className="mr-2"
                />
            ) : (
                <Checkbox
                    id={idFor(name)}
                    name={name}
                    checked={Boolean(data[name])}
                    onChange={(e) => setData(name, e.target.checked)}
                />
            )}
            <label htmlFor={idFor(name)} className="cursor-pointer">
                {label}
            </label>
            <InputError message={errors[name]} className="mt-2" />
        </div>
    );

    if (isEdit) {
        return (
            <div className="space-y-2">
                {field("idea", null, "Nom de l'idée")}
                {field("brand", null, "Marque")}
                {field("link", null, "Lien")}
                {field(
                    "details",
                    null,
                    "Détails sur l'article : taille, coloris...",
                )}
                {field("price", null, "Prix", {
                    className: EDIT_FIELD_CLASSNAME + " py-1",
                    inputProps: PRICE_INPUT_PROPS,
                })}

                {checkboxField("favorite", "Coup de cœur")}
                {checkboxField(
                    "is_multiple",
                    "Peut être offert plusieurs fois",
                )}
                {checkboxField("promo", "En promo")}

                {Boolean(data.promo) && (
                    <div className="grid grid-cols-2 gap-2 items-end">
                        {field("promo_price", "Nouveau prix", "Prix promo", {
                            className: EDIT_FIELD_CLASSNAME + " py-1",
                            inputProps: PRICE_INPUT_PROPS,
                        })}
                        {field(
                            "promo_end_date",
                            null,
                            "Fin de la promo (facultatif)",
                            {
                                className: EDIT_FIELD_CLASSNAME + " py-1",
                                inputProps: DATE_INPUT_PROPS,
                                showEditLabel: true,
                            },
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {field("idea", "Nom de l'idée", "Puzzle 500 pièces")}
            {field(
                "link",
                "Lien",
                "https://www.fleux.com/puzzle-snowdonia-500-pieces.html",
            )}

            <div className="flex sm:flex-row flex-col w-full space-y-5 sm:space-y-0 sm:space-x-8">
                <div className="sm:w-2/5">
                    {field("brand", "Marque", "Fleux")}
                </div>
                <div className="sm:w-2/5">
                    {field(
                        "details",
                        "Détails",
                        "Taille, coloris, quantité...",
                    )}
                </div>
                <div className="sm:w-1/5">
                    {field("price", "Prix", "34,99", {
                        inputProps: PRICE_INPUT_PROPS,
                    })}
                </div>
            </div>

            {checkboxField("favorite", "Coup de cœur", "flex items-center")}
            {checkboxField(
                "is_multiple",
                "Peut être offert plusieurs fois",
                "flex items-center",
            )}

            {checkboxField("promo", "En promo", "flex items-center")}

            {Boolean(data.promo) && (
                <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-8">
                    <div className="sm:w-1/5">
                        {field("promo_price", "Prix promo", "29,99", {
                            inputProps: PRICE_INPUT_PROPS,
                        })}
                    </div>
                    <div className="sm:w-2/5">
                        {field(
                            "promo_end_date",
                            "Fin de la promo (facultatif)",
                            null,
                            { inputProps: DATE_INPUT_PROPS },
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
