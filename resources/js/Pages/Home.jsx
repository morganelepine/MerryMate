import { Head } from "@inertiajs/react";
import Intro from "@/Components/Home/Intro";
import LoginRegister from "@/Components/Home/LoginRegister";
import Footer from "@/Components/Home/Footer";

export default function Home() {
    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen flex flex-col justify-between items-center">
                <LoginRegister />
                <Intro />
                <Footer />
            </div>
        </>
    );
}
