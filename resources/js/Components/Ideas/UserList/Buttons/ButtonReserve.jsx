import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Modal from "@/Components/Utils/Modal";
import SmallButton from "@/Components/Buttons/SmallButton";
import InputError from "@/Components/Utils/InputError";

export default function ButtonReserve({ idea, userName }) {
    const [reserveConfirm, setReserveConfirm] = useState(false);

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
        setReserveConfirm(true);
    };

    const closeModal = () => {
        reset();
        setReserveConfirm(false);
    };

    const submit = (e, ignoreChoice = false) => {
        e.preventDefault();

        const routeName =
            idea.is_multiple === 1 ? "multiple-ideas.reserve" : "ideas.reserve";

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
                toast.success("Idée réservée !");
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
                    title="Réserver"
                >
                    <svg
                        xmlns="https://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                    >
                        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    <p className="block sm:hidden ml-1 mr-5">Réserver</p>
                </button>
            </form>

            <Modal show={reserveConfirm} onClose={closeModal}>
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
                            <SmallButton type="submit" disabled={processing}>
                                Confirmer la réservation
                            </SmallButton>

                            <button
                                type="button"
                                onClick={(e) => submit(e, true)}
                                className="self-center px-4 py-2 border border-orange-500 hover:bg-orange-50 rounded-full text-sm"
                            >
                                Confirmer sans préciser le modèle
                            </button>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-sm italic mr-3 hover:text-orange-500"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

ButtonReserve.propTypes = {
    idea: PropTypes.object.isRequired,
    userName: PropTypes.string,
};
