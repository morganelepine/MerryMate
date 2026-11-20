import { Head } from "@inertiajs/react";
import Intro from "@/Components/Home/Intro";
import LoginRegister from "@/Components/Home/LoginRegister";
import Footer from "@/Components/Home/Footer";

export default function Home() {
    return (
        <>
            <Head title="Listes de cadeaux partagées" />

            <div className="min-h-screen flex flex-col bg-cream">
                <LoginRegister />
                <main className="flex-1">
                    <Intro />
                </main>
                <Footer />
            </div>
        </>
    );
}
