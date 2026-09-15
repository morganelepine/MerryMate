import React from "react";
import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function FollowedList({ followedList }) {
    return (
        <div className="flex flex-col items-center">
            <p>
                La liste{" "}
                <span className="uppercase font-semibold text-orange-500">
                    {followedList.name}
                </span>{" "}
                de {followedList.user_name} {followedList.user_lastname}
            </p>
            <small className="italic text-gray-500 mt-1 mb-2">
                {followedList.isEmpty
                    ? `Créée le ${followedList.formatted_created_at}`
                    : `Mise à jour le ${followedList.formatted_updated_at}`}
            </small>
            <PrimaryButton
                size="small"
                key={followedList.id}
                href={route("lists.show", followedList.id)}
            >
                Voir la liste
            </PrimaryButton>
        </div>
    );
}

FollowedList.propTypes = {
    followedList: PropTypes.object,
};
