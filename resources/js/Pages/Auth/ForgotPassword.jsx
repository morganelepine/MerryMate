import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/Utils/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextInput from "@/Components/Utils/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="mb-4 text-sm text-gray-600">
                Renseigne ton adresse e-mail pour recevoir un lien de
                réinitialisation de ton mot de passe.
            </div>

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                {status && (
                    <div className="mt-2 font-medium text-sm text-lilac-800">
                        {status}
                    </div>
                )}

                <div className="flex items-center justify-center mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Recevoir le lien
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
