import { useState } from "react";
import PropTypes from "prop-types";
import ListToFollowCard from "@/Components/GiftList/User/ListToFollow/ListToFollowCard";
import TextInput from "@/Components/Utils/TextInput";
import InputLabel from "@/Components/Utils/InputLabel";
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
            <form className="max-w-xl" onSubmit={handleSubmit}>
                <InputLabel
                    htmlFor="search"
                    value="Prénom ou nom de la liste"
                />
                <div className="mt-2 flex gap-2">
                    <TextInput
                        id="search"
                        name="search"
                        type="search"
                        placeholder="Marie, Anniversaire…"
                        className="!mt-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <PrimaryButton type="submit" size="medium">
                        Rechercher
                    </PrimaryButton>
                </div>
            </form>

            <div role="status" aria-live="polite">
                {error && (
                    <p className="mt-4 text-sm text-orange-700">{error}</p>
                )}
            </div>

            {results.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {results.map((list) => (
                        <ListToFollowCard
                            key={list.id}
                            listToFollow={list}
                            auth={auth}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

SearchList.propTypes = {
    auth: PropTypes.object.isRequired,
};
