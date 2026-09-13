import { useState } from "react";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import TextInputSmall from "@/Components/Utils/TextInputSmall";
import Checkbox from "@/Components/Utils/Checkbox";

const EDIT_FIELD_CLASSNAME =
    "block w-full mt-1 border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md shadow-sm";

function DisclosureSection({ title, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white shadow-md p-5 mt-6 rounded-xl">
            <button
                type="button"
                className="flex w-full text-left cursor-pointer text-orange-500 uppercase tracking-widest"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                {title}
                <svg
                    xmlns="https://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 pl-1"
                >
                    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && children}
        </div>
    );
}

export default function IdeaFormFields({ variant, data, setData, errors }) {
    const isEdit = variant === "edit";
    const Input = isEdit ? TextInputSmall : TextInput;
    const inputClassName = isEdit ? EDIT_FIELD_CLASSNAME : "py-1";

    const field = (
        name,
        label,
        placeholder,
        { className = inputClassName, wrapperClassName = "" } = {},
    ) => (
        <div className={wrapperClassName}>
            {!isEdit && <InputLabel htmlFor={name} value={label} />}
            <Input
                id={name}
                name={name}
                value={data[name]}
                placeholder={placeholder}
                className={className}
                isFocused={name === "idea"}
                onChange={(e) => setData(name, e.target.value)}
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
                    id={name}
                    name={name}
                    type="checkbox"
                    defaultChecked={Boolean(data[name])}
                    onChange={(e) => setData(name, e.target.checked)}
                    className="mr-2"
                />
            ) : (
                <Checkbox
                    id={name}
                    name={name}
                    defaultChecked={false}
                    onChange={(e) => setData(name, e.target.checked)}
                />
            )}
            <p>{label}</p>
            <InputError message={errors[name]} className="mt-2" />
        </div>
    );

    if (isEdit) {
        return (
            <div className="space-y-2">
                {field("idea", null, "Le nom de l'idée")}
                {field("brand", null, "La marque")}
                {field("link", null, "Le lien")}
                {field(
                    "details",
                    null,
                    "Des détails sur l'article : taille, coloris...",
                )}
                {field("price", null, "Le prix (chiffre rond : 34,99 = 35)", {
                    className: EDIT_FIELD_CLASSNAME + " py-1",
                })}

                {checkboxField("favorite", "L'article est un coup de cœur")}
                {checkboxField(
                    "is_multiple",
                    "L'article peut être offert plusieurs fois",
                )}
                {checkboxField("promo", "L'article est en promo")}

                {field(
                    "promo_details",
                    null,
                    "Des détails sur la promo en cours : durée, conditions...",
                )}
                {field("membership", null, "Code / lien de parrainage")}
                {field(
                    "membership_reduction",
                    null,
                    "Réduction offerte grâce au parrainage : -15%, un acheté un offert...",
                )}
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow-md space-y-5 p-5 rounded-xl">
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
                        {field("price", "Prix", "35")}
                    </div>
                </div>

                {checkboxField(
                    "favorite",
                    "L'article est un coup de cœur",
                    "flex items-center",
                )}
                {checkboxField(
                    "is_multiple",
                    "L'article peut être offert plusieurs fois",
                    "flex items-center",
                )}
            </div>

            <DisclosureSection title="Promotion">
                <div className="space-y-5">
                    {checkboxField("promo", "L'article est en promo")}
                    {field(
                        "promo_details",
                        "Détails sur la promo en cours",
                        "Durée, conditions...",
                        { wrapperClassName: "my-2" },
                    )}
                </div>
            </DisclosureSection>

            <DisclosureSection title="Parrainage">
                <div className="space-y-5 mt-4">
                    {field(
                        "membership",
                        "Code / lien à utiliser lors de l'achat",
                        "https://nebuleusebijoux.com#ref=1835832",
                        { wrapperClassName: "my-2" },
                    )}
                    {field(
                        "membership_reduction",
                        "Réduction offerte",
                        "-15%, un acheté/un offert...",
                        { wrapperClassName: "my-2" },
                    )}
                </div>
            </DisclosureSection>
        </>
    );
}
