import { useEffect, useState } from "react";
import { getUnreadNotifications } from "@/api/notifications";

export default function useUnreadNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([]);

    useEffect(() => {
        let cancelled = false;

        getUnreadNotifications()
            .then((unread) => {
                if (!cancelled) setUnreadNotifications(unread);
            })
            .catch((error) => {
                console.error("Error fetching unread notifications: ", error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return unreadNotifications;
}
