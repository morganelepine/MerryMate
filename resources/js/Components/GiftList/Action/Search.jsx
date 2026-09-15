import { useState } from "react";
import PropTypes from "prop-types";
import ListToFollow from "@/Components/GiftList/User/ListToFollow/ListToFollowCard";
import TextInput from "@/Components/Utils/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { searchLists } from "@/api/lists";

export default function SearchList({ auth }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset search results or error message
        setResults([]);
        setError("");

        if (search.trim() === "") {
            setError("Veuillez renseigner un nom pour lancer la recherche.");
            return;
        }

        try {
            const listsToFollow = await searchLists(search);
            setResults(listsToFollow);
        } catch (error) {
            console.error("Error fetching search results: ", error);
            setError(
                error.response?.data?.errorMessage ??
                    "Oops, une erreur est survenue. Veuillez réessayer.",
            );
        }
    };

    return (
        <>
            <form
                className="flex flex-col text-center gap-4"
                onSubmit={handleSubmit}
            >
                <label htmlFor="search" className="text-xl font-semibold">
                    Rechercher une liste
                </label>
                <TextInput
                    id="search"
                    name="search"
                    placeholder="Prénom ou nom de la liste"
                    className="py-1 text-center"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <PrimaryButton type="submit">Rechercher</PrimaryButton>
            </form>

            {results.length > 0 && (
                <div className="flex flex-col justify-center">
                    {results.map((list) => (
                        <div
                            className="flex flex-col p-5 my-5 text-center shadow bg-white rounded-xl"
                            key={list.id}
                        >
                            <ListToFollow listToFollow={list} auth={auth} />
                        </div>
                    ))}
                </div>
            )}

            {error && <div className="text-center mt-4">{error}</div>}
        </>
    );
}

SearchList.propTypes = {
    auth: PropTypes.object.isRequired,
};
