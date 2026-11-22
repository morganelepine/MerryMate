import PropTypes from "prop-types";
import {
    ALL_OCCASIONS,
    OCCASIONS,
} from "@/Components/Profile/Budget/budgetHelpers";

const OPTIONS = [
    ...Object.entries(OCCASIONS).map(([value, { filter }]) => ({
        value,
        label: filter,
    })),
    { value: ALL_OCCASIONS, label: "Tout" },
];

// Toggle buttons rather than tabs: they filter the content below, they don't swap panels.
export default function OccasionFilter({ value, onChange }) {
    return (
        <fieldset
            // 2×2 grid on phones, where the four pills don't fit on one line.
            className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-1 sm:inline-flex sm:w-auto sm:rounded-full"
        >
            <legend className="sr-only">Occasion</legend>
            {OPTIONS.map((option) => {
                const selected = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onChange(option.value)}
                        className={`rounded-xl px-3 py-2 text-sm transition sm:rounded-full sm:py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                            selected
                                ? "bg-orange-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </fieldset>
    );
}

OccasionFilter.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
