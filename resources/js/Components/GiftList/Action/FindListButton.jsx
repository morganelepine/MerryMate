import OutlineButton from "@/Components/Buttons/OutlineButton";
import { NAV_ICONS } from "@/Components/Utils/navIcons";

export default function FindListButton() {
    return (
        <OutlineButton size="medium" href={route("lists.listsToFollow")}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-4 h-4 mr-1.5 -ml-0.5"
                aria-hidden="true"
            >
                <path d={NAV_ICONS.search} />
            </svg>
            Chercher
        </OutlineButton>
    );
}
