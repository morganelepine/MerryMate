import PropTypes from "prop-types";
import NotificationItem from "@/Components/Profile/Notifications/Utils/NotificationItem";

export default function RequestDeclined({ notification }) {
    return (
        <NotificationItem
            notification={notification}
            icon="declined"
            tone="gray"
        >
            <span className="font-medium">{notification.data.listOwner}</span> a
            refusé ta demande de suivre sa liste{" "}
            <span className="font-medium">{notification.data.list}</span>
        </NotificationItem>
    );
}

RequestDeclined.propTypes = {
    notification: PropTypes.object.isRequired,
};
