import { HOME_WIDTH, PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200">
            <p
                className={`${HOME_WIDTH} ${PAGE_GUTTER} flex items-center justify-center gap-1 py-6 text-sm text-gray-500`}
            >
                Fait avec{" "}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 text-orange-500"
                    role="img"
                    aria-label="amour"
                >
                    <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                </svg>{" "}
                par{" "}
                <a
                    href="https://www.linkedin.com/in/morgane-l-a7bb5353/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-700 underline-offset-2 hover:text-orange-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 rounded"
                >
                    Morgane Lu
                    <span className="sr-only"> (nouvel onglet)</span>
                </a>
            </p>
        </footer>
    );
}
