import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import SecretCodeField from "@/Components/GiftList/SecretCodeField";

export default function SecretCodeForm({ list, onClose }) {
    const { data, setData, patch, processing, errors } = useForm({
        private_code: list.private_code ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("lists.update", list.id), {
            // A partial reload drops the validation errors unless asked for.
            only: ["list", "errors"],
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Code secret modifié !");
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit}>
            <SecretCodeField
                value={data.private_code}
                onChange={(value) => setData("private_code", value)}
                error={errors.private_code}
                isFocused
            />
            <p className="mt-2 text-sm text-gray-600">
                Les abonné·e·s gardent leur accès. Les personnes sans compte
                devront saisir le nouveau code.
            </p>
            <div className="mt-4 flex justify-end">
                <CancelButton onClick={onClose} disabled={processing} />
                <PrimaryButton size="small" disabled={processing}>
                    Enregistrer
                </PrimaryButton>
            </div>
        </form>
    );
}

SecretCodeForm.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
        private_code: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};
