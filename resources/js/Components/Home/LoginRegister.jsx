import { Link } from "@inertiajs/react";

export default function LoginRegister() {
    return (
        <div className="flex md:flex-row flex-col items-center justify-between md:px-32 px-8 md:space-y-0 space-y-4 shadow-md w-full py-3">
            <h1 className="md:text-3xl text-2xl text-center font-yeseva bg-gradient-to-r from-orange-500 to-bordeaux-500 inline-block text-transparent bg-clip-text">
                MerryMate
            </h1>
            <div className="flex md:self-end">
                <Link
                    href={route("register")}
                    className="flex items-center mx-4 p-2 underline font-medium rounded-full text-orange-500 hover:text-orange-600"
                >
                    <p>S'inscrire</p>
                </Link>

                <Link
                    href={route("login")}
                    className="flex items-center text-center mx-4 py-2 px-4 font-medium rounded-full text-white bg-gradient-to-r from-orange-500 to-bordeaux-500 hover:from-bordeaux-600 hover:to-orange-600"
                >
                    <p>Se connecter</p>
                </Link>
            </div>
        </div>
    );
}
