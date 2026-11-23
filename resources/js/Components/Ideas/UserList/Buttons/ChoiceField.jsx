import { useId } from "react";
import PropTypes from "prop-types";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";

export default function ChoiceField({ value, onChange, error, required }) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div>
            <InputLabel htmlFor={id} value="Le ou les modèle(s) choisi(s)" />
            <input
                id={id}
                type="text"
                name="choice"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="mt-2 w-full py-1 px-2 border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md shadow-sm"
                required={required}
            />
            <InputError id={errorId} message={error} className="mt-2" />
        </div>
    );
}

ChoiceField.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool.isRequired,
};
