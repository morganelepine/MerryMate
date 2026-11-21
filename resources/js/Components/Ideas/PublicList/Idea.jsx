import PropTypes from "prop-types";
import { usePage } from "@inertiajs/react";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import IdeaEdit from "@/Components/Ideas/PublicList/IdeaEdit";
import EditableIdea from "@/Components/Ideas/EditableIdea";
import { IDEA_CARD } from "@/Components/Ideas/ideaCard";

export default function Idea({ idea }) {
    const { auth } = usePage().props;

    return (
        <EditableIdea
            idea={idea}
            className={IDEA_CARD}
            renderEdit={(close) => (
                <IdeaEdit auth={auth} idea={idea} onClose={close} />
            )}
        >
            <IdeaShow idea={idea} />
        </EditableIdea>
    );
}

Idea.propTypes = {
    idea: PropTypes.object.isRequired,
};
