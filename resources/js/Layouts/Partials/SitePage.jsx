import PropTypes from "prop-types";

export default function SitePage({ nav, header, children }) {
    return (
        <div className="min-h-screen bg-lavande-20">
            {nav}

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
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
    children: PropTypes.node,
};
