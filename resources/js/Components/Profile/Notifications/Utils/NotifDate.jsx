import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function NotifDate({ notification }) {
    return (
        <time
            dateTime={notification.created_at}
            className="block mt-0.5 text-xs text-gray-500"
        >
            {dayjs(notification.created_at).fromNow()}
        </time>
    );
}

NotifDate.propTypes = {
    notification: PropTypes.object.isRequired,
};
