import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { LIST_CARD_HOVER } from "@/Components/GiftList/listCard";
import { getIdeaTitle } from "@/Components/Ideas/ideaHelpers";

// The whole card opens the edit form (button stretched over it), while links
// inside stay clickable on top of it. A link can't live inside a button.
export default function EditableIdea({ idea, className, renderEdit, children }) {
    const [editing, setEditing] = useState(false);
    const openRef = useRef(null);
    const shouldRestoreFocus = useRef(false);

    useEffect(() => {
        if (!editing && shouldRestoreFocus.current) {
            shouldRestoreFocus.current = false;
            openRef.current?.focus();
        }
    }, [editing]);

    const close = () => {
        shouldRestoreFocus.current = true;
        setEditing(false);
    };

    if (editing) {
        return <div className={className}>{renderEdit(close)}</div>;
    }

    return (
        <div
            className={`relative [&_a]:relative [&_a]:z-10 ${LIST_CARD_HOVER} ${className}`}
        >
            <button
                ref={openRef}
                type="button"
                onClick={() => setEditing(true)}
                aria-label={`Modifier l'idée ${getIdeaTitle(idea)}`}
                className="absolute inset-0 w-full rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            />
            {children}
        </div>
    );
}

EditableIdea.propTypes = {
    idea: PropTypes.shape({
        idea: PropTypes.string,
        link: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    // Receives `close`, to call on save or cancel.
    renderEdit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
