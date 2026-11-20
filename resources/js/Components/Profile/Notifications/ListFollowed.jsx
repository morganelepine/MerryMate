import PropTypes from "prop-types";
import NotificationItem from "@/Components/Profile/Notifications/Utils/NotificationItem";

export default function ListFollowed({ notification }) {
    return (
        <NotificationItem
            notification={notification}
            icon="followed"
            tone="lilac"
        >
            <span className="font-medium">{notification.data.follower}</span> a
            commencé à suivre votre liste{" "}
            <span className="font-medium">
                {notification.data.listFollowed}
            </span>
        </NotificationItem>
    );
}

ListFollowed.propTypes = {
    notification: PropTypes.object.isRequired,
};
