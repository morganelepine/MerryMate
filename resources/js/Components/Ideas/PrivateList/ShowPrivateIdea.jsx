import PropTypes from "prop-types";
import EditPrivateIdea from "@/Components/Ideas/PrivateList/EditPrivateIdea";
import EditableIdea from "@/Components/Ideas/EditableIdea";

export default function ShowPrivateIdea({ auth, idea }) {
    return (
        <EditableIdea
            idea={idea}
            className="p-3 bg-white border border-transparent shadow rounded-lg w-full"
            renderEdit={(close) => (
                <EditPrivateIdea auth={auth} idea={idea} onClose={close} />
            )}
        >
            {idea.idea && (
                <p className="text-sm sm:uppercase font-semibold">
                    {idea.idea}
                </p>
            )}
        </EditableIdea>
    );
}

ShowPrivateIdea.propTypes = {
    auth: PropTypes.object.isRequired,
    idea: PropTypes.object.isRequired,
};
