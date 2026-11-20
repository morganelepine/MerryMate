import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";

// `as="h1"` on pages where the logo is the main title (home).
export default function SiteBrand({
    href = "/",
    as: Tag = "span",
    className = "h-8 sm:h-9",
}) {
    return (
        <Link
            href={href}
            className="inline-flex rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
        >
            <Tag className="flex">
                {/* Intrinsic size reserves the space before the image loads (no layout shift). */}
                <img
                    src="/images/logo-MerryMate.svg"
                    alt="MerryMate"
                    width="410"
                    height="96"
                    className={`w-auto ${className}`}
                />
            </Tag>
        </Link>
    );
}

SiteBrand.propTypes = {
    href: PropTypes.string,
    as: PropTypes.oneOf(["span", "h1"]),
    // Height classes for the logo image.
    className: PropTypes.string,
};
