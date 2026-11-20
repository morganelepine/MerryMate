import { createContext, useEffect, useState } from "react";
import { getUnreadNotifications } from "@/api/notifications";

// Provided by AuthenticatedLayout so pages can show the count without fetching it again.
export const UnreadCountContext = createContext(0);

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
