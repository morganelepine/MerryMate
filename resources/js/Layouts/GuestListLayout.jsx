import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";
import SitePage from "@/Layouts/Partials/SitePage";
import OutlineButton from "@/Components/Buttons/OutlineButton";

export default function GuestListLayout({ header, children }) {
    return (
        <SitePage
            header={header}
            nav={
                <TopNav>
                    <div className="shrink-0 flex items-center">
                        <SiteBrand />
                    </div>

                    <div className="flex items-center">
                        <OutlineButton
                            color="orange"
                            size="small"
                            href={route("register")}
                        >
                            Créer un compte
                        </OutlineButton>
                    </div>
                </TopNav>
            }
        >
            {children}
        </SitePage>
    );
}
