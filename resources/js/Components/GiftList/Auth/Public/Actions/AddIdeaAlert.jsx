import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AddIdeaAlertModal from "@/Components/GiftList/Auth/Public/Actions/AddIdeaAlertModal";

export default function AddIdeaAlert({
    list,
    ideas,
    ideas_available,
    daysSinceLastLogin,
}) {
    const [fewIdeasLeftModalVisible, setFewIdeasLeftModalVisible] =
        useState(false);

    useEffect(() => {
        if (
            ideas.length > 0 &&
            ideas_available.length < 6 &&
            !localStorage.getItem(`few-ideas-left-reminder-${list.id}`)
        ) {
            setFewIdeasLeftModalVisible(true);
        }
    }, [ideas.length, ideas_available.length, list.id]);

    useEffect(() => {
        // If user has not logged in for at least 30 days
        if (daysSinceLastLogin !== null && daysSinceLastLogin > 30) {
            localStorage.removeItem(`few-ideas-left-reminder-${list.id}`);
        }
    }, [daysSinceLastLogin, list.id]);

    const closeFewIdeasLeftModal = () => {
        setFewIdeasLeftModalVisible(false);
    };

    return (
        <AddIdeaAlertModal
            list={list}
            ideas_available={ideas_available}
            modalVisible={fewIdeasLeftModalVisible}
            closeModal={closeFewIdeasLeftModal}
        />
    );
}

AddIdeaAlert.propTypes = {
    list: PropTypes.object,
    ideas: PropTypes.array,
    ideas_available: PropTypes.array,
    daysSinceLastLogin: PropTypes.number,
};
