import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/Utils/TextInput";
import InputLabel from "@/Components/Utils/InputLabel";
import InputError from "@/Components/Utils/InputError";
import OutlineButton from "@/Components/Buttons/OutlineButton";

export default function SecretCode({ auth, listToFollow }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: auth.user.id,
        gift_list_id: listToFollow.id,
        private_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("lists.followList", listToFollow.id), {
            onSuccess: () => reset(),
        });
    };

    const inputId = `private_code-${listToFollow.id}`;

    return (
        <form onSubmit={submit}>
            <InputLabel
                htmlFor={inputId}
                value={`Code communiqué par ${listToFollow.user_name}`}
            />
            <div className="mt-2 flex gap-2">
                <TextInput
                    id={inputId}
                    name="private_code"
                    value={data.private_code}
                    placeholder="Exemple : 12ab"
                    className="!mt-0"
                    isFocused={true}
                    onChange={(e) => setData("private_code", e.target.value)}
                    required
                />
                <OutlineButton
                    type="submit"
                    size="medium"
                    disabled={processing}
                >
                    Valider
                </OutlineButton>
            </div>
            <InputError message={errors.private_code} className="mt-2" />
        </form>
    );
}

SecretCode.propTypes = {
    auth: PropTypes.object.isRequired,
    listToFollow: PropTypes.object.isRequired,
};
