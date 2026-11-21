import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import SecretCode from "@/Components/GiftList/User/ListToFollow/SecretCode";
import OwnerAvatar from "@/Components/GiftList/OwnerAvatar";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { CARD_SURFACE } from "@/Components/Utils/surfaces";
import { requestAccessToList } from "@/api/notifications";
import { formatListDate, formatOwner } from "@/Components/GiftList/listCard";

export default function ListToFollowCard({ listToFollow }) {
    const [requestSent, setRequestSent] = useState(false);
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        const storedRequestSent = localStorage.getItem(
            `requestSent-${listToFollow.id}`,
        );
        if (storedRequestSent === "true") {
            setRequestSent(true);
        }
    }, [listToFollow.id]);

    const requestAccess = async (listOwnerId, listId) => {
        setRequestSent(true);

        try {
            await requestAccessToList(listOwnerId, listId);
            toast.success("Demande envoyée !");
            localStorage.setItem(`requestSent-${listId}`, "true");
        } catch (error) {
            console.error("Error while sending the request:", error);
            toast.error(
                "Oops... ta demande n'a pas été envoyée. Recharge la page et réessaie.",
            );
            setRequestSent(false);
        }
    };

    const codePanelId = `secret-code-${listToFollow.id}`;

    return (
        <div className={`${CARD_SURFACE} p-4`}>
            <div className="flex items-center gap-3">
                <OwnerAvatar list={listToFollow} />
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                        {listToFollow.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        {formatOwner(listToFollow)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatListDate(listToFollow)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <OutlineButton
                    size="small"
                    onClick={() =>
                        requestAccess(listToFollow.user_id, listToFollow.id)
                    }
                    disabled={requestSent}
                >
                    {requestSent ? "Demande envoyée" : "Demander l’accès"}
                </OutlineButton>

                <PrimaryButton
                    size="small"
                    onClick={() => setShowCode((current) => !current)}
                    aria-expanded={showCode}
                    aria-controls={codePanelId}
                >
                    J’ai le code
                </PrimaryButton>
            </div>

            {showCode && (
                <div id={codePanelId} className="mt-4">
                    <SecretCode listToFollow={listToFollow} />
                </div>
            )}
        </div>
    );
}

ListToFollowCard.propTypes = {
    listToFollow: PropTypes.object.isRequired,
};
