import { useState } from "react";
import PropTypes from "prop-types";
import EditListTitle from "@/Components/GiftList/Action/EditTitle";
import { LIST_TITLE } from "@/Components/GiftList/listTitle";

export default function ListTitle({ list }) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return <EditListTitle list={list} setEditing={setEditing} />;
    }

    return (
        <div className="flex items-center gap-2 min-w-0">
            <h1 className={LIST_TITLE}>{list.name}</h1>
            <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label="Modifier le titre de la liste"
                className="shrink-0 p-1.5 rounded-full text-gray-500 hover:text-orange-500 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </button>
        </div>
    );
}

ListTitle.propTypes = {
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};
