import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";

export default function SiteBrand({ href = "/" }) {
    return (
        <Link href={href}>
            <h1 className="text-xl text-center font-yeseva bg-gradient-to-r from-orange-500 to-bordeaux-500 inline-block text-transparent bg-clip-text">
                MerryMate
            </h1>
        </Link>
    );
}

SiteBrand.propTypes = {
    href: PropTypes.string,
};
