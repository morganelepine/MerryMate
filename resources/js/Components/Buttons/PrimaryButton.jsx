import PropTypes from "prop-types";
import ButtonBase from "@/Components/Buttons/ButtonBase";
import { BUTTON_SIZE_CLASSES } from "@/Components/Buttons/buttonSizes";

export default function PrimaryButton({
    size = "large",
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <ButtonBase
            {...props}
            disabled={disabled}
            className={
                `inline-flex self-center items-center text-white bg-gradient-to-r from-bordeaux-500 to-orange-500 hover:from-orange-600 hover:to-pink-600 rounded-full transition ease-in-out duration-150 ${BUTTON_SIZE_CLASSES[size]} ${
                    disabled && "opacity-25"
                } ` + className
            }
        >
            {children}
        </ButtonBase>
    );
}

PrimaryButton.propTypes = {
    size: PropTypes.oneOf(["small", "large"]),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};
