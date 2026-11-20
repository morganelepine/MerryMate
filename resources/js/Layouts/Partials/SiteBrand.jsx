import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";

// `as="h1"` on pages where the logo is the main title (home).
export default function SiteBrand({
    href = "/",
    as: Tag = "span",
    className = "",
}) {
    return (
        <Link href={href}>
            <Tag
                className={`text-2xl font-yeseva text-orange-500 ${className}`}
            >
                MerryMate
            </Tag>
        </Link>
    );
}

SiteBrand.propTypes = {
    href: PropTypes.string,
    as: PropTypes.oneOf(["span", "h1"]),
    className: PropTypes.string,
};
