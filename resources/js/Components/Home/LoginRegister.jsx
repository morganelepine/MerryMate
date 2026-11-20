import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import TopNav from "@/Layouts/Partials/TopNav";
import SiteBrand from "@/Layouts/Partials/SiteBrand";

export default function LoginRegister() {
    return (
        <TopNav>
            <div className="flex flex-1 items-center">
                <SiteBrand />
            </div>
            <div className="flex items-center gap-2">
                <OutlineButton
                    size="medium"
                    href={route("register")}
                    className="hidden sm:inline-flex"
                >
                    S’inscrire
                </OutlineButton>
                <PrimaryButton size="medium" href={route("login")}>
                    Se connecter
                </PrimaryButton>
            </div>
        </TopNav>
    );
}
