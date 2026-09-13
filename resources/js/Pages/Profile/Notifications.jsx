import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import ListFollowed from "@/Components/Profile/Notifications/ListFollowed";
import RequestAccessToList from "@/Components/Profile/Notifications/RequestAccessToList";
import RequestDeclined from "@/Components/Profile/Notifications/RequestDeclined";
import RequestAccepted from "@/Components/Profile/Notifications/RequestAccepted";
import { getAllNotifications } from "@/api/notifications";

export default function Notifications({ auth }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getAllNotifications()
            .then(setNotifications)
            .catch((error) =>
                console.error("Error fetching notifications: ", error)
            );
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Mes notifications
                    </h2>
                </div>
            }
        >
            <Head title="Mes notifications" />

            <div className="max-w-4xl mx-auto pb-14 px-4 mt-6 space-y-5">
                {notifications.length ? (
                    notifications.map((notification) => {
                        if (notification.type === "list-followed") {
                            return (
                                <ListFollowed
                                    key={notification.id}
                                    notification={notification}
                                />
                            );
                        } else if (notification.type === "request-access") {
                            return (
                                <RequestAccessToList
                                    key={notification.id}
                                    notification={notification}
                                />
                            );
                        } else if (
                            notification.type === "response-to-request" &&
                            notification.data.response === "décliné"
                        ) {
                            return (
                                <RequestDeclined
                                    key={notification.id}
                                    notification={notification}
                                />
                            );
                        } else if (
                            notification.type === "response-to-request" &&
                            notification.data.response === "accepté"
                        ) {
                            return (
                                <RequestAccepted
                                    key={notification.id}
                                    notification={notification}
                                />
                            );
                        } else {
                            return null;
                        }
                    })
                ) : (
                    <p className="text-center">
                        Vous n'avez reçu aucune notification.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Notifications.propTypes = {
    auth: PropTypes.object.isRequired,
};
