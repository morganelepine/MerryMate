import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";
import SitePage from "@/Layouts/Partials/SitePage";
import OutlineButton from "@/Components/Buttons/OutlineButton";

export default function GuestListLayout({ children, ...pageProps }) {
    return (
        <SitePage
            {...pageProps}
            nav={
                <TopNav>
                    <div className="flex flex-1 items-center">
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
