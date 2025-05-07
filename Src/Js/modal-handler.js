import { getElement, modalOverlay as getModalOverlay, modalForm as getModalForm, smallCountdownsContainer as getSmallCountdownsContainer, addBtn as getAddBtn } from './dom-utils.js';
import { LunarDateConverter } from './lunar-converter.js';
import { incrementCustomCounterId, addCountdownData } from './config.js';
import { createSmallCountdownBox } from './countdown-ui.js';
import { updateCountdown } from './countdown-core.js';
import { timeOffset } from './time-sync.js';


export function openModal() {
    const modal = getModalOverlay();
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        requestAnimationFrame(() => {
            modal.querySelector('.modal').classList.add('active');
        });
    }
}

export function closeModal() {
    const modal = getModalOverlay();
    const form = getModalForm();
    if (modal) {
        modal.querySelector('.modal').classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (form) form.reset();
        }, 300);
    }
}

export function handleAddCustomCountdown(e) {
    e.preventDefault();
    const name = getElement('customName').value.trim();
    const dateInput = getElement('customDate').value;
    const timeInput = getElement('customTime').value || '00:00';
    const lunarChecked = getElement('customLunar').checked;
    const customColorValue = getElement('customColor').value;

    if (!name || !dateInput) {
        alert('Vui lòng nhập đầy đủ Tên và Ngày đích.');
        return;
    }

    let targetDateTimeString;

    if (lunarChecked) {
        const selectedSolarDate = dayjs(dateInput);
        const lunarD = selectedSolarDate.date();
        const lunarM = selectedSolarDate.month() + 1;
        let solarYearRef = selectedSolarDate.year();

        let solarEquivalent = LunarDateConverter.lunarToSolar(lunarD, lunarM, solarYearRef, 0);
        let targetDayjs = dayjs(`${solarEquivalent.year}-${solarEquivalent.month}-${solarEquivalent.day}T${timeInput}:00`);

        const now = dayjs(Date.now() + timeOffset);
        if (!targetDayjs.isValid() || targetDayjs.isBefore(now)) {
            alert('Không thể tạo bộ đếm cho ngày Âm lịch đã qua hoặc không hợp lệ. Vui lòng chọn một ngày Âm lịch trong tương lai.');
            return;
        }
        targetDateTimeString = targetDayjs.format('YYYY-MM-DDTHH:mm:ss');
    } else {
        const targetDate = dayjs(`${dateInput}T${timeInput}:00`);
        if (!targetDate.isValid()) {
            alert('Ngày giờ không hợp lệ.');
            return;
        }
        targetDateTimeString = targetDate.format('YYYY-MM-DDTHH:mm:ss');
    }

    const idPrefix = 'custom' + incrementCustomCounterId();
    const newCountdownData = {
        idPrefix,
        title: name,
        note: lunarChecked ? '(âm lịch)' : '',
        targetDate: targetDateTimeString,
        showMinuteSecond: false,
        theme: 'new-year-theme',
        customColor: customColorValue
    };

    addCountdownData(newCountdownData); // Add to the global array
    createSmallCountdownBox(newCountdownData, getSmallCountdownsContainer(), getAddBtn());
    updateCountdown(idPrefix, newCountdownData.targetDate, newCountdownData.showMinuteSecond);
    closeModal();
}
