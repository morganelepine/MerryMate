import PropTypes from "prop-types";
import NotifDate from "@/Components/Profile/Notifications/Utils/NotifDate";

export default function ListFollowed({ notification }) {
    return (
        <div className="flex items-center">
            <div className="my-2 mr-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-lilac-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    />
                </svg>
            </div>
            <p>
                <span>{notification.data.follower}</span> a commencé à suivre
                votre liste{" "}
                <span className="font-semibold">
                    {notification.data.listFollowed}
                </span>{" "}
                <NotifDate notification={notification} />
            </p>
        </div>
    );
}

ListFollowed.propTypes = {
    notification: PropTypes.object.isRequired,
};
