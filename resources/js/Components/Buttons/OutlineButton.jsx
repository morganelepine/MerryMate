import PropTypes from "prop-types";
import ButtonBase from "@/Components/Buttons/ButtonBase";
import { BUTTON_SIZE_CLASSES } from "@/Components/Buttons/buttonSizes";

const COLOR_CLASSES = {
    gray: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
    orange: "border border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-300",
};

export default function OutlineButton({
    type = "button",
    size = "large",
    color = "gray",
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <ButtonBase
            {...props}
            type={type}
            disabled={disabled}
            className={
                `inline-flex self-center items-center rounded-full focus:outline-none focus:ring-1 disabled:opacity-25 transition ease-in-out duration-150 ${COLOR_CLASSES[color]} ${BUTTON_SIZE_CLASSES[size]} ${
                    disabled && "opacity-25"
                } ` + className
            }
        >
            {children}
        </ButtonBase>
    );
}

OutlineButton.propTypes = {
    type: PropTypes.string,
    size: PropTypes.oneOf(["small", "large"]),
    color: PropTypes.oneOf(["gray", "orange"]),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};
