import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";

export default function ButtonBase({
    href,
    type,
    className,
    disabled,
    children,
    ...props
}) {
    if (href) {
        // `type` (button/submit/reset) doesn't apply to a link.
        return (
            <Link href={href} className={className} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            {...props}
            type={type}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

ButtonBase.propTypes = {
    href: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};
