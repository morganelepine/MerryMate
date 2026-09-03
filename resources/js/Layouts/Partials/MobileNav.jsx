import PropTypes from "prop-types";
import ResponsiveNavLink from "@/Components/Utils/ResponsiveNavLink";

export default function MobileNav({ visible, unreadCount }) {
    return (
        <div className={(visible ? "block" : "hidden") + " lg:hidden"}>
            <div className="py-2">
                <ResponsiveNavLink
                    href={route("lists.authLists")}
                    active={route().current("lists.authLists")}
                >
                    Mes listes
                </ResponsiveNavLink>
                <ResponsiveNavLink
                    href={route("lists.followedLists")}
                    active={route().current("lists.followedLists")}
                >
                    Les listes suivies
                </ResponsiveNavLink>
                <ResponsiveNavLink
                    href={route("lists.listsToFollow")}
                    active={route().current("lists.listsToFollow")}
                >
                    Chercher une liste
                </ResponsiveNavLink>
                <ResponsiveNavLink
                    href={route("lists.create")}
                    active={route().current("lists.create")}
                    className="flex items-center"
                >
                    Créer une liste
                </ResponsiveNavLink>
            </div>

            <div className="py-2 border-t border-gray-200">
                <div className="">
                    <ResponsiveNavLink href={route("profile.edit")}>
                        Profil
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route("profile.purchase")}>
                        Budget
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route("profile.gifts")}>
                        Cadeaux reçus
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route("profile.notifications")}
                        active={route().current("profile.notifications")}
                        className="flex items-center"
                    >
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-center w-4 h-4 ml-2 rounded-full bg-orange-500 text-white text-xs font-semibold">
                                {unreadCount}
                            </span>
                        )}
                    </ResponsiveNavLink>
                </div>
                <div className="py-2 border-t border-gray-200">
                    <ResponsiveNavLink
                        method="post"
                        href={route("logout")}
                        as="button"
                    >
                        Déconnexion
                    </ResponsiveNavLink>
                </div>
            </div>
        </div>
    );
}

MobileNav.propTypes = {
    visible: PropTypes.bool.isRequired,
    unreadCount: PropTypes.number.isRequired,
};
