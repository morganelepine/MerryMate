import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import IdeaEdit from "@/Components/Ideas/PublicList/IdeaEdit";
import { IDEA_CARD } from "@/Components/Ideas/ideaCard";
import EditDeleteButtons from "@/Components/Ideas/UserList/Buttons/EditDeleteButtons";

export default function Ideas({ idea }) {
    const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);

    return (
        <div className="sm:flex items-center">
            {/* EDIT & DELETE BUTTONS */}
            <div className="flex items-center w-16">
                <EditDeleteButtons idea={idea} setEditing={setEditing} />
            </div>

            {/* IDEA */}
            <div className={IDEA_CARD}>
                {editing ? (
                    <IdeaEdit auth={auth} idea={idea} setEditing={setEditing} />
                ) : (
                    <IdeaShow idea={idea} />
                )}
            </div>
        </div>
    );
}
