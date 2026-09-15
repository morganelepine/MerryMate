import PropTypes from "prop-types";
import InputError from "@/Components/Utils/InputError";
import InputLabel from "@/Components/Utils/InputLabel";
import TextInput from "@/Components/Utils/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function CreatePrivateIdea({ auth, list }) {
    const { data, setData, errors, processing, submit } = useIdeaForm({
        auth,
        list,
    });

    return (
        <div className="w-full p-4 bg-gradient-to-r from-orange-100 to-bordeaux-100 shadow-md rounded-xl">
            <form onSubmit={submit}>
                <div className="flex flex-col text-center w-full">
                    <InputLabel
                        htmlFor="link"
                        value="Ajouter une idée"
                        className="mb-3"
                    />
                    <div className="sm:flex">
                        <TextInput
                            id="idea"
                            name="idea"
                            value={data.idea}
                            placeholder="Puzzle 500 pièces"
                            className="py-1 mt-auto"
                            isFocused={true}
                            onChange={(e) => setData("idea", e.target.value)}
                        />
                        <InputError message={errors.idea} className="mt-2" />
                        <PrimaryButton
                            size="small"
                            className="sm:ml-4 sm:mt-0 mt-3 sm:w-auto w-full"
                            disabled={processing}
                        >
                            Ajouter
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

CreatePrivateIdea.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
};
