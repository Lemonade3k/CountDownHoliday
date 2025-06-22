class CountdownUI {
    constructor() {
        this.timeSync = new TimeSync();
        this.lunarConverter = new LunarDateConverter();
        this.currentTimeElement = null;
        this.lunarDateElement = null;
        this.updateInterval = null;
    }

    // Khởi tạo UI
    async init() {
        await this.timeSync.init();
        this.createTimeDisplayElements();
        this.startTimeUpdate();
    }

    // Tạo các element hiển thị thời gian
    createTimeDisplayElements() {
        // Tìm hoặc tạo element hiển thị thời gian hiện tại
        this.currentTimeElement = document.getElementById('current-time');
        if (!this.currentTimeElement) {
            this.currentTimeElement = document.createElement('div');
            this.currentTimeElement.id = 'current-time';
            this.currentTimeElement.className = 'current-time-display';
            
            // Thêm vào header hoặc vị trí phù hợp
            const header = document.querySelector('header') || document.body;
            header.appendChild(this.currentTimeElement);
        }

        // Tìm hoặc tạo element hiển thị ngày âm lịch
        this.lunarDateElement = document.getElementById('lunar-date');
        if (!this.lunarDateElement) {
            this.lunarDateElement = document.createElement('div');
            this.lunarDateElement.id = 'lunar-date';
            this.lunarDateElement.className = 'lunar-date-display';
            
            // Thêm sau element thời gian hiện tại
            this.currentTimeElement.parentNode.insertBefore(
                this.lunarDateElement, 
                this.currentTimeElement.nextSibling
            );
        }
    }

    // Bắt đầu cập nhật thời gian
    startTimeUpdate() {
        this.updateTimeDisplay();
        // Cập nhật mỗi giây
        this.updateInterval = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    }

    // Cập nhật hiển thị thời gian
    updateTimeDisplay() {
        const timeInfo = this.timeSync.getDetailedTimeInfo();
        this.updateCurrentTime(timeInfo);
        this.updateLunarDate(timeInfo);
    }

    // Cập nhật hiển thị thời gian hiện tại
    updateCurrentTime(timeInfo) {
        if (!this.currentTimeElement) return;

        const { solar } = timeInfo;
        const html = `
            <div class="time-container">
                <div class="current-time">
                    <i class="fas fa-clock"></i>
                    <span class="time">${solar.time}</span>
                </div>
                <div class="current-date">
                    <span class="day-of-week">${solar.dayOfWeek}</span>
                    <span class="date">${solar.formatted}</span>
                </div>
                <div class="timezone">
                    <small>${timeInfo.timezone}</small>
                </div>
            </div>
        `;
        
        this.currentTimeElement.innerHTML = html;
    }

    // Cập nhật hiển thị ngày âm lịch
    updateLunarDate(timeInfo) {
        if (!this.lunarDateElement) return;

        const { lunar } = timeInfo;
        const html = `
            <div class="lunar-container">
                <div class="lunar-header">
                    <i class="fas fa-moon"></i>
                    <span class="lunar-title">Âm lịch</span>
                </div>
                <div class="lunar-date">
                    <span class="lunar-day">${lunar.day}</span>
                    <span class="lunar-month">${lunar.monthName}</span>
                    <span class="lunar-year">${lunar.year}</span>
                </div>
                <div class="lunar-full">
                    <small>${lunar.formatted}</small>
                </div>
                <div class="sync-status">
                    <small class="sync-indicator ${timeInfo.syncStatus === 'Đã đồng bộ' ? 'synced' : 'not-synced'}">
                        <i class="fas fa-sync-alt"></i>
                        ${timeInfo.syncStatus}
                    </small>
                </div>
            </div>
        `;
        
        this.lunarDateElement.innerHTML = html;
    }

    // Cập nhật countdown cho các ngày lễ
    updateCountdowns() {
        const countdownElements = document.querySelectorAll('.countdown-card');
        
        countdownElements.forEach(element => {
            const targetDate = element.dataset.targetDate;
            if (!targetDate) return;

            const timeUntil = this.timeSync.getTimeUntil(new Date(targetDate));
            this.updateCountdownCard(element, timeUntil);
        });
    }

    // Cập nhật một card countdown
    updateCountdownCard(element, timeUntil) {
        const daysElement = element.querySelector('.days .number');
        const hoursElement = element.querySelector('.hours .number');
        const minutesElement = element.querySelector('.minutes .number');
        const secondsElement = element.querySelector('.seconds .number');

        if (timeUntil.expired) {
            element.classList.add('expired');
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
        } else {
            element.classList.remove('expired');
            if (daysElement) daysElement.textContent = timeUntil.days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = timeUntil.hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = timeUntil.minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = timeUntil.seconds.toString().padStart(2, '0');
        }
    }

    // Lấy thông tin ngày âm lịch cho một ngày cụ thể
    getLunarDateForDate(date) {
        return this.lunarConverter.solarToLunar(date);
    }

    // Format ngày âm lịch cho hiển thị
    formatLunarDateDisplay(lunarDate) {
        return this.lunarConverter.formatLunarDate(lunarDate);
    }

    // Dọn dẹp khi không sử dụng
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.timeSync) {
            this.timeSync.destroy();
        }
    }
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CountdownUI;
} else {
    window.CountdownUI = CountdownUI;
}

