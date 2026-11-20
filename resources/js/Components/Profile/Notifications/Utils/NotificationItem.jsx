import PropTypes from "prop-types";
import NotifDate from "@/Components/Profile/Notifications/Utils/NotifDate";
import { LIST_CARD } from "@/Components/GiftList/listCard";

const TONES = {
    orange: "bg-orange-100 text-orange-700",
    lilac: "bg-lilac-100 text-lilac-800",
    sage: "bg-sage-100 text-sage-800",
    gray: "bg-gray-100 text-gray-600",
};

// Heroicons solid paths, except "declined" which is an outline icon.
const ICONS = {
    followed: {
        solid: true,
        d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
    },
    request: {
        solid: true,
        d: "M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z",
    },
    accepted: {
        solid: true,
        d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",
    },
    declined: {
        solid: false,
        d: "M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636",
    },
};

export default function NotificationItem({
    notification,
    icon,
    tone,
    children,
    footer,
}) {
    const { solid, d } = ICONS[icon];

    return (
        <li className={`${LIST_CARD} items-start`}>
            <span
                aria-hidden="true"
                className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-full ${TONES[tone]}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    {...(solid
                        ? { fill: "currentColor" }
                        : {
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: 1.5,
                          })}
                >
                    <path fillRule="evenodd" d={d} />
                </svg>
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-gray-900">{children}</p>
                <NotifDate notification={notification} />
                {footer}
            </div>
        </li>
    );
}

NotificationItem.propTypes = {
    notification: PropTypes.object.isRequired,
    icon: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
    tone: PropTypes.oneOf(Object.keys(TONES)).isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
};
