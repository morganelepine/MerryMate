import { useEffect } from "react";
import Checkbox from "@/Components/Utils/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextInput from "@/Components/Utils/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: true,
        showPassword: false, // Add a new state to track password visibility
    });

    const showPassword = data.showPassword;
    const togglePasswordVisibility = () => {
        setData("showPassword", !showPassword);
    };

    const passwordType = showPassword ? "text" : "password";

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            {status && (
                <div className="mb-4 font-medium text-sm text-indigo-500">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={data.email}
                        className="px-4 py-2"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <div className="relative container mx-auto mt-1">
                        <TextInput
                            id="password"
                            name="password"
                            type={passwordType}
                            placeholder="Mot de passe"
                            className="px-4 py-2"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-4 pt-1 text-gray-600 hover:text-orange-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-xs italic text-gray-600 hover:text-orange-500 rounded-md order-2 md:order-1 mt-2 sm:mt-0"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="text-sm text-gray-600">
                            Se souvenir de moi
                        </span>
                    </label>
                </div>

                <div className="flex sm:flex-row flex-col items-center justify-end mt-4 sm:space-x-4">
                    <PrimaryButton disabled={processing}>
                        Se connecter
                    </PrimaryButton>

                    <Link
                        href={route("register")}
                        className="underline text-sm text-gray-600 hover:text-orange-500 rounded-md mt-2 sm:mt-0"
                    >
                        Pas encore de compte ?
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
