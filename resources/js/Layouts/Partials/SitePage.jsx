import PropTypes from "prop-types";
import { PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

export default function SitePage({
    nav,
    header,
    headerWidth = "max-w-7xl",
    children,
}) {
    return (
        <div className="min-h-screen bg-cream">
            {nav}

            {header && (
                <header>
                    <div className={`${headerWidth} ${PAGE_GUTTER} pt-8 pb-2`}>
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

SitePage.propTypes = {
    nav: PropTypes.node.isRequired,
    header: PropTypes.node,
    headerWidth: PropTypes.string,
    children: PropTypes.node,
};
