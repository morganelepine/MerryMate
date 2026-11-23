import PropTypes from "prop-types";
import InitialsAvatar from "@/Components/Utils/InitialsAvatar";

export default function OwnerAvatar({ list }) {
    return (
        <InitialsAvatar name={list.user_name} lastName={list.user_lastname} />
    );
}

OwnerAvatar.propTypes = {
    list: PropTypes.shape({
        user_name: PropTypes.string,
        user_lastname: PropTypes.string,
    }).isRequired,
};
