import PropTypes from "prop-types";
import ButtonBase from "@/Components/Buttons/ButtonBase";

export default function CancelButton({
    type = "button",
    className = "",
    children = "Annuler",
    ...props
}) {
    return (
        <ButtonBase
            {...props}
            type={type}
            className={"text-sm mx-4 hover:text-orange-500 " + className}
        >
            {children}
        </ButtonBase>
    );
}

CancelButton.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};
