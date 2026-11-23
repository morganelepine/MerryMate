import { useState } from "react";
import { useForm } from "@inertiajs/react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import SecretCodeField from "@/Components/GiftList/SecretCodeField";
import { LIST_ACTION_LINK } from "@/Components/GiftList/listAction";

export default function MakeListPublicButton({ list }) {
    const [confirming, setConfirming] = useState(false);

    const { data, setData, patch, processing, reset, clearErrors, errors } =
        useForm({
            isPrivate: false,
            private_code: "",
        });

    const closeModal = () => {
        setConfirming(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route("lists.update", list.id), {
            onSuccess: () => {
                closeModal();
                toast.success("Ta liste est maintenant partagée !");
            },
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className={LIST_ACTION_LINK}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 mr-1.5"
                    aria-hidden="true"
                >
                    <path d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Partager la liste
            </button>

            <Modal show={confirming} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <Modal.Title as="h2" className="text-lg font-medium">
                        Partager cette liste avec tes proches ?
                    </Modal.Title>

                    <p className="mt-1 text-sm text-gray-600">
                        Elle apparaîtra dans « Chercher » et tes proches
                        pourront y accéder avec ton code secret. Ils verront
                        toutes les idées déjà notées.
                    </p>

                    <div className="mt-6">
                        <SecretCodeField
                            value={data.private_code}
                            onChange={(value) => setData("private_code", value)}
                            error={errors.private_code}
                            isFocused
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <CancelButton onClick={closeModal} />
                        <PrimaryButton size="small" disabled={processing}>
                            Partager la liste
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

MakeListPublicButton.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
};
