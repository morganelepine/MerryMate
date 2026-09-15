import PropTypes from "prop-types";
import Linkify from "linkify-react"; //rendre les liens cliquables

export default function BrandMembership({ membership }) {
    if (!membership) return null;

    return (
        <div className="flex flex-wrap p-1 sm:p-0 mt-2 mb-3">
            <p className="text-xs italic ">
                Lien/code à utiliser pour bénéficier d'une réduction
                {membership.membership_reduction
                    ? ` (${membership.membership_reduction})`
                    : null}
                &nbsp;:&nbsp;
                <span className="text-xs italic hover:text-orange-500">
                    <Linkify options={{ target: "blank" }}>
                        {membership.membership}
                    </Linkify>
                </span>
            </p>
        </div>
    );
}

BrandMembership.propTypes = {
    membership: PropTypes.shape({
        membership: PropTypes.string,
        membership_reduction: PropTypes.string,
    }),
};
