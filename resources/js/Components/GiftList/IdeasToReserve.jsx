import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import Linkify from "linkify-react"; //rendre les liens cliquables
import IdeasAvailable from "@/Components/Ideas/UserList/Ideas_available";
import IdeasReserved from "@/Components/Ideas/UserList/Ideas_reserved";
import IdeasPurchased from "@/Components/Ideas/UserList/Ideas_purchased";

// The gift-list content
export default function IdeasToReserve({
    list,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
    userName,
}) {
    // Regrouper les idées par marque
    const groupedIdeas = ideas_available.reduce((ideasByBrand, idea) => {
        const { brand, ...rest } = idea;

        if (!ideasByBrand[brand]) {
            ideasByBrand[brand] = { brand, ideas_available: [rest] };
        } else {
            ideasByBrand[brand].ideas_available.push(rest);
        }

        return ideasByBrand;
    }, {});

    const h1 =
        "uppercase tracking-wider text-center rounded-full text-white w-full p-1 mb-3";

    return (
        <>
            <Head title="Liste " />

            <div className="max-w-3xl mx-auto pb-14 px-4 mt-6">
                {ideas_available.length == 0 &&
                    ideas_reserved.length == 0 &&
                    ideas_purchased.length == 0 && (
                        <p className="text-center">
                            Cette liste est vide pour le moment. Revenez plus
                            tard !
                        </p>
                    )}

                {ideas_available.length === 0 &&
                    (ideas_purchased.length > 0 ||
                        ideas_reserved.length > 0) && (
                        <>
                            <h1 className={`bg-orange-500 ${h1}`}>
                                Idées disponibles
                            </h1>
                            <p className="text-center text-sm italic mb-10">
                                Cette liste est vide pour le moment. Revenez
                                plus tard !
                            </p>
                        </>
                    )}

                {ideas_available.length > 0 && (
                    <>
                        <h1 className={`bg-orange-500 ${h1}`}>
                            Idées disponibles
                        </h1>
                        <div className="hidden sm:flex items-center text-gray-500 italic">
                            <small className="text-xs mr-1">
                                Pour réserver un cadeau, cliquez sur le picto
                            </small>
                            <svg
                                xmlns="https://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 mr-1"
                            >
                                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                        </div>
                        <div className="hidden sm:flex items-center mb-3 text-gray-500 italic">
                            <small className="text-xs mr-1">
                                Pour indiquer que vous avez acheté un cadeau,
                                cliquez sur le picto
                            </small>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center bg-orange-50 rounded-xl mt-0 sm:px-6 sm:py-4 p-3 mb-10">
                            <div className="mt-4 space-y-8">
                                {Object.entries(groupedIdeas).map(
                                    ([brand, brandData]) => (
                                        <div key={brand}>
                                            <div className="inline-flex items-center w-full">
                                                <p className="min-w-max py-1 px-2 text-sm bg-orange-500 text-white rounded-full">
                                                    {brand}
                                                </p>
                                                <hr className="w-full h-px mt-3 mb-2 bg-orange-200 border-0"></hr>
                                            </div>
                                            {(brand === "Nébuleuse" ||
                                                brand === "Asos") && (
                                                <div className="flex flex-wrap p-1 sm:p-0 mt-2 mb-3">
                                                    <p className="text-xs italic ">
                                                        Lien à utiliser pour
                                                        bénéficier d'une
                                                        réduction de
                                                        parrainage&nbsp;:&nbsp;
                                                        <span className="text-xs italic hover:text-orange-500">
                                                            <Linkify
                                                                options={{
                                                                    target: "blank",
                                                                }}
                                                            >
                                                                {brand ===
                                                                "Nébuleuse"
                                                                    ? "https://nebuleusebijoux.com#ref=1835832"
                                                                    : "https://asos.mention-me.com/m/ol/hr5ry-roxane-lepine-utter"}
                                                            </Linkify>
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                            <div className="w-full space-y-5 sm:space-y-0">
                                                {brandData.ideas_available.map(
                                                    (idea) => (
                                                        <IdeasAvailable
                                                            key={idea.id}
                                                            idea={idea}
                                                            brand={brand}
                                                            userName={userName}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </>
                )}

                {ideas_purchased.length > 0 && (
                    <>
                        <h1 className={`bg-indigo-500 ${h1}`}>
                            Cadeaux achetés
                        </h1>
                        <div className="hidden sm:flex items-center mb-3 text-gray-500 italic">
                            <small className="text-xs mr-1">
                                Pour annuler votre achat, cliquez sur le picto
                            </small>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center bg-indigo-50 rounded-xl mt-0 sm:px-6 sm:py-4 p-3 mb-10">
                            <div className="w-full space-y-5 sm:space-y-0">
                                {ideas_purchased.map((idea) => (
                                    <IdeasPurchased
                                        key={idea.id}
                                        list={list}
                                        idea={idea}
                                        userName={userName}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {ideas_reserved.length > 0 && (
                    <>
                        <h1 className={`bg-bordeaux-800 ${h1}`}>
                            Cadeaux réservés
                        </h1>
                        <div className="hidden sm:flex items-center text-gray-500 italic">
                            <small className="text-xs mr-1">
                                Pour confirmer votre achat, cliquez sur le picto
                            </small>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className="hidden sm:flex items-center mb-3 text-gray-500 italic">
                            <small className="text-xs mr-1">
                                Pour annuler votre réservation, cliquez sur le
                                picto
                            </small>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center bg-bordeaux-50 rounded-xl mt-0 sm:px-6 sm:py-4 p-3 mb-10">
                            <div className="w-full space-y-5 sm:space-y-0">
                                {ideas_reserved.map((idea) => (
                                    <IdeasReserved
                                        key={idea.id}
                                        list={list}
                                        idea={idea}
                                        userName={userName}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

IdeasToReserve.propTypes = {
    list: PropTypes.object,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
    userName: PropTypes.string,
};
