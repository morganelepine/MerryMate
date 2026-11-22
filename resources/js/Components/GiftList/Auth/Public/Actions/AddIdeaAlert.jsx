import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AddIdeaAlertModal from "@/Components/GiftList/Auth/Public/Actions/AddIdeaAlertModal";

// One key for all lists, so that a long absence can reset every "don't remind me" at once.
const MUTED_LISTS_KEY = "few-ideas-left-reminder-muted";
const FEW_IDEAS_THRESHOLD = 6;

function readMutedListIds() {
    try {
        const ids = JSON.parse(localStorage.getItem(MUTED_LISTS_KEY));
        return Array.isArray(ids) ? ids : [];
    } catch {
        return [];
    }
}

export default function AddIdeaAlert({
    list,
    ideas,
    ideas_available,
    resetMutedReminders = false,
    deferred = false,
}) {
    const [fewIdeasLeftModalVisible, setFewIdeasLeftModalVisible] =
        useState(false);

    useEffect(() => {
        if (resetMutedReminders) {
            localStorage.removeItem(MUTED_LISTS_KEY);
        }
        // Closing the modal does not mute it: it comes back on the next visit.
        setFewIdeasLeftModalVisible(
            !deferred &&
                ideas.length > 0 &&
                ideas_available.length < FEW_IDEAS_THRESHOLD &&
                !readMutedListIds().includes(list.id),
        );
    }, [
        ideas.length,
        ideas_available.length,
        list.id,
        resetMutedReminders,
        deferred,
    ]);

    const muteForThisList = () => {
        localStorage.setItem(
            MUTED_LISTS_KEY,
            JSON.stringify([...readMutedListIds(), list.id]),
        );
        setFewIdeasLeftModalVisible(false);
    };

    return (
        <AddIdeaAlertModal
            list={list}
            ideas_available={ideas_available}
            modalVisible={fewIdeasLeftModalVisible}
            closeModal={() => setFewIdeasLeftModalVisible(false)}
            onNoReminder={muteForThisList}
        />
    );
}

AddIdeaAlert.propTypes = {
    list: PropTypes.object,
    ideas: PropTypes.array,
    ideas_available: PropTypes.array,
    resetMutedReminders: PropTypes.bool,
    // Another modal takes this visit: wait for the next one.
    deferred: PropTypes.bool,
};
