import { Link } from "@inertiajs/react";

export default function HeaderLogo() {
    return (
        <div className="flex items-center h-16">
            <Link href="/">
                <h1 className="text-xl text-center font-yeseva bg-gradient-to-r from-orange-500 to-bordeaux-500 inline-block text-transparent bg-clip-text">
                    MerryMate
                </h1>
            </Link>
        </div>
    );
}
