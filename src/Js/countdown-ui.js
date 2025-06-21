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
/* Container chính */
.countdown-container {
    max-width: 1152px; /* max-w-6xl */
    margin: 0 auto;
    padding: 0;
}

/* Main countdown card - Full width */
.main-countdown-card {
    width: 100%;
    position: relative;
}

/* Grid container cho các bộ đếm nhỏ */
.small-countdowns-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem; /* gap-6 */
    width: 100%;
}

/* Small countdown cards */
.small-countdown-card {
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
        padding: 1.5rem;
    }
    
/* Time blocks chung - Loại bỏ hoàn toàn backdrop-filter */
.time-block {
    background: rgba(255, 255, 255, 0.95); /* Tăng opacity để thay thế blur */
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.8); /* Thêm border trắng */
    }
    
/* Time blocks cho main countdown */
.main-time-block {
    min-width: 120px;
        padding: 1rem;
    background: rgba(255, 255, 255, 0.9); /* Background đặc hơn cho main */
    box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
    }
    
    .main-time-block .time-value {
    font-size: 3rem; /* text-5xl */
    font-weight: 700;
    display: block;
    margin-bottom: 0.5rem;
    line-height: 1;
    }
    
.main-time-block .time-label {
    font-size: 1.125rem; /* text-lg */
    font-weight: 500;
    opacity: 0.75;
    }
    
/* Compact countdown style cho bộ đếm nhỏ */
.compact-countdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: rgba(255, 255, 255, 0.1); /* Background nhẹ */
    border-radius: 0.5rem;
        padding: 1rem;
    }
    
    .compact-time-display {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem; /* text-4xl */
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
    font-family: 'Courier New', monospace; /* Font monospace để căn chỉnh đều */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Text shadow để tăng độ nổi bật */
    }
    
.time-number {
    color: inherit;
    min-width: 1.2em; /* Đảm bảo width đồng nhất */
    text-align: center;
    }

.time-separator {
    color: inherit;
    opacity: 0.7;
    margin: 0 0.1em;
}

.compact-time-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 300px;
    font-size: 0.75rem; /* text-xs */
    font-weight: 500;
    opacity: 0.75;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    }
    
.compact-label {
    flex: 1;
    text-align: center;
    padding: 0 0.25rem;
    }

/* Hover effects */
.time-block:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 1); /* Background hoàn toàn trắng khi hover */
}

.small-countdown-card:hover .compact-countdown {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
    transition: all 0.3s ease;
}

.small-countdown-card:hover .compact-time-display {
    transform: scale(1.05);
    transition: transform 0.3s ease;
}

/* Add button styling */
.add-button {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    transition: all 0.3s ease;
    min-height: 200px;
    border-radius: 0.75rem;
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

/* Modal styles - Loại bỏ hoàn toàn backdrop-filter */
#modalOverlay {
    display: none;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75); /* Tăng opacity để thay thế blur */
    align-items: center;
    justify-content: center;
    z-index: 50;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

#modalOverlay.active {
    display: flex;
    opacity: 1;
}

#modalOverlay .modal {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Shadow mạnh hơn */
    width: 100%;
    max-width: 28rem;
    transform: scale(0.95) translateY(10px);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(255, 255, 255, 0.1); /* Thêm border nhẹ */
}

#modalOverlay.active .modal {
    transform: scale(1) translateY(0);
    opacity: 1;
}

/* Đảm bảo countdown containers hiển thị đúng */
#countdown-lunar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
}

#countdown-hung,
#countdown-april30,
#countdown-vnnd,
#countdown-western {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

/* Theme-specific colors cho compact display */
.hung-kings-theme .compact-time-display {
    color: #caac05;
}

.hung-kings-theme .compact-time-labels {
    color: #efc407;
}

.liberation-theme .compact-time-display {
    color: #1e40af;
}

.liberation-theme .compact-time-labels {
    color: #2563eb;
}

.national-theme .compact-time-display {
    color: #c53030;
}

.national-theme .compact-time-labels {
    color: #e53e3e;
}

.new-year-theme .compact-time-display {
    color: #15803d;
}

.new-year-theme .compact-time-labels {
    color: #16a34a;
}

/* Responsive Design */
@media (max-width: 768px) {
    .countdown-container {
        padding: 0 1rem;
    }
    
    .small-countdowns-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .main-countdown-card {
        padding: 1.5rem;
        margin-bottom: 2rem;
    }

    .small-countdown-card {
        padding: 1rem;
        min-height: 150px;
    }

    .main-time-block {
        min-width: 80px;
        padding: 0.75rem;
    }

    .main-time-block .time-value {
        font-size: 2rem;
    }
    .compact-time-display {
        font-size: 2rem;
    }
    .compact-time-labels {
        font-size: 0.65rem;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .main-time-block .time-value {
        font-size: 2.5rem;
    }

    .compact-time-display {
        font-size: 2.25rem;
    }
}


/* THEMES */
/* Tet Theme */
.tet-theme {
    background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
    color: #c53030;
    border: 2px solid #fca5a5;
}

/* Hung Kings Theme */
.hung-kings-theme {
    background: linear-gradient(135deg, #fff5cc 0%, #ffdf7e 100%);
    color: #8c5a00;
}
/* Liberation Day Theme */
.liberation-theme {
    background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
    color: #1e3a8a;
}

/* National Day Theme */
.national-theme {
    background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
    color: #991b1b;
}

/* New Year Theme */
.new-year-theme {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
}


/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes modalEnter {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes rotateDrum {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
}
.animate-modalEnter {
    animation: modalEnter 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
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
            <div class="flex items-center justify-center mb-4">
                <i class="fas ${holiday.iconClass} festival-icon text-3xl mr-4"></i>
                <h2 class="text-4xl font-bold">${holiday.title}</h2>
            </div>
            ${holiday.note ? `<h3 class="text-xl mb-8 text-center">${holiday.note}</h3>` : ''}
            <div id="countdown-${holiday.idPrefix}" class="flex flex-wrap justify-center gap-6">
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
            <div id="countdown-${holiday.idPrefix}" class="flex align-items-center justify-center flex-1">
                <div class="compact-countdown">
                    <div class="compact-time-display">
                        <span id="${holiday.idPrefix}-month" class="time-number">0</span>
                        <span class="time-separator">:</span>
                        <span id="${holiday.idPrefix}-day" class="time-number">00</span>
                        <span class="time-separator">:</span>
                        <span id="${holiday.idPrefix}-hour" class="time-number">00</span>
                        <span class="time-separator">:</span>
                        <span id="${holiday.idPrefix}-minute" class="time-number">00</span>
                    </div>
                    <div class="compact-time-labels">
                        <span class="compact-label">Tháng</span>
                        <span class="compact-label">Ngày</span>
                        <span class="compact-label">Giờ</span>
                        <span class="compact-label">Phút</span>
                    </div>
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
    const { months, days, hours, minutes, seconds } = timeRemaining;

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
}


// Inject the styles into the DOM when the module is loaded
injectStyles();