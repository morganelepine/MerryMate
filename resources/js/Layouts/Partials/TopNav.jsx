import PropTypes from "prop-types";
import { HOME_WIDTH, PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

export default function TopNav({ children, below }) {
    return (
        <nav className="sticky z-30 top-0 bg-white border-b border-gray-100">
            <div className={`${HOME_WIDTH} ${PAGE_GUTTER}`}>
                <div className="flex items-center h-16">{children}</div>
            </div>

            {below}
        </nav>
    );
}

TopNav.propTypes = {
    children: PropTypes.node,
    below: PropTypes.node,
};
