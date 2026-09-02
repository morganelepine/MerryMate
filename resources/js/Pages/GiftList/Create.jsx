import React, { useState } from "react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import Checkbox from "@/Components/Utils/Checkbox";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { useForm, Head } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        user_name: auth.user.name,
        name: "",
        private_code: "_private",
        isPrivate: true,
    });

    const [isHidden, setIsHidden] = useState(true);
    const [isPrivateList, setIsPrivateList] = useState(null);
    const [isPublicList, setIsPublicList] = useState(null);

    const handlePrivateCheck = () => {
        setIsPrivateList(true);
        setIsPublicList(false);
        setIsHidden(true);
    };

    const handlePublicCheck = () => {
        data.private_code = "";
        setIsPrivateList(false);
        setIsPublicList(true);
        setIsHidden(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("lists.store"), {
            onSuccess: () => reset(),
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Créer une nouvelle liste
                </h2>
            }
        >
            <Head title="Créer une nouvelle liste" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <div className="my-2">
                        <InputLabel htmlFor="link" value="Nom de la liste" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="Noël, Anniversaire, Mariage..."
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="link" value="Statut de la liste" />

                        <div className="mt-5">
                            <div className="flex items-center">
                                <Checkbox
                                    id="isPrivate"
                                    name="isPrivate"
                                    type="checkbox"
                                    checked={isPrivateList}
                                    onChange={() => {
                                        handlePrivateCheck();
                                        setData("isPrivate", true);
                                    }}
                                />
                                <p>Je souhaite garder cette liste privée</p>
                            </div>
                            <p className="italic text-xs text-gray-600 mt-2">
                                En cochant cette case, votre liste ne sera
                                visible que par vous. Vos proches ne pourront
                                donc pas y accéder.
                            </p>
                        </div>

                        <div className="mt-5">
                            <div className="flex items-center">
                                <Checkbox
                                    id="isPublic"
                                    name="isPublic"
                                    type="checkbox"
                                    checked={isPublicList}
                                    onChange={() => {
                                        handlePublicCheck();
                                        setData("isPrivate", false);
                                    }}
                                />
                                <p>Je souhaite partager cette liste</p>
                            </div>
                            <p className="italic text-xs text-gray-600 mt-2">
                                En cochant cette case, votre liste apparaîtra
                                dans l'onglet "Chercher". Pour la suivre, vos
                                proches pourront soit vous envoyer une demande,
                                soit renseigner votre code privé.
                            </p>
                        </div>

                        <InputError
                            message={errors.isPrivate}
                            className="mt-2"
                        />
                    </div>

                    <div
                        className={
                            "mt-6 bg-orange-50 shadow-md p-5 rounded-xl " +
                            (isHidden ? "hidden" : "block")
                        }
                    >
                        <InputLabel htmlFor="link" value="Code privé" />
                        <TextInput
                            id="private_code"
                            name="private_code"
                            value={data.private_code}
                            placeholder="Exemple : 12ab"
                            onChange={(e) =>
                                setData("private_code", e.target.value)
                            }
                            // required={isPrivateList} // only if list is not private
                        />
                        <p className="italic text-xs text-gray-600 mt-2">
                            Communiquez ce code à vos proches pour leur
                            permettre d'accéder à votre liste. Ils pourront
                            également vous envoyer directement une demande.
                        </p>

                        <InputError
                            message={errors.private_code}
                            className="mt-2"
                        />
                    </div>

                    <PrimaryButton className="mt-6" disabled={processing}>
                        Créer la liste
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

Create.propTypes = {
    auth: PropTypes.object.isRequired,
};
