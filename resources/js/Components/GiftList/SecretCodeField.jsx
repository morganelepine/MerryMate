import PropTypes from "prop-types";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";

export default function SecretCodeField({
    value,
    onChange,
    error,
    isFocused = false,
}) {
    return (
        <div>
            <InputLabel htmlFor="private_code" value="Code secret" />
            <TextInput
                id="private_code"
                name="private_code"
                value={value}
                placeholder="Exemple : 12ab"
                aria-describedby="private_code_help"
                isFocused={isFocused}
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <p id="private_code_help" className="mt-2 text-sm text-gray-600">
                Communique ce code à tes proches pour qu’ils accèdent
                directement à ta liste.
            </p>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

SecretCodeField.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    isFocused: PropTypes.bool,
};
