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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: 200px;
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
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04);
    text-align: center;
    font-size: clamp(1.5rem, 8vw, 3rem);
    font-weight: 700;
    margin: 0 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.total-days-number {
    font-size: clamp(1.5rem, 8vw, 3rem);
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
    
    /* Auto-scaling for total days banner on mobile */
    .total-days-banner {
        font-size: clamp(1rem, 6vw, 2rem);
        padding: 0.75rem 1rem;
        max-width: 90%;
    }
    
    .total-days-number {
        font-size: clamp(1rem, 6vw, 2rem);
        margin: 0 0.25rem;
    }
    
    /* Main countdown mobile view scaling */
    .main-countdown-card .mobile-countdown .total-days-banner {
        font-size: clamp(1.25rem, 7vw, 2.5rem);
        padding: 1rem 1.25rem;
    }
    
    .main-countdown-card .mobile-countdown .total-days-number {
        font-size: clamp(1.25rem, 7vw, 2.5rem);
        margin: 0 0.4rem;
    }
}

/* Extra small screens */
@media (max-width: 480px) {
    .total-days-banner {
        font-size: clamp(0.875rem, 5vw, 1.5rem);
        padding: 0.5rem 0.75rem;
        max-width: 85%;
    }
    
    .total-days-number {
        font-size: clamp(0.875rem, 5vw, 1.5rem);
        margin: 0 0.2rem;
    }
    
    .main-countdown-card .mobile-countdown .total-days-banner {
        font-size: clamp(1rem, 6vw, 2rem);
        padding: 0.75rem 1rem;
    }
    
    .main-countdown-card .mobile-countdown .total-days-number {
        font-size: clamp(1rem, 6vw, 2rem);
        margin: 0 0.3rem;
    }
}

/* Styles for smaller countdown cards */
.small-countdown-card .countdown-grid,
.small-countdown-card .total-days-banner {
    transition: opacity 0.25s;
}
.small-countdown-card .countdown-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 cột ngang */
    gap: 0.5rem;
    padding: 0.5rem;
    align-items: center;
    justify-items: center;
    max-width: 340px;
    margin: 0 auto;
}
.small-countdown-card .total-days-banner {
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 8px #0001;
    padding: 1rem 1.5rem;
    min-width: 70px;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem; /* giống .time-value */
    font-weight: 700;
    color: inherit;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -50%);
    transition: opacity 0.25s;
    z-index: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
}
.small-countdown-card.show-total-days .countdown-grid {
    opacity: 0;
    pointer-events: none;
}
.small-countdown-card.show-total-days .total-days-banner {
    opacity: 1;
    pointer-events: auto;
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
.small-countdown-card .total-days-number {
    font-size: 1.75rem; /* giống .time-value */
    font-weight: 700;
    margin: 0 0.3rem;
}

/* Responsive scaling for small countdown cards */
@media (max-width: 768px) {
    .small-countdown-card .total-days-banner {
        font-size: clamp(1rem, 5vw, 1.5rem);
        padding: 0.75rem 1rem;
        max-width: 85%;
    }
    
    .small-countdown-card .total-days-number {
        font-size: clamp(1rem, 5vw, 1.5rem);
        margin: 0 0.2rem;
    }
}

@media (max-width: 480px) {
    .small-countdown-card .total-days-banner {
        font-size: clamp(0.875rem, 4vw, 1.25rem);
        padding: 0.5rem 0.75rem;
        max-width: 80%;
    }
    
    .small-countdown-card .total-days-number {
        font-size: clamp(0.875rem, 4vw, 1.25rem);
        margin: 0 0.15rem;
    }
}

.view-toggle-btn.small-toggle-btn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
    top: 0.75rem;
    right: 0.75rem;
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
            <button id="toggle-total-days-${holiday.idPrefix}" class="view-toggle-btn small-toggle-btn" aria-label="Xem tổng số ngày">
                <i class="fas fa-sync-alt"></i>
            </button>
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
            <div id="${holiday.idPrefix}-total-days-banner" class="total-days-banner">
                <span id="${holiday.idPrefix}-total-days-text"></span>
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

    // Thêm sự kiện toggle cho các small countdown
    holidays.forEach(holiday => {
        if (!holiday.main) {
            const btn = document.getElementById(`toggle-total-days-${holiday.idPrefix}`);
            const card = document.getElementById(`${holiday.idPrefix}Container`);
            if (btn && card) {
                btn.addEventListener('click', () => {
                    card.classList.toggle('show-total-days');
                });
            }
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

    // Update mobile view (main card)
    const totalDaysTextEl = document.getElementById(`${holiday.idPrefix}-total-days-text`);
    const totalDaysBanner = document.getElementById(`${holiday.idPrefix}-total-days-banner`);
    if (totalDaysTextEl && (holiday.main || (totalDaysBanner && totalDaysBanner.style.display !== 'none'))) {
        totalDaysTextEl.innerHTML = `Còn <strong class="total-days-number">${totalDays}</strong> ngày`;
    }
}

// Inject the styles into the DOM when the module is loaded
injectStyles(); 