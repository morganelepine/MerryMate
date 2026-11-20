import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import ListFollowed from "@/Components/Profile/Notifications/ListFollowed";
import RequestAccessToList from "@/Components/Profile/Notifications/RequestAccessToList";
import RequestDeclined from "@/Components/Profile/Notifications/RequestDeclined";
import RequestAccepted from "@/Components/Profile/Notifications/RequestAccepted";
import { getAllNotifications } from "@/api/notifications";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

export default function Notifications({ auth }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getAllNotifications()
            .then(setNotifications)
            .catch((error) =>
                console.error("Error fetching notifications: ", error),
            );
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} title="Notifications">
            <Head title="Notifications" />

            <div className={PAGE_BODY}>
                {notifications.length ? (
                    <ul className="space-y-3">
                        {notifications.map((notification) => {
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
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-600">
                        Tu n'as reçu aucune notification.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Notifications.propTypes = {
    auth: PropTypes.object.isRequired,
};
