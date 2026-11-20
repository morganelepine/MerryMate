import { useState } from "react";
import PropTypes from "prop-types";
import TextInput from "@/Components/Utils/TextInput";
import { LIST_TITLE } from "@/Components/GiftList/listTitle";

export const DEFAULT_GUEST_NAME = "Anonyme";

export default function GuestListHeader({ list, setUserName }) {
    const [firstName, setFirstName] = useState("");

    const updateFirstName = (value) => {
        setFirstName(value);

        const trimmed = value.trim();
        setUserName(trimmed || DEFAULT_GUEST_NAME);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h1 className={LIST_TITLE}>{list.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Liste de {list.user_name} {list.user_lastname}
                </p>
            </div>

            <div className="flex items-center">
                <label
                    htmlFor="guest_first_name"
                    className="text-sm text-gray-500 italic mr-2 whitespace-nowrap"
                >
                    Votre prénom (facultatif) :
                </label>
                <TextInput
                    id="guest_first_name"
                    name="guest_first_name"
                    value={firstName}
                    placeholder={DEFAULT_GUEST_NAME}
                    className="!mt-0 py-1 text-sm"
                    onChange={(e) => updateFirstName(e.target.value)}
                />
            </div>
        </div>
    );
}

GuestListHeader.propTypes = {
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
        user_lastname: PropTypes.string,
    }).isRequired,
    setUserName: PropTypes.func.isRequired,
};
