import PropTypes from "prop-types";
import NotificationItem from "@/Components/Profile/Notifications/Utils/NotificationItem";

export default function RequestAccepted({ notification }) {
    return (
        <NotificationItem
            notification={notification}
            icon="accepted"
            tone="sage"
        >
            <span className="font-medium">{notification.data.listOwner}</span> a
            accepté votre demande de suivre sa liste{" "}
            <span className="font-medium">{notification.data.list}</span>
        </NotificationItem>
    );
}

RequestAccepted.propTypes = {
    notification: PropTypes.object.isRequired,
};
