import { useState } from "react";
import PropTypes from "prop-types";
import EditListTitle from "@/Components/GiftList/Action/EditTitle";
import { LIST_TITLE } from "@/Components/GiftList/listTitle";
import PencilIcon from "@/Components/Utils/PencilIcon";

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
                <PencilIcon className="h-6 w-6" />
            </button>
        </div>
    );
}

ListTitle.propTypes = {
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};
