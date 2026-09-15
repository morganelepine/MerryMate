import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import IdeaFormFields from "@/Components/Ideas/Form/IdeaFormFields";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function IdeaEdit({ auth, idea, setEditing }) {
    const { data, setData, errors, submit, reset, clearErrors } = useIdeaForm({
        auth,
        idea,
        onSuccess: () => setEditing(false),
    });

    return (
        <form onSubmit={submit}>
            <IdeaFormFields
                variant="edit"
                data={data}
                setData={setData}
                errors={errors}
            />

            <div className="space-x-4 mt-4">
                <PrimaryButton size="small">Enregistrer</PrimaryButton>
                <CancelButton
                    onClick={() => {
                        setEditing(false);
                        reset();
                        clearErrors();
                    }}
                />
            </div>
        </form>
    );
}

IdeaEdit.propTypes = {
    auth: PropTypes.object.isRequired,
    idea: PropTypes.object,
    setEditing: PropTypes.func,
};
