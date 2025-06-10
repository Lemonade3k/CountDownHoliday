import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { getElement } from '../utils/domHelpers.js';

dayjs.extend(duration);

export class CountdownManager {
    constructor(timeSync) {
        this.timeSync = timeSync;
        this.countdowns = [];
        this.intervals = {};
        this.customCounterId = 1000;
    }

    initializeCountdowns(countdownsData) {
        this.countdowns = [...countdownsData];
        
        // Tạo time blocks cho tất cả bộ đếm
        this.countdowns.forEach(countdown => {
            const containerId = countdown.isMain ? 'countdown-lunar' : `countdown-${countdown.idPrefix}`;
            this.createTimeBlocks(containerId, countdown.idPrefix, countdown.showMinuteSecond, countdown.isMain);
        });
    }

    createTimeBlocks(containerId, idPrefix, showMinuteSecond = false, isMain = false) {
        const container = getElement(containerId);
        if (!container) return;

        if (isMain) {
            // Format cho bộ đếm chính: 5 ô riêng biệt
        const timeBlocks = [
            { id: `${idPrefix}-month`, label: 'Tháng', show: true },
            { id: `${idPrefix}-day`, label: 'Ngày', show: true },
            { id: `${idPrefix}-hour`, label: 'Giờ', show: true },
            { id: `${idPrefix}-minute`, label: 'Phút', show: true },
            { id: `${idPrefix}-second`, label: 'Giây', show: showMinuteSecond }
        ];

        container.innerHTML = timeBlocks
            .filter(block => block.show)
            .map(block => `
                    <div class="time-block main-time-block">
                    <span id="${block.id}" class="time-value">0</span>
                    <span class="time-label">${block.label}</span>
                </div>
            `).join('');
            } else {
            // Format cho bộ đếm nhỏ: hiển thị dạng 0:00:00
            container.innerHTML = `
                <div class="compact-countdown">
                    <div class="compact-time-display">
                        <span id="${idPrefix}-month" class="time-number">0</span>
                        <span class="time-separator">:</span>
                        <span id="${idPrefix}-day" class="time-number">00</span>
                        <span class="time-separator">:</span>
                        <span id="${idPrefix}-hour" class="time-number">00</span>
                        <span class="time-separator">:</span>
                        <span id="${idPrefix}-minute" class="time-number">00</span>
                        ${showMinuteSecond ? `
                        <span class="time-separator">:</span>
                        <span id="${idPrefix}-second" class="time-number">00</span>
                        ` : ''}
                    </div>
                    <div class="compact-time-labels">
                        <span class="compact-label">Tháng</span>
                        <span class="compact-label">Ngày</span>
                        <span class="compact-label">Giờ</span>
                        <span class="compact-label">Phút</span>
                        ${showMinuteSecond ? '<span class="compact-label">Giây</span>' : ''}
                    </div>
                </div>
            `;
    }
    }

    updateCountdown(idPrefix, targetDate, showMinuteSecond) {
        if (!this.timeSync.isTimeInitialized()) return;

        const now = this.timeSync.getCurrentTime();
        const target = dayjs(targetDate);
        
        if (!target.isValid()) {
            console.warn(`Invalid date format for ${idPrefix}: ${targetDate}`);
            return;
    }

        let diff = target.diff(now);
        
        if (diff <= 0) {
            const nextYear = target.add(1, 'year');
            diff = nextYear.diff(now);
        }

        const durationObj = dayjs.duration(diff);
        
        // Tính toán tháng và ngày chính xác hơn
        let tempNow = dayjs(now);
        let tempTarget = dayjs(target);
        
        if (diff <= 0) {
            tempTarget = tempTarget.add(1, 'year');
    }

        let displayMonths = 0;
        let tempNowForDisplay = dayjs(tempNow);
        let tempTargetForDisplay = dayjs(tempTarget);
        
        while (tempNowForDisplay.add(1, 'month').isBefore(tempTargetForDisplay) || 
               tempNowForDisplay.add(1, 'month').isSame(tempTargetForDisplay, 'day')) {
            displayMonths++;
            tempNowForDisplay = tempNowForDisplay.add(1, 'month');
        }
        
        let displayDays = tempTargetForDisplay.diff(tempNowForDisplay, 'day');
        
        if (displayDays < 0) {
            displayMonths = Math.max(0, displayMonths - 1);
            tempNowForDisplay = dayjs(now).add(displayMonths, 'month');
            displayDays = tempTargetForDisplay.diff(tempNowForDisplay, 'day');
        }
        
        displayMonths = Math.max(0, displayMonths);
        displayDays = Math.max(0, displayDays);
        
        const hours = durationObj.hours();
        const minutes = durationObj.minutes();
        const seconds = durationObj.seconds();
        
        this.updateDOM(idPrefix, displayMonths, displayDays, hours, minutes, seconds, showMinuteSecond);
    }

    updateDOM(idPrefix, months, days, hours, minutes, seconds, showMinuteSecond) {
        const monthEl = getElement(`${idPrefix}-month`);
        const dayEl = getElement(`${idPrefix}-day`);
        const hourEl = getElement(`${idPrefix}-hour`);
        const minuteEl = getElement(`${idPrefix}-minute`);
        const secondEl = getElement(`${idPrefix}-second`);

        // Kiểm tra xem có phải là bộ đếm compact không
        const isCompact = monthEl?.parentElement?.classList.contains('compact-time-display');

        if (monthEl) {
            monthEl.textContent = isCompact ? months : months;
        }
        if (dayEl) {
            dayEl.textContent = isCompact ? days.toString().padStart(2, '0') : days;
        }
        if (hourEl) {
            hourEl.textContent = hours.toString().padStart(2, '0');
        }
        if (minuteEl) {
            minuteEl.textContent = minutes.toString().padStart(2, '0');
        }
        if (secondEl && showMinuteSecond) {
            secondEl.textContent = seconds.toString().padStart(2, '0');
        }
    }

    updateAllCountdowns() {
        if (!this.timeSync.isTimeInitialized()) return;
        
        this.countdowns.forEach(({ idPrefix, targetDate, showMinuteSecond }) => {
            const targetDayjs = dayjs(targetDate);
            if (targetDayjs.isValid()) {
                this.updateCountdown(idPrefix, targetDate, showMinuteSecond);
            } else {
                console.warn(`Invalid date format for ${idPrefix}: ${targetDate}`);
                this.updateDOM(idPrefix, '--', '--', '--', '--', '--', showMinuteSecond);
            }
        });
    }

    startAllCountdowns() {
        this.clearAllIntervals();
        this.updateAllCountdowns();
        this.intervals['mainUpdate'] = setInterval(() => this.updateAllCountdowns(), 1000);
    }

    clearAllIntervals() {
        for (const id in this.intervals) {
            clearInterval(this.intervals[id]);
        }
        this.intervals = {};
    }

    addCustomCountdown(countdownData) {
        const customId = this.generateCustomId();
        const newCountdown = {
            ...countdownData,
            idPrefix: customId
        };
        
        this.countdowns.push(newCountdown);
        return newCountdown;
    }

    generateCustomId() {
        return 'custom' + this.customCounterId++;
    }
}
