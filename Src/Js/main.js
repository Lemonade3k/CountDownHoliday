import { countdowns } from './config.js';
import { updateCountdown } from './countdown-core.js';
import { syncTimeWithAPI, getIsTimeInitialized } from './time-sync.js';
import { openModal, closeModal, handleAddCustomCountdown } from './modal-handler.js';
import { initTheme, isSimpleTheme } from './theme-handler.js';
import { addBtn as getAddBtn, modalOverlay as getModalOverlay, cancelBtn as getCancelBtn, modalForm as getModalForm, smallCountdownsContainer as getSmallCountdownsContainer } from './dom-utils.js';
import { createSmallCountdownBox } from './countdown-ui.js';

// Enable Day.js plugins
dayjs.extend(dayjs_plugin_duration);
dayjs.extend(dayjs_plugin_relativeTime);

let countdownIntervals = {};
let timeSyncInterval = null;

function updateAllCountdowns() {
    if (!getIsTimeInitialized()) return;
    countdowns.forEach(({ idPrefix, targetDate, showMinuteSecond }) => {
        const targetDayjs = dayjs(targetDate);
        if (targetDayjs.isValid()) {
            updateCountdown(idPrefix, targetDate, showMinuteSecond);
        } else {
            console.warn(`Invalid date format for ${idPrefix}: ${targetDate}`);
            // updateDOM(idPrefix, '--', '--', '--', '--', '--', showMinuteSecond);
        }
    });
}

function clearAllIntervals() {
    for (const id in countdownIntervals) {
        clearInterval(countdownIntervals[id]);
    }
    if (timeSyncInterval) clearInterval(timeSyncInterval);
    countdownIntervals = {};
    timeSyncInterval = null;
}

export function startAllCountdowns() {
    clearAllIntervals();
    updateAllCountdowns();
    countdownIntervals['mainUpdate'] = setInterval(updateAllCountdowns, 1000);
    timeSyncInterval = setInterval(syncTimeWithAPI, 300000); // 5 minutes
}

function initializeDefaultCountdowns() {
    const smallContainer = getSmallCountdownsContainer();
    const addButton = getAddBtn();
    if (!smallContainer || !addButton) {
        console.error("Small countdowns container or add button not found for initialization.");
        return;
    }

    countdowns.forEach(countdownData => {
        if (countdownData.idPrefix !== 'lunar') { // Bỏ qua bộ đếm chính 'lunar'
             createSmallCountdownBox(countdownData, smallContainer, addButton);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initializeDefaultCountdowns(); // Gọi hàm này để tạo các ô

    const addBtnElement = getAddBtn();
    const modalOverlayElement = getModalOverlay();
    const cancelBtnElement = getCancelBtn();
    const modalFormElement = getModalForm();

    if (addBtnElement) {
        addBtnElement.addEventListener('click', openModal);
    }
    if (modalOverlayElement) {
        modalOverlayElement.addEventListener('click', (e) => {
            if (e.target === modalOverlayElement) {
                closeModal();
            }
        });
    }
    if (cancelBtnElement) {
        cancelBtnElement.addEventListener('click', closeModal);
    }
    if (modalFormElement) {
        modalFormElement.addEventListener('submit', handleAddCustomCountdown);
    }

    syncTimeWithAPI();
});
