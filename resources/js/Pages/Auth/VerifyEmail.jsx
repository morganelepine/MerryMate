import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Vérification de l'e-mail" />

            <div className="mb-4 text-sm text-gray-600">
                Merci pour ton inscription ! Avant de commencer, peux-tu
                vérifier ton adresse e-mail en cliquant sur le lien que nous
                venons de t’envoyer ? Si tu ne l’as pas reçu, nous t’en
                enverrons un nouveau.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-lilac-800">
                    Un nouveau lien de vérification a été envoyé à l'adresse que
                    tu as fournie lors de ton inscription.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Renvoyer l'e-mail de vérification
                    </PrimaryButton>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Se déconnecter
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
