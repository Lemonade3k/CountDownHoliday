import { updateDOM, updateVisibility } from './countdown-ui.js';
import { timeOffset } from './time-sync.js';
import { findCountdown } from './config.js'; // Import countdowns array

export function updateCountdown(idPrefix, originalTargetDateString, showMinuteSecond) {
    const now = dayjs(Date.now() + timeOffset);
    let currentTarget = dayjs(originalTargetDateString);

    const countdownItem = findCountdown(idPrefix); // Use findCountdown
    if (!countdownItem) {
        console.error(`Countdown data not found for ${idPrefix}`);
        updateDOM(idPrefix, '--', '--', '--', '--', '--', showMinuteSecond);
        updateVisibility(idPrefix, 0, 0, 0, 0, 0, showMinuteSecond);
        return;
    }

    const isCustom = idPrefix.startsWith('custom');

    if (!isCustom && currentTarget.isBefore(now)) {
        while (currentTarget.isBefore(now)) {
            currentTarget = currentTarget.add(1, 'year');
        }
    }

    const diff = currentTarget.diff(now);

    if (diff <= 0) {
        updateDOM(idPrefix, 0, 0, 0, 0, 0, showMinuteSecond);
        updateVisibility(idPrefix, 0, 0, 0, 0, 0, showMinuteSecond);
        return;
    }

    const duration = dayjs.duration(diff);
    let displayMonths = 0;
    let displayDays = 0;
    let tempTargetForDisplay = dayjs(currentTarget);
    let tempNowForDisplay = dayjs(now);

    displayMonths = tempTargetForDisplay.diff(tempNowForDisplay, 'month');
    tempNowForDisplay = tempNowForDisplay.add(displayMonths, 'month');
    displayDays = tempTargetForDisplay.diff(tempNowForDisplay, 'day');

    if (displayDays < 0) {
         displayMonths = Math.max(0, displayMonths - 1);
         tempNowForDisplay = dayjs(now).add(displayMonths, 'month');
         displayDays = tempTargetForDisplay.diff(tempNowForDisplay, 'day');
    }
    displayMonths = Math.max(0, displayMonths);
    displayDays = Math.max(0, displayDays);

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    updateDOM(idPrefix, displayMonths, displayDays, hours, minutes, seconds, showMinuteSecond);
    updateVisibility(idPrefix, displayMonths, displayDays, hours, minutes, seconds, showMinuteSecond);
}
