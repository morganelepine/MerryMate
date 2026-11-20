import PropTypes from "prop-types";
import PageHeader from "@/Layouts/Partials/PageHeader";
import {
    LIST_HEADER_CLOSED,
    LIST_WIDTH,
    PAGE_GUTTER,
} from "@/Layouts/Partials/pageContainer";

// Pages either pass a `title` (standard white header band) or a custom `header`.
export default function SitePage({
    nav,
    title,
    subtitle,
    actions,
    header,
    headerWidth,
    headerClassName,
    mainClassName = "",
    children,
}) {
    const content = title ? (
        <PageHeader title={title} subtitle={subtitle} actions={actions} />
    ) : (
        header
    );
    const width = headerWidth ?? (title ? LIST_WIDTH : "max-w-7xl");
    const bandClassName = headerClassName ?? (title ? LIST_HEADER_CLOSED : "");

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            {nav}

            {content && (
                <header className={bandClassName}>
                    <div
                        className={`${width} ${PAGE_GUTTER} pt-6 sm:pt-8 pb-2`}
                    >
                        {content}
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
    title: PropTypes.node,
    subtitle: PropTypes.node,
    actions: PropTypes.node,
    header: PropTypes.node,
    headerWidth: PropTypes.string,
    headerClassName: PropTypes.string,
    mainClassName: PropTypes.string,
    children: PropTypes.node,
};
