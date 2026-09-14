import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/Utils/TextInput";
import InputError from "@/Components/Utils/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function PrivateCodeForm({ list, routeName, extraData }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        ...extraData,
        private_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route(routeName, list.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="max-w-md mx-auto px-4 my-8">
            <form onSubmit={submit} className="text-center">
                <p>
                    Veuillez renseigner le code communiqué par {list.user_name}{" "}
                    pour accéder à sa liste "{list.name}"
                </p>

                <div className="my-3">
                    <TextInput
                        id="private_code"
                        name="private_code"
                        value={data.private_code}
                        placeholder="Le code secret"
                        className="mb-2"
                        isFocused={true}
                        onChange={(e) =>
                            setData("private_code", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.private_code}
                        className="mt-2"
                    />
                </div>

                <PrimaryButton disabled={processing}>
                    Accéder à la liste
                </PrimaryButton>
            </form>
        </div>
    );
}

PrivateCodeForm.propTypes = {
    list: PropTypes.object.isRequired,
    routeName: PropTypes.string.isRequired,
    extraData: PropTypes.object,
};

PrivateCodeForm.defaultProps = {
    extraData: {},
};
