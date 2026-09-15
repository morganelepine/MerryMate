import { useState } from "react";
import PropTypes from "prop-types";
import TextInput from "@/Components/Utils/TextInput";

export const DEFAULT_GUEST_NAME = "Anonyme";

export default function GuestListHeader({ list, setUserName }) {
    const [firstName, setFirstName] = useState("");

    const updateFirstName = (value) => {
        setFirstName(value);

        const trimmed = value.trim();
        setUserName(trimmed || DEFAULT_GUEST_NAME);
    };

    return (
        <div className="sm:flex items-center justify-between">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-2 sm:mb-0">
                La liste "{list.name}" de {list.user_name} {list.user_lastname}
            </h2>

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
