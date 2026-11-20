import PropTypes from "prop-types";
import ButtonCancel from "@/Components/Ideas/UserList/Buttons/ButtonCancel";
import ButtonPurchase from "@/Components/Ideas/UserList/Buttons/ButtonPurchase";
import IdeaWithStatus from "@/Components/Ideas/UserList/IdeaWithStatus";

export default function Ideas_reserved({ idea, userName }) {
    return (
        <IdeaWithStatus
            idea={idea}
            status="reserved"
            actions={
                <>
                    <ButtonPurchase idea={idea} userName={userName} />
                    <ButtonCancel idea={idea} type="reservation" />
                </>
            }
        />
    );
}

Ideas_reserved.propTypes = {
    idea: PropTypes.object.isRequired,
    userName: PropTypes.string,
};
