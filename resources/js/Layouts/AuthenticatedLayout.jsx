import { useState } from "react";
import useUnreadNotifications from "@/hooks/useUnreadNotifications";
import DesktopNav from "@/Layouts/Partials/DesktopNav";
import UserMenu from "@/Layouts/Partials/UserMenu";
import NavDropdown from "@/Layouts/Partials/NavDropdown";
import MobileNav from "@/Layouts/Partials/MobileNav";
import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";
import SitePage from "@/Layouts/Partials/SitePage";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const unreadNotifications = useUnreadNotifications();
    const unreadCount = unreadNotifications.length;

    return (
        <SitePage
            header={header}
            nav={
                <TopNav
                    below={
                        <MobileNav
                            visible={showingNavigationDropdown}
                            unreadCount={unreadCount}
                        />
                    }
                >
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <SiteBrand href={route("lists.index")} />
                        </div>
                        <DesktopNav unreadCount={unreadCount} />
                    </div>

                    <UserMenu user={user} />

                    <NavDropdown
                        showingNavigationDropdown={showingNavigationDropdown}
                        setShowingNavigationDropdown={
                            setShowingNavigationDropdown
                        }
                    />
                </TopNav>
            }
        >
            {children}
        </SitePage>
    );
}
