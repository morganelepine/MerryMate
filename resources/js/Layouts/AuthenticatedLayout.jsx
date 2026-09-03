import { useState } from "react";
import { Link } from "@inertiajs/react";
import useUnreadNotifications from "@/hooks/useUnreadNotifications";
import DesktopNav from "@/Layouts/Partials/DesktopNav";
import UserMenu from "@/Layouts/Partials/UserMenu";
import NavDropdown from "@/Layouts/Partials/NavDropdown";
import MobileNav from "@/Layouts/Partials/MobileNav";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const unreadNotifications = useUnreadNotifications();
    const unreadCount = unreadNotifications.length;

    return (
        <div className="min-h-screen bg-lavande-20">
            <nav className="sticky z-30 top-0 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("lists.index")}>
                                    <h1 className="text-xl text-center font-yeseva bg-gradient-to-r from-orange-500 to-bordeaux-500 inline-block text-transparent bg-clip-text">
                                        MerryMate
                                    </h1>
                                </Link>
                            </div>
                            <DesktopNav unreadCount={unreadCount} />
                        </div>

                        <UserMenu user={user} />

                        <NavDropdown
                            showingNavigationDropdown={
                                showingNavigationDropdown
                            }
                            setShowingNavigationDropdown={
                                setShowingNavigationDropdown
                            }
                        />
                    </div>
                </div>

                <MobileNav
                    visible={showingNavigationDropdown}
                    unreadCount={unreadCount}
                />
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
