import PropTypes from "prop-types";
import ButtonCancel from "@/Components/Ideas/UserList/Buttons/ButtonCancel";
import IdeaWithStatus from "@/Components/Ideas/UserList/IdeaWithStatus";

export default function Ideas_purchased({ idea }) {
    return (
        <IdeaWithStatus
            idea={idea}
            status="purchased"
            actions={<ButtonCancel idea={idea} type="purchase" />}
        />
    );
}

Ideas_purchased.propTypes = {
    idea: PropTypes.object.isRequired,
};
