import PropTypes from "prop-types";
import CountBadge from "@/Components/Utils/CountBadge";

export default function SectionHeader({ title, count, action }) {
    return (
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <h2 className="flex items-center gap-2.5 font-yeseva text-xl text-gray-900 min-w-0">
                <span className="break-words min-w-0">{title}</span>
                {count !== undefined && (
                    <CountBadge
                        size="md"
                        count={count}
                        className="border border-orange-300 bg-orange-100 font-sans"
                    />
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
