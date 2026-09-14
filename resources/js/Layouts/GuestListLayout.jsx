import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";
import SitePage from "@/Layouts/Partials/SitePage";

export default function GuestListLayout({ header, children }) {
    return (
        <SitePage
            header={header}
            nav={
                <TopNav>
                    <div className="shrink-0 flex items-center">
                        <SiteBrand />
                    </div>
                </TopNav>
            }
        >
            {children}
        </SitePage>
    );
}
