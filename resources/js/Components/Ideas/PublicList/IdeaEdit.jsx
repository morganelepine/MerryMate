import PropTypes from "prop-types";
import SmallButton from "@/Components/Buttons/SmallButton";
import IdeaFormFields from "@/Components/Ideas/Form/IdeaFormFields";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function IdeaEdit({ auth, idea, setEditing }) {
    const { data, setData, errors, submit, reset, clearErrors } = useIdeaForm(
        {
            auth,
            idea,
            onSuccess: () => setEditing(false),
        }
    );

    return (
        <form onSubmit={submit}>
            <IdeaFormFields
                variant="edit"
                data={data}
                setData={setData}
                errors={errors}
            />

            <div className="space-x-2">
                <SmallButton className="mt-4">Enregistrer</SmallButton>
                <button
                    type="button"
                    className="mt-4 text-sm"
                    onClick={() => {
                        setEditing(false);
                        reset();
                        clearErrors();
                    }}
                >
                    Annuler
                </button>
            </div>
        </form>
    );
}

IdeaEdit.propTypes = {
    auth: PropTypes.object.isRequired,
    idea: PropTypes.object,
    setEditing: PropTypes.func,
};
