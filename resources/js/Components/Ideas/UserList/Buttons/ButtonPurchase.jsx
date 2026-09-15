import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Modal from "@/Components/Utils/Modal";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Utils/InputError";

export default function ButtonPurchase({ idea, userName }) {
    const [purchaseConfirm, setPurchaseConfirm] = useState(false);

    const { data, setData, patch, processing, reset, errors, transform } =
        useForm({
            choice: "",
            userName: userName,
        });

    useEffect(() => {
        setData("userName", userName);
    }, [userName]);

    const openModal = () => {
        reset();
        setData("choice", "");
        setPurchaseConfirm(true);
    };

    const closeModal = () => {
        reset();
        setPurchaseConfirm(false);
    };

    const submit = (e, ignoreChoice = false) => {
        e.preventDefault();

        const routeName =
            idea.is_multiple === 1
                ? "multiple-ideas.purchase"
                : "ideas.purchase";

        // `transform()` is the mechanism designed to adjust the data right before submission
        transform((formData) => ({
            ...formData,
            userName,
            choice: ignoreChoice ? "" : formData.choice,
        }));

        patch(route(routeName, idea.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast.success("Cadeau acheté !");
            },
            onError: () => toast.error("Oops, une erreur est survenue."),
        });
    };

    const handleClickMainButton = (e) => {
        if (idea.is_multiple === 1) {
            e.preventDefault();
            openModal();
        } else {
            submit(e);
        }
    };

    return (
        <>
            <form onSubmit={handleClickMainButton}>
                <button
                    className="flex items-center justify-end text-xs text-gray-400 hover:text-gray-800"
                    disabled={processing}
                    title="Acheter"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                    >
                        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p className="block sm:hidden ml-1 mr-5">Acheter</p>
                </button>
            </form>

            <Modal show={purchaseConfirm} onClose={closeModal}>
                <div className="p-6 flex flex-col items-center">
                    <h2 className="text-lg text-center font-medium">
                        Quel modèle souhaitez-vous offrir&nbsp;?
                    </h2>
                    <p className="mt-1 text-sm text-center text-gray-600">
                        Cela permettra aux autres personnes de ne pas acheter le
                        même modèle.
                    </p>

                    <form
                        onSubmit={submit}
                        className="flex flex-col space-y-2 mt-4 w-full sm:w-3/4"
                    >
                        <input
                            type="text"
                            name="choice"
                            placeholder="Le ou les modèle(s) choisi(s)"
                            value={data.choice}
                            onChange={(e) => setData("choice", e.target.value)}
                            className="py-1 px-2 border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md shadow-sm mb-2"
                            required={idea.is_multiple}
                        />

                        {errors.choice && (
                            <InputError message={errors.choice} />
                        )}

                        <div className="flex flex-col justify-center space-y-2 mt-4">
                            <PrimaryButton
                                size="small"
                                type="submit"
                                disabled={processing}
                            >
                                Confirmer l'achat
                            </PrimaryButton>

                            <button
                                type="button"
                                onClick={(e) => submit(e, true)}
                                className="mt-2 underline underline-offset-4 text-gray-600 hover:text-orange-500 text-sm"
                            >
                                Confirmer sans modèle
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

ButtonPurchase.propTypes = {
    idea: PropTypes.object.isRequired,
    userName: PropTypes.string,
};
