import PropTypes from "prop-types";
import TextInputSmall from "@/Components/Utils/TextInputSmall";
import InputError from "@/Components/Utils/InputError";
import DeleteIdeaButton from "@/Components/Ideas/DeleteIdeaButton";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function IdeaPrivateEdit({ auth, idea, onClose }) {
    const { data, setData, errors, submit, reset, clearErrors } = useIdeaForm(
        {
            auth,
            idea,
            onSuccess: onClose,
        }
    );

    return (
        <form onSubmit={submit}>
            <div className="flex items-center">
                <div className="w-full">
                    <TextInputSmall
                        id="idea"
                        name="idea"
                        value={data.idea}
                        placeholder="Ton idée"
                        className="w-full border-gray-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData("idea", e.target.value)}
                    />
                    <InputError message={errors.idea} className="mt-2" />
                </div>
                <button
                    type="submit"
                    className="hover:text-orange-600 ml-3"
                    aria-label="Enregistrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="text-sm italic hover:text-orange-500 ml-3"
                    aria-label="Annuler"
                    onClick={() => {
                        reset();
                        clearErrors();
                        onClose();
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex justify-end mt-2">
                <DeleteIdeaButton idea={idea} onBlocked={onClose} />
            </div>
        </form>
    );
}

IdeaPrivateEdit.propTypes = {
    auth: PropTypes.object.isRequired,
    idea: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
