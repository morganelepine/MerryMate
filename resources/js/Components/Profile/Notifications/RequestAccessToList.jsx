import PropTypes from "prop-types";
import NotificationItem from "@/Components/Profile/Notifications/Utils/NotificationItem";
import RequestButtons from "@/Components/Profile/Notifications/Utils/RequestButtons";

export default function RequestAccessToList({ notification }) {
    return (
        <NotificationItem
            notification={notification}
            icon="request"
            tone="orange"
            footer={<RequestButtons notification={notification} />}
        >
            <span className="font-medium">
                {notification.data.requestingUser}
            </span>{" "}
            souhaite accéder à ta liste{" "}
            <span className="font-medium">
                {notification.data.listToFollow}
            </span>
        </NotificationItem>
    );
}

RequestAccessToList.propTypes = {
    notification: PropTypes.object.isRequired,
};
