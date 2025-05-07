import { getElement, hideElement, showElement } from './dom-utils.js';
import { isSimpleTheme } from './theme-handler.js';

export function updateDOM(idPrefix, months, days, hours, minutes, seconds, showMinuteSecond) {
    const monthEl = getElement(`${idPrefix}-month`);
    const dayEl = getElement(`${idPrefix}-day`);
    const hourEl = getElement(`${idPrefix}-hour`);
    const minuteEl = getElement(`${idPrefix}-minute`);
    const secondEl = getElement(`${idPrefix}-second`);

    if (monthEl) monthEl.textContent = months;
    if (dayEl) dayEl.textContent = days;
    if (hourEl) hourEl.textContent = hours.toString().padStart(2, '0');
    if (minuteEl) minuteEl.textContent = minutes.toString().padStart(2, '0');
    if (secondEl && showMinuteSecond) secondEl.textContent = seconds.toString().padStart(2, '0');
}

export function updateVisibility(idPrefix, months, days, hours, minutes, seconds, showMinuteSecond) {
    const monthBlock = getElement(`${idPrefix}-month`)?.closest('.time-block');
    const dayBlock = getElement(`${idPrefix}-day`)?.closest('.time-block');
    const hourBlock = getElement(`${idPrefix}-hour`)?.closest('.time-block');
    const minuteBlock = getElement(`${idPrefix}-minute`)?.closest('.time-block');
    const secondBlock = getElement(`${idPrefix}-second`)?.closest('.time-block');

    if (months <= 0) {
        hideElement(monthBlock);
        if (days <= 0) {
            hideElement(dayBlock);
            if (hours <= 0) {
                hideElement(hourBlock);
                if (minutes <= 0) {
                    hideElement(minuteBlock);
                    if (!showMinuteSecond || seconds <= 0) {
                        hideElement(secondBlock);
                    } else {
                        showElement(secondBlock);
                    }
                } else {
                    showElement(minuteBlock);
                    if (showMinuteSecond) showElement(secondBlock); else hideElement(secondBlock);
                }
            } else {
                showElement(hourBlock);
                showElement(minuteBlock);
                if (showMinuteSecond) showElement(secondBlock); else hideElement(secondBlock);
            }
        } else {
            showElement(dayBlock);
            showElement(hourBlock);
            showElement(minuteBlock);
            if (showMinuteSecond) showElement(secondBlock); else hideElement(secondBlock);
        }
    } else {
        showElement(monthBlock);
        showElement(dayBlock);
        showElement(hourBlock);
        showElement(minuteBlock);
        if (showMinuteSecond) showElement(secondBlock); else hideElement(secondBlock);
    }

    if (!showMinuteSecond) {
        hideElement(secondBlock);
        // Nếu không hiển thị giây, và phút cũng là đơn vị nhỏ nhất không muốn hiển thị (do showMinuteSecond=false)
        // thì cần đảm bảo khối phút cũng được ẩn nếu giá trị của nó là 0.
        // Logic hiện tại: nếu showMinuteSecond=false, khối giây sẽ ẩn.
        // Khối phút sẽ ẩn nếu giá trị phút <= 0 (trong điều kiện giờ <=0, ngày <=0, tháng <=0).
        // Điều này có vẻ ổn cho việc chỉ hiển thị Tháng, Ngày, Giờ khi showMinuteSecond=false và phút=0.
    }
}

export function createSmallCountdownBox(data, smallContainer, addButton) {
    if (!smallContainer) return;

    const box = document.createElement('div');
    box.dataset.id = data.idPrefix;
    let themeClassToApply = data.theme || 'new-year-theme';
    box.className = `countdown-card ${themeClassToApply} rounded-xl p-6 shadow-lg`;

    box.innerHTML = `
        <div class="flex items-center mb-2">
            <i class="fas fa-calendar-alt festival-icon mr-2"></i>
            <h3 class="text-xl font-semibold text-indigo-600">
                ${data.title}
                ${data.note ? `<span class="text-sm font-normal text-indigo-500">${data.note}</span>` : ''}
            </h3>
        </div>
        <div id="countdown-${data.idPrefix}" class="grid grid-cols-4 gap-4 mt-6">
            <div class="time-block text-center p-3" style="display: none;">
                <span id="${data.idPrefix}-month" class="text-2xl font-bold block time-value">0</span>
                <span class="text-xs time-label">Tháng</span>
            </div>
            <div class="time-block text-center p-3" style="display: none;">
                <span id="${data.idPrefix}-day" class="text-2xl font-bold block time-value">0</span>
                <span class="text-xs time-label">Ngày</span>
            </div>
            <div class="time-block text-center p-3" style="display: none;">
                <span id="${data.idPrefix}-hour" class="text-2xl font-bold block time-value">00</span>
                <span class="text-xs time-label">Giờ</span>
            </div>
            <div class="time-block text-center p-3" style="display: ${data.showMinuteSecond ? 'block' : 'none'};">
                <span id="${data.idPrefix}-minute" class="text-2xl font-bold block time-value">00</span>
                <span class="text-xs time-label">Phút</span>
            </div>
        </div>
    `;

    if (addButton) {
        smallContainer.insertBefore(box, addButton);
    } else {
        smallContainer.appendChild(box);
    }

    if (data.customColor) {
        if (!isSimpleTheme()) {
            box.style.borderColor = data.customColor;
        }
        const iconEl = box.querySelector('.festival-icon');
        const titleEl = box.querySelector('h3');
        const noteEl = box.querySelector('h3 span');
        const timeValueEls = box.querySelectorAll(`#countdown-${data.idPrefix} .time-block span.time-value`); // Target specific class
        const timeLabelEls = box.querySelectorAll(`#countdown-${data.idPrefix} .time-block span.time-label`); // Target specific class

        if (iconEl) iconEl.style.color = data.customColor;
        if (titleEl) titleEl.style.color = data.customColor;
        if (noteEl) noteEl.style.color = data.customColor;
        timeValueEls.forEach(el => el.style.color = data.customColor);
        timeLabelEls.forEach(el => el.style.color = data.customColor);
    } else {
        const iconEl = box.querySelector('.festival-icon');
        if (iconEl) iconEl.classList.add('text-indigo-500'); // Default icon color if no custom color
    }
}
