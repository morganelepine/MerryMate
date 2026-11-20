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
                Merci pour votre inscription ! Avant de commencer, pourriez-vous
                vérifier votre adresse e-mail en cliquant sur le lien que nous
                venons de vous envoyer par e-mail ? Si vous ne l'avez pas reçu,
                nous vous en enverrons un nouveau.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-lilac-800">
                    Un nouveau lien de vérification a été envoyé à l'adresse que
                    vous avez fournie lors de votre inscription.
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
