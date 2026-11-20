import { Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SiteBrand from "@/Layouts/Partials/SiteBrand";

export default function LoginRegister() {
    return (
        <div className="flex md:flex-row flex-col items-center justify-between md:px-32 px-8 md:space-y-0 space-y-4 shadow-md w-full py-3">
            <SiteBrand as="h1" className="md:text-3xl" />
            <div className="flex md:self-end">
                <Link
                    href={route("register")}
                    className="flex items-center mx-4 p-2 underline font-medium rounded-full text-orange-500 hover:text-orange-600"
                >
                    <p>S'inscrire</p>
                </Link>

                <PrimaryButton href={route("login")} className="mx-4">
                    Se connecter
                </PrimaryButton>
            </div>
        </div>
    );
}