const cssStyles = `
/* --- Base Styles --- */
body {
    /* Basic font and background settings */
}
.countdown-container {
    max-width: 1152px;
    margin: 0 auto;
    padding: 0;
}
header h1 {
    word-break: break-word; /* For responsive title */
}

/* --- Card Styles --- */
.main-countdown-card {
    width: 100%;
    position: relative;
}
.small-countdowns-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
}
.small-countdown-card {
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
}

/* --- Time Block Styles (Desktop View) --- */
.time-block {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.main-time-block {
    min-width: 120px;
    padding: 1rem;
}
.main-time-block .time-value {
    font-size: 3rem;
    font-weight: 700;
}
.main-time-block .time-label {
    font-size: 1.125rem;
    font-weight: 500;
    opacity: 0.75;
}

/* --- Mobile View Banner Style --- */
.total-days-banner {
    width: auto;
    display: inline-block;
    max-width: 95%;
    padding: 2rem 4rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
}
.total-days-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0.5rem;
}

/* --- View Toggling Logic & Button --- */
.main-countdown-card .desktop-countdown { display: flex; }
.main-countdown-card .mobile-countdown { display: none; }
.main-countdown-card.view-total-days .desktop-countdown { display: none; }
.main-countdown-card.view-total-days .mobile-countdown { display: flex; justify-content: center; }

.view-toggle-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0,0,0,0.08);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.view-toggle-btn:hover {
    opacity: 1;
    transform: rotate(90deg);
}

/* --- Small Countdown Cards --- */
.compact-countdown {
    /* Styles for small cards */
}
/* ... other small card styles ... */

/* --- Themes --- */
.tet-theme {
    background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
    color:rgb(196, 21, 21);
    border: 2px solid rgb(255, 95, 95);
}
.hung-kings-theme {
    background: linear-gradient(135deg, #fff5cc 0%, #ffdf7e 100%);
    color: #8c5a00;
}
.liberation-theme {
    background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
    color: #1e3a8a;
}
.national-theme {
    background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
    color: #991b1b;
}
.new-year-theme {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
}

/* --- Responsive Media Queries --- */
@media (max-width: 768px) {
    header h1 { font-size: 2.5rem; }
    header p { font-size: 1rem; padding: 0 1rem; }
    .small-countdowns-grid { grid-template-columns: 1fr; }
    /* ... other responsive styles ... */
}

/* Styles for smaller countdown cards */
.small-countdown-card .countdown-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
    align-items: center;
    justify-items: center;
    max-width: 340px;
    margin: 0 auto;
}
.small-countdown-card .time-block {
    width: 100%;
    padding: 1rem 1.5rem;
    aspect-ratio: 1 / 1;
}
.small-countdown-card .time-value {
    font-size: 1.75rem; /* text-2xl */
    font-weight: 700;
}
.small-countdown-card .time-label {
    font-size: 0.75rem; /* text-xs */
    font-weight: 500;
    opacity: 0.75;
}
`;

/**
 * Injects the CSS styles into the document's head.
 */
function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssStyles;
    document.head.appendChild(styleElement);
}

/**
 * Generates the HTML for a main countdown card.
 * @param {object} holiday - The holiday data object.
 * @returns {string} The HTML string for the main card.
 */
