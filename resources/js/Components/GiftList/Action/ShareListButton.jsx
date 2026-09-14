import PropTypes from "prop-types";
import { toast } from "sonner";

export default function ShareListButton({ list }) {
    const buildShareMessage = () => {
        const url = route("lists.show", list.id);
        return `Voici le lien vers ma liste MerryMate : ${url}\nCode secret : ${list.private_code}`;
    };

    const share = async () => {
        const text = buildShareMessage();

        if (navigator.share) {
            try {
                await navigator.share({ text });
            } catch (error) {
                // The visitor closing the native share sheet isn't an error.
                if (error?.name !== "AbortError") {
                    toast.error("Oops, une erreur est survenue.");
                }
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            toast.success("Lien et code copiés !");
        } catch {
            toast.error("Oops, une erreur est survenue.");
        }
    };

    return (
        <button
            type="button"
            onClick={share}
            className="flex items-center hover:text-orange-500"
            title="Partager ma liste"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 mr-1"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
            </svg>
            <p className="text-sm">Partager</p>
        </button>
    );
}

ShareListButton.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        private_code: PropTypes.string,
    }).isRequired,
};
