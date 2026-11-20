import PropTypes from "prop-types";

export default function SectionHeader({ title, count, action }) {
    return (
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <h2 className="flex items-center gap-2.5 font-yeseva text-xl text-gray-900 min-w-0">
                <span className="break-words min-w-0">{title}</span>
                {count !== undefined && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 font-sans text-xs font-medium text-gray-600">
                        {count}
                    </span>
                )}
            </h2>
            {action}
        </div>
    );
}

SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number,
    action: PropTypes.node,
};
