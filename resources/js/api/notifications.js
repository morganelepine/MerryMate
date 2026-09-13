import api from "@/api/client";

export function getUnreadNotifications() {
    return api
        .get("/notifications/unread")
        .then((response) => response.data.unread_notifications);
}

export function getAllNotifications() {
    return api
        .get("/notifications/all")
        .then((response) => response.data.notifications);
}

export function requestAccessToList(listOwnerId, listId) {
    return api.post(`/notifications/request-access/${listOwnerId}/${listId}`);
}

export function respondToAccessRequest(notificationId, listId, response) {
    return api.post(`/notifications/respond-access/${notificationId}/${listId}`, {
        response,
    });
}
