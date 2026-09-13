import PropTypes from "prop-types";
import { toast } from "sonner";
import { respondToAccessRequest } from "@/api/notifications";

export default function RequestButtons({ notification }) {
    const respondToRequest = async (
        responseToRequest,
        notificationId,
        listId
    ) => {
        try {
            await respondToAccessRequest(
                notificationId,
                listId,
                responseToRequest
            );
            window.location.reload();
        } catch (error) {
            console.error("Error while sending the response:", error);
            toast.error(
                "Oops... votre demande n'a pas été envoyée. Veuillez réessayez après avoir rechargé la page."
            );
        }
    };

    return (
        <>
            {!notification.data.response && (
                <div className="flex items-center space-x-4 text-sm border border-gray-300 rounded-full py-2 px-4 w-max ">
                    <button
                        className="flex items-center hover:text-indigo-500"
                        onClick={() => {
                            respondToRequest(
                                "accepté",
                                notification.id,
                                notification.data.listId
                            );
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Accepter
                    </button>
                    <button
                        className="flex items-center hover:text-orange-500"
                        onClick={() => {
                            respondToRequest(
                                "décliné",
                                notification.id,
                                notification.data.listId
                            );
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Refuser
                    </button>
                </div>
            )}

            {notification.data.response === "accepté" && (
                <p className="text-xs italic ml-8">
                    Vous avez accepté la demande.
                </p>
            )}

            {notification.data.response === "décliné" && (
                <p className="text-xs italic ml-8">
                    Vous avez refusé la demande.
                </p>
            )}
        </>
    );
}

RequestButtons.propTypes = {
    notification: PropTypes.object.isRequired,
};
