export default function Footer() {
    return (
        <footer className="w-full py-3 text-gray-500 text-sm">
            <div className="flex justify-center items-center font-medium">
                <span className="">Fait avec</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 mx-1 fill-orange-500"
                >
                    <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                </svg>
                <span className="">
                    par{" "}
                    <a
                        href="https://www.linkedin.com/in/morgane-l-a7bb5353/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-orange-500 hover:underline sm:font-medium"
                    >
                        Morgane Lu
                    </a>
                </span>
            </div>
        </footer>
    );
}
