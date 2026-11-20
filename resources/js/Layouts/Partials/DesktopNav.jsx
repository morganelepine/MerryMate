import PropTypes from "prop-types";
import NavLink from "@/Components/Utils/NavLink";
import { NAV_ICONS } from "@/Components/Utils/navIcons";

const LINKS = [
    { route: "lists.authLists", icon: "lists", label: "Mes listes" },
    { route: "lists.followedLists", icon: "followed", label: "Listes suivies" },
    { route: "lists.listsToFollow", icon: "search", label: "Chercher" },
    { route: "lists.create", icon: "create", label: "Créer" },
    { route: "profile.notifications", icon: "bell", label: "Notifications" },
];

export default function DesktopNav({ unreadCount }) {
    return (
        <div className="hidden lg:flex items-center gap-1">
            {LINKS.map(({ route: name, icon, label }) => (
                <NavLink
                    key={name}
                    href={route(name)}
                    active={route().current(name)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 shrink-0"
                        aria-hidden="true"
                    >
                        <path d={NAV_ICONS[icon]} />
                    </svg>
                    {label}
                    {icon === "bell" && unreadCount > 0 && (
                        <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-orange-600 text-xs font-semibold text-white">
                            {unreadCount}
                            <span className="sr-only"> non lues</span>
                        </span>
                    )}
                </NavLink>
            ))}
        </div>
    );
}

DesktopNav.propTypes = {
    unreadCount: PropTypes.number.isRequired,
};
