import PropTypes from "prop-types";

export default function BrandHeading({ brand, as: Heading = "h2", color }) {
    return (
        <div className="flex items-baseline gap-2">
            <Heading
                className={`font-semibold text-lg break-words min-w-0 ${color}`}
            >
                {brand}
            </Heading>
        </div>
    );
}

BrandHeading.propTypes = {
    brand: PropTypes.string.isRequired,
    as: PropTypes.oneOf(["h2", "h3"]),
};
