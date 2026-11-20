import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function CreateListButton() {
    return (
        <PrimaryButton size="medium" href={route("lists.create")}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4 mr-1.5 -ml-0.5"
                aria-hidden="true"
            >
                <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Créer
        </PrimaryButton>
    );
}
