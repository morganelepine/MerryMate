import { useState } from "react";
import PropTypes from "prop-types";
import { formatOwner } from "@/Components/GiftList/listCard";
import TextInput from "@/Components/Utils/TextInput";
import PageHeader from "@/Layouts/Partials/PageHeader";

export const DEFAULT_GUEST_NAME = "Anonyme";

export default function GuestListHeader({ list, setUserName }) {
    const [firstName, setFirstName] = useState("");

    const updateFirstName = (value) => {
        setFirstName(value);

        const trimmed = value.trim();
        setUserName(trimmed || DEFAULT_GUEST_NAME);
    };

    return (
        <PageHeader
            title={list.name}
            subtitle={`Liste de ${formatOwner(list)}`}
            actions={
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <label
                        htmlFor="guest_first_name"
                        className="text-sm text-gray-500 whitespace-nowrap"
                    >
                        Votre prénom (facultatif) :
                    </label>
                    <TextInput
                        id="guest_first_name"
                        name="guest_first_name"
                        value={firstName}
                        placeholder={DEFAULT_GUEST_NAME}
                        className="!mt-0 py-1 text-sm w-full sm:w-auto"
                        onChange={(e) => updateFirstName(e.target.value)}
                    />
                </div>
            }
        />
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