export function generateMainCardHTML(holiday) {
    return `
        <section id="${holiday.idPrefix}Container" class="${holiday.themeClass} main-countdown-card rounded-2xl p-8 mb-8 shadow-lg relative">
            <button id="toggle-view-${holiday.idPrefix}" class="view-toggle-btn" aria-label="Chuyển đổi chế độ xem">
                <i class="fas fa-sync-alt"></i>
            </button>
            <div class="flex items-center justify-center mb-4">
                <i class="fas ${holiday.iconClass} festival-icon text-3xl mr-4"></i>
                <h2 class="text-4xl font-bold">${holiday.title}</h2>
            </div>
            ${holiday.note ? `<h3 class="text-xl mb-8 text-center">${holiday.note}</h3>` : ''}
            
            <!-- Desktop View: Detailed -->
            <div class="desktop-countdown flex flex-wrap justify-center gap-6">
                <div class="time-block main-time-block">
                    <span id="${holiday.idPrefix}-month" class="time-value">0</span>
                    <span class="time-label">Tháng</span>
                </div>
                <div class="time-block main-time-block">
                    <span id="${holiday.idPrefix}-day" class="time-value">0</span>
                    <span class="time-label">Ngày</span>
                </div>
                <div class="time-block main-time-block">
                    <span id="${holiday.idPrefix}-hour" class="time-value">00</span>
                    <span class="time-label">Giờ</span>
                </div>
                <div class="time-block main-time-block">
                    <span id="${holiday.idPrefix}-minute" class="time-value">00</span>
                    <span class="time-label">Phút</span>
                </div>
                ${holiday.showSeconds ? `
                <div class="time-block main-time-block">
                    <span id="${holiday.idPrefix}-second" class="time-value">00</span>
                    <span class="time-label">Giây</span>
                </div>` : ''}
            </div>

            <!-- Mobile View: Total Days -->
            <div class="mobile-countdown">
                <div class="total-days-banner">
                    <span id="${holiday.idPrefix}-total-days-text"></span>
                </div>
            </div>
        </section>
    `;
}

/**
 * Generates the HTML for a small countdown card.
 * @param {object} holiday - The holiday data object.
 * @returns {string} The HTML string for the small card.
 */
export function generateSmallCardHTML(holiday) {
    return `
        <div id="${holiday.idPrefix}Container" class="${holiday.themeClass} small-countdown-card rounded-xl p-6 shadow-lg relative">
            <div class="flex items-center justify-center mb-3">
                <i class="fas ${holiday.iconClass} festival-icon text-xl mr-2"></i>
                <h2 class="text-lg font-bold text-center">${holiday.title}</h2>
            </div>
            ${holiday.note ? `<h3 class="text-sm mb-4 text-center">${holiday.note}</h3>` : ''}
            <div id="countdown-${holiday.idPrefix}" class="countdown-grid">
                <div class="time-block">
                    <span id="${holiday.idPrefix}-month" class="time-value">0</span>
                    <span class="time-label">Tháng</span>
                </div>
                <div class="time-block">
                    <span id="${holiday.idPrefix}-day" class="time-value">00</span>
                    <span class="time-label">Ngày</span>
                </div>
                <div class="time-block">
                    <span id="${holiday.idPrefix}-hour" class="time-value">00</span>
                    <span class="time-label">Giờ</span>
                </div>
                <div class="time-block">
                    <span id="${holiday.idPrefix}-minute" class="time-value">00</span>
                    <span class="time-label">Phút</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initializes the page by rendering countdown cards from the data.
 * @param {Array<object>} holidays - An array of holiday objects.
 */
export function initializePage(holidays) {
    const mainContainer = document.getElementById('main-countdown-container');
    const smallContainer = document.getElementById('small-countdowns-container');

    if (!mainContainer || !smallContainer) return;

    mainContainer.innerHTML = '';
    smallContainer.innerHTML = '';

    holidays.forEach(holiday => {
        if (holiday.main) {
            mainContainer.innerHTML += generateMainCardHTML(holiday);
        } else {
            smallContainer.innerHTML += generateSmallCardHTML(holiday);
        }
    });
}

/**
 * Updates the display of a single countdown timer.
 * @param {object} holiday - The holiday data object.
 * @param {object} timeRemaining - The time remaining object.
 */
export function updateCountdownUI(holiday, timeRemaining) {
    const { months, days, hours, minutes, seconds, totalDays } = timeRemaining;

    // Update desktop view
    const monthEl = document.getElementById(`${holiday.idPrefix}-month`);
    const dayEl = document.getElementById(`${holiday.idPrefix}-day`);
    const hourEl = document.getElementById(`${holiday.idPrefix}-hour`);
    const minuteEl = document.getElementById(`${holiday.idPrefix}-minute`);
    const secondEl = document.getElementById(`${holiday.idPrefix}-second`);

    if (monthEl) monthEl.textContent = String(months);
    if (dayEl) dayEl.textContent = String(days).padStart(2, '0');
    if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
    if (minuteEl) minuteEl.textContent = String(minutes).padStart(2, '0');
    if (secondEl && holiday.showSeconds) {
        secondEl.textContent = String(seconds).padStart(2, '0');
    }

    // Update mobile view
    const totalDaysTextEl = document.getElementById(`${holiday.idPrefix}-total-days-text`);
    if (totalDaysTextEl) {
        totalDaysTextEl.innerHTML = `Còn <strong class="total-days-number">${totalDays}</strong> ngày`;
    }
}

// Inject the styles into the DOM when the module is loaded
injectStyles();