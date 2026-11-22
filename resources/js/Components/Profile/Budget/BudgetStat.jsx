import PropTypes from "prop-types";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import { CARD_SURFACE } from "@/Components/Utils/surfaces";

export default function BudgetStat({ icon, label, value, hint, iconClassName }) {
    return (
        <div className={`${CARD_SURFACE} flex items-center gap-4 p-4 sm:p-5`}>
            <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
            >
                <OutlineIcon path={icon} />
            </span>
            <div className="min-w-0">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-yeseva text-2xl text-gray-900">{value}</p>
                {hint && <p className="text-xs text-gray-500">{hint}</p>}
            </div>
        </div>
    );
}

BudgetStat.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    hint: PropTypes.string,
    iconClassName: PropTypes.string.isRequired,
};
