import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArchiveReminderModal from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminderModal";

export default function ArchiveReminder({ list, daysSinceLastLogin }) {
    const [archiveReminderVisible, setArchiveReminderVisible] = useState(false);

    useEffect(() => {
        // If user has not logged in for at least 30 days
        if (daysSinceLastLogin !== null && daysSinceLastLogin > 30) {
            if (!localStorage.getItem(`archive-reminder-${list.id}`)) {
                setArchiveReminderVisible(true);
                localStorage.setItem(`archive-reminder-${list.id}`, "shown");
            }
        }
    }, [daysSinceLastLogin, list.id]);

    const closeArchiveReminderModal = () => {
        setArchiveReminderVisible(false);
    };

    return (
        <ArchiveReminderModal
            list={list}
            modalVisible={archiveReminderVisible}
            closeModal={closeArchiveReminderModal}
        />
    );
}

ArchiveReminder.propTypes = {
    list: PropTypes.object,
    daysSinceLastLogin: PropTypes.number,
};
