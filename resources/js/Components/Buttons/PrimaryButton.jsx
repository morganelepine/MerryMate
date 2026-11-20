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
                `inline-flex self-center items-center font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 rounded-full transition ease-in-out duration-150 ${BUTTON_SIZE_CLASSES[size]} ${
                    disabled && "opacity-25"
                } ` + className
            }
        >
            {children}
        </ButtonBase>
    );
}

PrimaryButton.propTypes = {
    size: PropTypes.oneOf(Object.keys(BUTTON_SIZE_CLASSES)),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};
