import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SecretCode from "@/Components/GiftList/User/ListToFollow/SecretCode";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { toast } from "sonner";
import { requestAccessToList } from "@/api/notifications";

export default function ListToFollow({ auth, listToFollow }) {
    const [requestSent, setRequestSent] = useState(false);
    useEffect(() => {
        const storedRequestSent = localStorage.getItem(
            `requestSent-${listToFollow.id}`,
        );
        if (storedRequestSent === "true") {
            setRequestSent(true);
        }
    }, [listToFollow.id]);

    const [isHidden, setIsHidden] = useState(true);
    const showSecretCode = () => {
        setIsHidden((current) => !current);
    };

    const requestAccess = async (listOwnerId, listId) => {
        setRequestSent(true);

        try {
            await requestAccessToList(listOwnerId, listId);
            toast.success("Demande envoyée !");
            localStorage.setItem(`requestSent-${listId}`, "true");
        } catch (error) {
            console.error("Error while sending the request:", error);
            toast.error(
                "Oops... votre demande n'a pas été envoyée. Veuillez réessayez après avoir rechargé la page.",
            );
            setRequestSent(false);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <p>
                    La liste{" "}
                    <span className="uppercase font-semibold text-orange-500">
                        {listToFollow.name}
                    </span>{" "}
                    de {listToFollow.user_name} {listToFollow.user_lastname}
                </p>
                <small className="italic text-gray-500 mt-1 mb-2">
                    {listToFollow.isEmpty
                        ? `Créée le ${listToFollow.formatted_created_at}`
                        : `Mise à jour le ${listToFollow.formatted_updated_at}`}
                </small>
            </div>

            <div className="space-y-4 mt-2">
                <PrimaryButton
                    size="small"
                    onClick={() =>
                        requestAccess(listToFollow.user_id, listToFollow.id)
                    }
                    disabled={requestSent}
                >
                    Demander un accès
                </PrimaryButton>

                <PrimaryButton size="small" onClick={showSecretCode}>
                    Renseigner le code secret
                </PrimaryButton>

                <div className={"mt-2 " + (isHidden ? "hidden" : "block")}>
                    <SecretCode listToFollow={listToFollow} auth={auth} />
                </div>
            </div>
        </>
    );
}

ListToFollow.propTypes = {
    auth: PropTypes.object.isRequired,
    listToFollow: PropTypes.object,
};
