import PropTypes from "prop-types";

export default function ColumnHeader({ title, count, action }) {
    return (
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <h2 className="flex items-center gap-2.5 font-yeseva text-xl text-gray-900">
                {title}
                {/* <span className="rounded-full bg-orange-100 px-2 py-0.5 font-sans text-xs font-medium text-orange-700">
                    {count}
                </span> */}
            </h2>
            {action}
        </div>
    );
}

ColumnHeader.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    action: PropTypes.node,
};
