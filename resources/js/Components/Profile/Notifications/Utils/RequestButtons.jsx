import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { respondToAccessRequest } from "@/api/notifications";

export default function RequestButtons({ notification }) {
    const [sending, setSending] = useState(false);

    const respondToRequest = async (
        responseToRequest,
        notificationId,
        listId,
    ) => {
        setSending(true);
        try {
            await respondToAccessRequest(
                notificationId,
                listId,
                responseToRequest,
            );
            window.location.reload();
        } catch (error) {
            // Nothing left to answer: the buttons stay disabled.
            if (error.response?.status === 410) {
                toast.error("Cette personne n'a plus de compte MerryMate.");
                return;
            }

            console.error("Error while sending the response:", error);
            toast.error(
                "Oops... ta demande n'a pas été envoyée. Recharge la page et réessaie.",
            );
            setSending(false);
        }
    };

    const respond = (response) =>
        respondToRequest(response, notification.id, notification.data.listId);

    if (notification.data.response) {
        return (
            <p className="mt-2 text-sm text-gray-600">
                Tu as{" "}
                {notification.data.response === "accepté"
                    ? "accepté"
                    : "refusé"}{" "}
                la demande.
            </p>
        );
    }

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton
                size="small"
                onClick={() => respond("accepté")}
                disabled={sending}
            >
                Accepter
            </PrimaryButton>
            <OutlineButton
                size="small"
                onClick={() => respond("décliné")}
                disabled={sending}
            >
                Refuser
            </OutlineButton>
        </div>
    );
}

RequestButtons.propTypes = {
    notification: PropTypes.object.isRequired,
};
