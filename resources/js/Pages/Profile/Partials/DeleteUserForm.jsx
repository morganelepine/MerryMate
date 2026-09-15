import { useRef, useState } from "react";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import Modal from "@/Components/Utils/Modal";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import TextInput from "@/Components/Utils/TextInput";
import { useForm } from "@inertiajs/react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium ">Supprimer mon compte</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Une fois votre compte supprimé, toutes vos listes et données
                    seront définitivement supprimées.
                </p>
            </header>

            <OutlineButton color="orange" onClick={confirmUserDeletion}>
                Supprimer mon compte
            </OutlineButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium ">
                        Êtes-vous sûr·e de vouloir supprimer votre compte ?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Une fois votre compte supprimé, toutes vos listes et
                        données seront définitivement supprimées.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Mot de passe"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <OutlineButton onClick={closeModal}>
                            Annuler
                        </OutlineButton>
                        <OutlineButton
                            color="orange"
                            className="ml-3"
                            disabled={processing}
                        >
                            Supprimer mon compte
                        </OutlineButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
