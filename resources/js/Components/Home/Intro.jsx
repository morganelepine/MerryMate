import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { CARD_SURFACE } from "@/Components/Utils/surfaces";
import { HOME_WIDTH, PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

const FEATURES = [
    {
        title: "Complète",
        text: "tes listes d’envies tout au long de l’année pour ne plus être à court d’idées.",
        icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10",
    },
    {
        title: "Suis",
        text: "celles de tes proches pour trouver de l’inspiration.",
        icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
        title: "Communique",
        text: "en un clic les cadeaux que tu souhaites réserver ou acheter.",
        icon: "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z",
    },
    {
        title: "Gagne du temps",
        text: "fini les échanges à rallonge pour savoir qui offre quoi à qui.",
        icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
];

export default function Intro() {
    return (
        <div className={`${HOME_WIDTH} ${PAGE_GUTTER} py-12`}>
            <section className="grid items-center gap-12 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <p className="text-sm font-medium text-orange-600">
                        Listes de cadeaux partagées
                    </p>
                    <h1
                        className="mt-3 font-yeseva text-4xl sm:text-5xl text-gray-900"
                        style={{ textWrap: "balance" }}
                    >
                        Un joyeux compagnon pour les moments de fête
                    </h1>
                    <p className="mt-5 max-w-xl text-lg text-gray-600">
                        Crée tes listes d’envies, partage-les avec tes proches
                        et coordonne les cadeaux sans gâcher la surprise.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <PrimaryButton href={route("register")}>
                            Créer mon compte
                        </PrimaryButton>
                        <OutlineButton href={route("login")}>
                            J’ai déjà un compte
                        </OutlineButton>
                    </div>
                </div>

                <img
                    src="/images/home-purchased.webp"
                    alt="Une liste de Noël partagée : l’onglet des cadeaux déjà achetés, avec qui les a offerts"
                    width="947"
                    height="832"
                    className={`${CARD_SURFACE} mx-auto w-full max-w-xl border-2 lg:col-span-3 lg:max-w-xl lg:mr-0`}
                />
            </section>

            <section
                aria-labelledby="features-title"
                className="mt-16 lg:mt-24"
            >
                <h2 id="features-title" className="sr-only">
                    Ce que permet MerryMate
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map(({ title, text, icon }) => (
                        <li key={title} className={`${CARD_SURFACE} p-5`}>
                            <span
                                aria-hidden="true"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d={icon} />
                                </svg>
                            </span>
                            <p className="mt-4 text-sm text-gray-600">
                                <span className="block text-base font-semibold text-gray-900">
                                    {title}
                                </span>
                                {text}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
