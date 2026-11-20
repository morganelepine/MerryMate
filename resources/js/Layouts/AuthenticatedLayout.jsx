import { useState } from "react";
import useUnreadNotifications, {
    UnreadCountContext,
} from "@/hooks/useUnreadNotifications";
import DesktopNav from "@/Layouts/Partials/DesktopNav";
import UserMenu from "@/Layouts/Partials/UserMenu";
import NavDropdown from "@/Layouts/Partials/NavDropdown";
import MobileNav from "@/Layouts/Partials/MobileNav";
import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";
import SitePage from "@/Layouts/Partials/SitePage";

export default function Authenticated({
    user,
    showDesktopNav = true,
    children,
    ...pageProps
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const unreadNotifications = useUnreadNotifications();
    const unreadCount = unreadNotifications.length;

    return (
        <SitePage
            {...pageProps}
            nav={
                <TopNav
                    below={
                        <MobileNav
                            visible={showingNavigationDropdown}
                            unreadCount={unreadCount}
                        />
                    }
                >
                    {/* Equal-width sides keep the icons centred between logo and profile menu. */}
                    <div className="flex flex-1 items-center">
                        <SiteBrand href={route("lists.index")} />
                    </div>

                    {showDesktopNav && <DesktopNav unreadCount={unreadCount} />}

                    <div className="flex flex-1 items-center justify-end">
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
                </TopNav>
            }
        >
            <UnreadCountContext.Provider value={unreadCount}>
                {children}
            </UnreadCountContext.Provider>
        </SitePage>
    );
}
