import PropTypes from "prop-types";
import { PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

export default function SitePage({
    nav,
    header,
    headerWidth = "max-w-7xl",
    headerClassName = "",
    mainClassName = "",
    children,
}) {
    return (
        <div className="min-h-screen flex flex-col bg-cream">
            {nav}

            {header && (
                <header className={headerClassName}>
                    <div
                        className={`${headerWidth} ${PAGE_GUTTER} pt-6 sm:pt-8 pb-2`}
                    >
                        {header}
                    </div>
                </header>
            )}

            {/* Grows to the bottom of the screen so full-bleed sections can fill it. */}
            <main className={`flex-1 ${mainClassName}`}>{children}</main>
        </div>
    );
}

SitePage.propTypes = {
    nav: PropTypes.node.isRequired,
    header: PropTypes.node,
    headerWidth: PropTypes.string,
    headerClassName: PropTypes.string,
    mainClassName: PropTypes.string,
    children: PropTypes.node,
};
