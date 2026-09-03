import { useEffect, useState } from "react";

export default function useUnreadNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const fetchUnreadNotifications = async () => {
            try {
                const response = await fetch("/notifications/unread");
                const data = await response.json();
                if (!cancelled) {
                    setUnreadNotifications(data.unread_notifications);
                }
            } catch (error) {
                console.error("Error fetching unread notifications: ", error);
            }
        };

        fetchUnreadNotifications();

        return () => {
            cancelled = true;
        };
    }, []);

    return unreadNotifications;
}
