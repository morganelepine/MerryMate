import { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import BrandNote from "@/Components/Ideas/BrandNote";
import InputLabel from "@/Components/Utils/InputLabel";
import InputError from "@/Components/Utils/InputError";
import { INPUT_CLASSES } from "@/Components/Utils/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import PencilIcon from "@/Components/Utils/PencilIcon";

const MAX_LENGTH = 1000;

// Owner-only: the note is stored per (owner, brand) and shown on all their lists.
export default function BrandNoteEditor({ brand, content }) {
    const [editing, setEditing] = useState(false);
    const toggleRef = useRef(null);
    const shouldRestoreFocus = useRef(false);
    const id = useId();
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        brand,
        content: content ?? "",
    });

    useEffect(() => {
        if (!editing && shouldRestoreFocus.current) {
            shouldRestoreFocus.current = false;
            toggleRef.current?.focus();
        }
    }, [editing]);

    const open = () => {
        setData({ brand, content: content ?? "" });
        clearErrors();
        setEditing(true);
    };

    const close = () => {
        shouldRestoreFocus.current = true;
        setEditing(false);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("brand-notes.upsert"), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    if (!editing) {
        return (
            <div className="flex flex-wrap items-start gap-x-1 gap-y-1 mt-1">
                <BrandNote content={content} className="" />
                {content ? (
                    <button
                        ref={toggleRef}
                        type="button"
                        onClick={open}
                        aria-label={`Modifier le bon plan ${brand}`}
                        title="Modifier le bon plan"
                        className="shrink-0 -mt-1 p-1.5 rounded-full text-gray-500 hover:text-orange-600 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        ref={toggleRef}
                        type="button"
                        onClick={open}
                        aria-label={`Ajouter un bon plan pour ${brand}`}
                        className="text-sm text-gray-500 underline underline-offset-2 hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 rounded"
                    >
                        Ajouter un bon plan
                    </button>
                )}
            </div>
        );
    }

    return (
        <form
            onSubmit={submit}
            onKeyDown={(e) => e.key === "Escape" && close()}
            className="mt-3 max-w-xl"
        >
            <InputLabel htmlFor={id} value={`Bon plan ${brand}`} />
            <textarea
                id={id}
                rows={3}
                maxLength={MAX_LENGTH}
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                placeholder="Code de parrainage, -20 % sur tout le site, 5 € offerts avec la newsletter…"
                aria-describedby={`${id}-hint`}
                className={`${INPUT_CLASSES} text-sm`}
                autoFocus
            />
            <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
                Visible sur toutes tes listes, pour la marque {brand}. Laisse
                vide pour le supprimer.
            </p>
            <InputError
                message={errors.content || errors.brand}
                className="mt-2"
            />
            <div className="flex items-center mt-3 mb-6">
                <PrimaryButton size="small" type="submit" disabled={processing}>
                    Enregistrer
                </PrimaryButton>
                <CancelButton onClick={close} />
            </div>
        </form>
    );
}

BrandNoteEditor.propTypes = {
    brand: PropTypes.string.isRequired,
    content: PropTypes.string,
};
