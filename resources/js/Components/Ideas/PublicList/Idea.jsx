import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import IdeaEdit from "@/Components/Ideas/PublicList/IdeaEdit";
import EditDeleteButtons from "@/Components/Ideas/UserList/Buttons/EditDeleteButtons";

export default function Ideas({ idea }) {
    const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);

    return (
        <div className="sm:space-y-3 sm:flex items-center sm:mb-0 mb-3">
            {/* EDIT & DELETE BUTTONS */}
            <div className="flex items-center w-16">
                <EditDeleteButtons idea={idea} setEditing={setEditing} />
            </div>

            {/* IDEA */}
            <div className="p-3 flex flex-1 flex-col min-w-0 bg-white shadow rounded-lg">
                {editing ? (
                    <IdeaEdit auth={auth} idea={idea} setEditing={setEditing} />
                ) : (
                    <IdeaShow idea={idea} />
                )}
            </div>
        </div>
    );
}
