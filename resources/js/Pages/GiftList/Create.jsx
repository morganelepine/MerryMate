import PropTypes from "prop-types";
import { useForm, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { PANEL } from "@/Components/Utils/surfaces";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

// Private lists still need a code server-side; it's never shown to anyone.
const PRIVATE_LIST_CODE = "_private";

const VISIBILITIES = [
    {
        value: "shared",
        title: "Partagée",
        description:
            "Elle apparaît dans « Chercher ». Tes proches peuvent te demander l’accès ou saisir ton code secret.",
    },
    {
        value: "private",
        title: "Privée",
        description:
            "Visible uniquement par toi, pour noter tes idées en toute discrétion.",
    },
];

export default function Create({ auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        user_name: auth.user.name,
        name: "",
        visibility: null,
        private_code: PRIVATE_LIST_CODE,
        isPrivate: true,
    });

    const chooseVisibility = (visibility) => {
        const isPrivate = visibility === "private";
        setData((current) => ({
            ...current,
            visibility,
            isPrivate,
            private_code: isPrivate ? PRIVATE_LIST_CODE : "",
        }));
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
        <AuthenticatedLayout user={auth.user} title="Créer une liste">
            <Head title="Créer une liste" />

            <div className={PAGE_BODY}>
                <form
                    onSubmit={submit}
                    className={`${PANEL} max-w-2xl space-y-8`}
                >
                    <div>
                        <InputLabel htmlFor="name" value="Nom de la liste" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="Noël, Anniversaire, Mariage…"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <fieldset>
                        <legend className="text-sm font-medium text-gray-800">
                            Qui peut voir cette liste ?
                        </legend>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                            {VISIBILITIES.map(
                                ({ value, title, description }) => {
                                    const checked = data.visibility === value;
                                    return (
                                        <label
                                            key={value}
                                            className={`flex gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                                                checked
                                                    ? "border-orange-300 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value={value}
                                                checked={checked}
                                                onChange={() =>
                                                    chooseVisibility(value)
                                                }
                                                required
                                                className="mt-0.5 text-orange-600 focus:ring-orange-300"
                                            />
                                            <span>
                                                <span className="block font-medium text-gray-900">
                                                    {title}
                                                </span>
                                                <span className="mt-1 block text-sm text-gray-600">
                                                    {description}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                },
                            )}
                        </div>
                        <InputError
                            message={errors.isPrivate}
                            className="mt-2"
                        />
                    </fieldset>

                    {data.visibility === "shared" && (
                        <div>
                            <InputLabel
                                htmlFor="private_code"
                                value="Code secret"
                            />
                            <TextInput
                                id="private_code"
                                name="private_code"
                                value={data.private_code}
                                placeholder="Exemple : 12ab"
                                aria-describedby="private_code_help"
                                onChange={(e) =>
                                    setData("private_code", e.target.value)
                                }
                            />
                            <p
                                id="private_code_help"
                                className="mt-2 text-sm text-gray-600"
                            >
                                Communique ce code à tes proches pour qu’ils
                                accèdent directement à ta liste.
                            </p>
                            <InputError
                                message={errors.private_code}
                                className="mt-2"
                            />
                        </div>
                    )}

                    <PrimaryButton disabled={processing}>
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
