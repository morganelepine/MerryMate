import PropTypes from "prop-types";

export default function TopNav({ children, below }) {
    return (
        <nav className="sticky z-30 top-0 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">{children}</div>
            </div>

            {below}
        </nav>
    );
}

TopNav.propTypes = {
    children: PropTypes.node,
    below: PropTypes.node,
};
