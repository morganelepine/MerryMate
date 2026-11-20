import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/Utils/TextInput";
import InputLabel from "@/Components/Utils/InputLabel";
import { PANEL } from "@/Components/Utils/surfaces";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";
import InputError from "@/Components/Utils/InputError";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

const NO_EXTRA_DATA = {};

export default function PrivateCodeForm({
    list,
    routeName,
    extraData = NO_EXTRA_DATA,
}) {
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
        <div className={PAGE_BODY}>
            <form onSubmit={submit} className={`${PANEL} max-w-md`}>
                <p className="text-gray-700">
                    Cette liste est protégée. Saisissez le code secret que{" "}
                    {list.user_name} vous a communiqué pour y accéder.
                </p>

                <div className="mt-5">
                    <InputLabel htmlFor="private_code" value="Code secret" />
                    <TextInput
                        id="private_code"
                        name="private_code"
                        value={data.private_code}
                        placeholder="Exemple : 12ab"
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

                <PrimaryButton className="mt-5" disabled={processing}>
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
