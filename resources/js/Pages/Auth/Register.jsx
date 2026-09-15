import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import ReCAPTCHA from "react-google-recaptcha";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleRecaptcha = (token) => {
        setData("recaptcha", token);
    };

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Prénom" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="last_name" value="Nom de famille" />

                    <TextInput
                        id="last_name"
                        name="last_name"
                        value={data.last_name}
                        className="mt-1 block w-full"
                        autoComplete="last_name"
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                    />

                    <InputError message={errors.last_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptcha}
                    />
                    <InputError message={errors.recaptcha} className="mt-2" />
                </div>

                <div className="flex sm:flex-row flex-col items-center justify-end mt-4 sm:space-x-4">
                    <PrimaryButton disabled={processing}>
                        Créer mon compte
                    </PrimaryButton>

                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 hover:text-orange-500 rounded-md mt-2 sm:mt-0"
                    >
                        Déjà enregistré·e ?
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
