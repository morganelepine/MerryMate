import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import IdeasAvailable from "@/Components/Ideas/UserList/Ideas_available";
import IdeasReserved from "@/Components/Ideas/UserList/Ideas_reserved";
import IdeasPurchased from "@/Components/Ideas/UserList/Ideas_purchased";
import BrandMembership from "@/Components/Ideas/BrandMembership";
import BrandHeading from "@/Components/Ideas/BrandHeading";
import { LIST_WIDTH, PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

// Each section spans the full page width, tinted with its status color.
const SECTIONS = {
    available: { dot: "bg-orange-500", band: "" },
    purchased: { dot: "bg-sage-300", band: "bg-sage-50" },
    reserved: { dot: "bg-lilac-300", band: "bg-lilac-50" },
};

const SECTION_BODY = "mt-4";

function Section({ section, children }) {
    return (
        <section className={SECTIONS[section].band}>
            <div className={`${LIST_WIDTH} ${PAGE_GUTTER} py-10`}>
                {children}
            </div>
        </section>
    );
}

Section.propTypes = {
    section: PropTypes.oneOf(Object.keys(SECTIONS)).isRequired,
    children: PropTypes.node.isRequired,
};

function SectionTitle({ section, children }) {
    return (
        <h2 className="flex items-center gap-2.5 mb-2 font-yeseva text-2xl text-gray-900">
            <span
                className={`w-3 h-3 rounded-full ${SECTIONS[section].dot}`}
                aria-hidden="true"
            />
            {children}
        </h2>
    );
}

SectionTitle.propTypes = {
    section: PropTypes.oneOf(Object.keys(SECTIONS)).isRequired,
    children: PropTypes.node.isRequired,
};

// The gift-list content
export default function IdeasToReserve({
    list,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
    userName,
    canReserve = true,
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

    // An idea with a membership link already entered applies to the entire brand
    Object.values(groupedIdeas).forEach((brandData) => {
        brandData.membership = brandData.ideas_available.find(
            (idea) => idea.membership,
        );
    });

    return (
        <>
            <Head title={`${list.name} de ${list.user_name}`} />

            <div>
                {ideas_available.length == 0 &&
                    ideas_reserved.length == 0 &&
                    ideas_purchased.length == 0 && (
                        <p
                            className={`${LIST_WIDTH} ${PAGE_GUTTER} py-10 text-center`}
                        >
                            Cette liste est vide pour le moment. Revenez plus
                            tard !
                        </p>
                    )}

                {ideas_available.length === 0 &&
                    (ideas_purchased.length > 0 ||
                        ideas_reserved.length > 0) && (
                        <Section section="available">
                            <SectionTitle section="available">
                                Idées disponibles
                            </SectionTitle>
                            <p className="text-center text-sm italic">
                                Cette liste est vide pour le moment. Revenez
                                plus tard !
                            </p>
                        </Section>
                    )}

                {ideas_available.length > 0 && (
                    <Section section="available">
                        <SectionTitle section="available">
                            Idées disponibles
                        </SectionTitle>
                        {canReserve && (
                            <div className="hidden sm:flex items-center text-gray-500 italic">
                                <small className="text-xs mr-1">
                                    Pour réserver un cadeau, cliquez sur le
                                    picto
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
                        )}
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
                        <div className={SECTION_BODY}>
                            <div className="space-y-12">
                                {Object.entries(groupedIdeas).map(
                                    ([brand, brandData]) => (
                                        <div key={brand}>
                                            <BrandHeading
                                                as="h3"
                                                brand={brand}
                                                count={
                                                    brandData.ideas_available
                                                        .length
                                                }
                                            />
                                            <BrandMembership
                                                membership={
                                                    brandData.membership
                                                }
                                            />
                                            <div className="mt-4 space-y-3">
                                                {brandData.ideas_available.map(
                                                    (idea) => (
                                                        <IdeasAvailable
                                                            key={idea.id}
                                                            idea={idea}
                                                            userName={userName}
                                                            canReserve={
                                                                canReserve
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </Section>
                )}

                {ideas_purchased.length > 0 && (
                    <Section section="purchased">
                        <SectionTitle section="purchased">
                            Cadeaux achetés
                        </SectionTitle>
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
                        <div className={SECTION_BODY}>
                            <div className="space-y-3">
                                {ideas_purchased.map((idea) => (
                                    <IdeasPurchased
                                        key={idea.id}
                                        idea={idea}
                                        userName={userName}
                                    />
                                ))}
                            </div>
                        </div>
                    </Section>
                )}

                {ideas_reserved.length > 0 && (
                    <Section section="reserved">
                        <SectionTitle section="reserved">
                            Cadeaux réservés
                        </SectionTitle>
                        {canReserve ? (
                            <>
                                <div className="hidden sm:flex items-center text-gray-500 italic">
                                    <small className="text-xs mr-1">
                                        Pour confirmer votre achat, cliquez sur
                                        le picto
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
                                        Pour annuler votre réservation, cliquez
                                        sur le picto
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
                            </>
                        ) : (
                            <small className="hidden sm:flex items-center mb-3 text-gray-500 italic text-xs">
                                La réservation d'un cadeau n'est possible qu'en
                                étant connecté·e.
                            </small>
                        )}
                        <div className={SECTION_BODY}>
                            <div className="space-y-3">
                                {ideas_reserved.map((idea) => (
                                    <IdeasReserved
                                        key={idea.id}
                                        idea={idea}
                                        userName={userName}
                                    />
                                ))}
                            </div>
                        </div>
                    </Section>
                )}
            </div>
        </>
    );
}

IdeasToReserve.propTypes = {
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
    }).isRequired,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
    userName: PropTypes.string,
    canReserve: PropTypes.bool,
};
