import { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { UnreadCountContext } from "@/hooks/useUnreadNotifications";
import { NAV_ICONS } from "@/Components/Utils/navIcons";

const TILE =
    "relative flex h-full flex-col gap-3 rounded-2xl border p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2";

const VARIANTS = {
    primary: {
        tile: "bg-orange-600 border-orange-600 text-white hover:bg-orange-700",
        icon: "bg-white/20 text-white",
        subtitle: "text-white/90",
    },
    default: {
        tile: "bg-white border-gray-200 text-gray-900 shadow-sm hover:border-gray-300 hover:shadow",
        icon: "bg-orange-100 text-orange-600",
        subtitle: "text-gray-500",
    },
};

function Tile({ href, icon, title, subtitle, badge, primary = false }) {
    const v = VARIANTS[primary ? "primary" : "default"];

    return (
        <Link href={href} className={`${TILE} ${v.tile}`}>
            <span
                aria-hidden="true"
                className={`flex items-center justify-center w-9 h-9 rounded-full ${v.icon}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path d={NAV_ICONS[icon]} />
                </svg>
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold">{title}</span>
                <span className={`block truncate text-xs ${v.subtitle}`}>
                    {subtitle}
                </span>
            </span>
            {badge > 0 && (
                <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-orange-600 text-xs font-semibold text-white"
                >
                    {badge}
                </span>
            )}
        </Link>
    );
}

Tile.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(Object.keys(NAV_ICONS)).isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    badge: PropTypes.number,
    primary: PropTypes.bool,
};

export default function QuickActions() {
    const unreadCount = useContext(UnreadCountContext);

    return (
        <nav aria-label="Raccourcis">
            <ul className="grid grid-cols-3 gap-3 lg:grid-cols-5">
                <li>
                    <Tile
                        primary
                        href={route("lists.create")}
                        icon="create"
                        title="Créer une liste"
                        subtitle="Anniversaire, Noël, naissance…"
                    />
                </li>
                <li>
                    <Tile
                        href={route("lists.listsToFollow")}
                        icon="search"
                        title="Chercher"
                        subtitle="Trouver la liste d’un·e proche"
                    />
                </li>
                <li>
                    <Tile
                        href={route("profile.purchase")}
                        icon="budget"
                        title="Budget"
                        subtitle="Suivre vos dépenses"
                    />
                </li>
                <li>
                    <Tile
                        href={route("profile.gifts")}
                        icon="gifts"
                        title="Cadeaux reçus"
                        subtitle="Ceux qu’on vous a offerts"
                    />
                </li>
                <li>
                    <Tile
                        href={route("profile.notifications")}
                        icon="bell"
                        title="Notifications"
                        subtitle={
                            unreadCount > 0
                                ? `${unreadCount} nouvelle${unreadCount > 1 ? "s" : ""}`
                                : "Aucune nouvelle"
                        }
                        badge={unreadCount}
                    />
                </li>
            </ul>
        </nav>
    );
}
