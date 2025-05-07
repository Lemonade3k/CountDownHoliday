document.addEventListener('DOMContentLoaded', () => {
    dayjs.extend(dayjs_plugin_duration);
    dayjs.extend(dayjs_plugin_relativeTime);

    // Dữ liệu ngày lễ mặc định
    const defaultHolidays = [
        {
            id: 'tet',
            name: 'Tết Nguyên Đán',
            date: '2025-01-29', // Ngày dương lịch của mùng 1 Tết Giáp Thìn 2025
            time: '00:00',
            isLunar: true,
            theme: 'tet-theme',
            icon: 'fas fa-candy-cane',
            note: '(âm lịch)',
            color: '#ef4444' // Tailwind red-500
        },
        {
            id: 'hungKings',
            name: 'Giỗ Tổ Hùng Vương',
            date: '2025-04-08', // Ngày dương lịch của 10/3 âm lịch năm 2025
            time: '00:00',
            isLunar: true,
            theme: 'hung-kings-theme',
            icon: 'fas fa-drum',
            note: '(10/3 âm lịch)',
            color: '#d4a017' // Custom color
        },
        {
            id: 'liberationDay',
            name: 'Ngày Giải Phóng',
            date: '2025-04-30',
            time: '00:00',
            isLunar: false,
            theme: 'liberation-theme',
            icon: 'fas fa-flag',
            note: '30/4',
            color: '#e53935' // Custom color
        },
        {
            id: 'nationalDay',
            name: 'Quốc Khánh',
            date: '2025-09-02',
            time: '00:00',
            isLunar: false,
            theme: 'national-theme',
            icon: 'fas fa-star',
            note: '2/9',
            color: '#e53935' // Custom color
        }
    ];

    let countdowns = getCountdownsFromStorage() || [...defaultHolidays];

    const mainCountdownSection = document.getElementById('mainCountdown');
    const smallCountdownsContainer = document.getElementById('smallCountdowns');
    const addCountdownButton = document.getElementById('addCountdown');
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = modalOverlay.querySelector('.modal');
    const customCountdownForm = document.getElementById('customCountdownForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const themeSwitchBtn = document.getElementById('themeSwitch');

    function saveCountdownsToStorage() {
        localStorage.setItem('countdownAppHolidays', JSON.stringify(countdowns));
    }

    function getCountdownsFromStorage() {
        const stored = localStorage.getItem('countdownAppHolidays');
        return stored ? JSON.parse(stored) : null;
    }

    function updateCountdownDisplay(element, targetDate, holidayName, isMain = false) {
        const now = dayjs();
        const diff = targetDate.diff(now);

        if (diff <= 0) {
            if (isMain) {
                element.innerHTML = `<div class="text-center py-8"><h2 class="text-3xl font-bold text-green-500">${holidayName} đã đến!</h2></div>`;
            } else {
                element.querySelector('.grid').innerHTML = `<p class="col-span-full text-center font-semibold text-green-500">${holidayName} đã đến!</p>`;
            }
            return;
        }

        const duration = dayjs.duration(diff);
        
        const days = Math.floor(duration.asDays()); // Tổng số ngày
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (isMain) {
            // Bộ đếm chính có cấu trúc khác (tháng, ngày, giờ, phút, giây)
            // Hiện tại, Day.js duration không dễ dàng tách tháng riêng biệt khi tổng số ngày lớn.
            // Chúng ta sẽ hiển thị tổng số ngày cho đơn giản.
            // Nếu muốn hiển thị tháng, cần logic phức tạp hơn để tính toán (ví dụ: còn X tháng Y ngày)
            // document.getElementById('lunar-month').textContent = String(duration.months()).padStart(2, '0'); // Tạm thời không dùng months() vì nó không như mong đợi
            document.getElementById('lunar-month').textContent = "N/A"; // Hoặc ẩn field tháng đi
            document.getElementById('lunar-day').textContent = String(days).padStart(2, '0');
            document.getElementById('lunar-hour').textContent = String(hours).padStart(2, '0');
            document.getElementById('lunar-minute').textContent = String(minutes).padStart(2, '0');
            document.getElementById('lunar-second').textContent = String(seconds).padStart(2, '0');
        } else {
            element.querySelector('.days').textContent = String(days).padStart(2, '0');
            element.querySelector('.hours').textContent = String(hours).padStart(2, '0');
            element.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
            element.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
        }
    }

    function renderMainCountdown() {
        const tetHoliday = countdowns.find(h => h.id === 'tet');
        if (!tetHoliday || !mainCountdownSection) return;

        document.getElementById('main-title').textContent = tetHoliday.name;
        document.getElementById('main-note').textContent = tetHoliday.note || '';
        mainCountdownSection.className = `countdown-card rounded-2xl p-8 mb-12 max-w-6xl mx-auto shadow-lg relative ${tetHoliday.theme}`;
        if (document.body.classList.contains('simple-theme')) {
            mainCountdownSection.classList.add('simple-theme-card-styles'); // Add specific simple theme styles if needed
        }

        const target = dayjs(`${tetHoliday.date}T${tetHoliday.time}`);
        updateCountdownDisplay(mainCountdownSection, target, tetHoliday.name, true);
        setInterval(() => updateCountdownDisplay(mainCountdownSection, target, tetHoliday.name, true), 1000);
    }

    function createCountdownCardHTML(holiday) {
        const cardId = `countdown-${holiday.id || Date.now()}`;
        const titleColor = holiday.color ? `style="color: ${holiday.color}"` : 'text-indigo-600';
        const labelColor = holiday.color ? `style="color: ${holiday.color}; opacity: 0.75;"` : 'text-indigo-400';
        let themeClass = holiday.theme || '';
        if (document.body.classList.contains('simple-theme')) {
            themeClass = ''; // Override theme for simple mode
        }

        return `
            <div id="${cardId}" data-holiday-id="${holiday.id}" class="countdown-card ${themeClass} rounded-2xl p-6 shadow-md relative hover-scale">
                ${themeClass === 'hung-kings-theme' ? '<div class="drum-container"><div class="rotating-drum"></div></div>' : ''}
                ${themeClass === 'tet-theme' || themeClass === 'new-year-theme' ? '<div class="fireworks-container"></div>' : ''}

                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        ${holiday.icon ? `<i class="${holiday.icon} mr-2" ${titleColor}></i>` : ''}
                        <h3 class="text-xl font-semibold" ${titleColor}>${holiday.name}</h3>
                    </div>
                    <button class="delete-countdown text-gray-400 hover:text-red-500" data-id="${holiday.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${holiday.note ? `<p class="text-xs mb-4" ${labelColor}>${holiday.note}</p>` : ''}
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div class="time-block p-2">
                        <span class="days text-3xl font-bold block time-value" ${titleColor}>00</span>
                        <span class="text-xs time-label" ${labelColor}>Ngày</span>
                    </div>
                    <div class="time-block p-2">
                        <span class="hours text-3xl font-bold block time-value" ${titleColor}>00</span>
                        <span class="text-xs time-label" ${labelColor}>Giờ</span>
                    </div>
                    <div class="time-block p-2">
                        <span class="minutes text-3xl font-bold block time-value" ${titleColor}>00</span>
                        <span class="text-xs time-label" ${labelColor}>Phút</span>
                    </div>
                    <div class="time-block p-2">
                        <span class="seconds text-3xl font-bold block time-value" ${titleColor}>00</span>
                        <span class="text-xs time-label" ${labelColor}>Giây</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSmallCountdowns() {
        if (!smallCountdownsContainer) return;
        // Clear existing small countdowns before re-rendering
        Array.from(smallCountdownsContainer.children).forEach(child => {
            if (child.id !== 'addCountdown') {
                child.remove();
            }
        });

        const smallHolidays = countdowns.filter(h => h.id !== 'tet');
        smallHolidays.forEach(holiday => {
            const cardHTML = createCountdownCardHTML(holiday);
            addCountdownButton.insertAdjacentHTML('beforebegin', cardHTML);
            
            const cardElement = document.getElementById(`countdown-${holiday.id}`);
            if (cardElement) {
                const target = dayjs(`${holiday.date}T${holiday.time}`);
                updateCountdownDisplay(cardElement, target, holiday.name, false); // Initial display
                // Set interval for each small countdown
                // To avoid too many intervals, this could be optimized by a single global interval
                // that updates all small countdowns. For now, this is simpler.
                setInterval(() => updateCountdownDisplay(cardElement, target, holiday.name, false), 1000);
            }
        });
        addDeleteListeners();
    }

    function openModal() {
        modalOverlay.classList.remove('hidden');
        setTimeout(() => modal.classList.add('active'), 10);
        customCountdownForm.reset();
        document.getElementById('customColor').value = '#4f46e5'; // Reset color picker
    }

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
    }

    if (addCountdownButton) addCountdownButton.addEventListener('click', openModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    if (customCountdownForm) {
        customCountdownForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('customName').value;
            const date = document.getElementById('customDate').value;
            const time = document.getElementById('customTime').value || '00:00';
            const isLunar = document.getElementById('customLunar').checked;
            const color = document.getElementById('customColor').value;

            if (!name || !date) {
                alert('Vui lòng nhập tên và ngày cho bộ đếm.');
                return;
            }

            const newCountdown = {
                id: `custom-${Date.now()}`,
                name,
                date,
                time,
                isLunar,
                color,
                theme: isLunar ? 'mid-autumn-theme' : 'new-year-theme', // Example default themes
                icon: 'fas fa-calendar-alt',
                note: isLunar ? '(âm lịch)' : ''
            };

            countdowns.push(newCountdown);
            saveCountdownsToStorage();
            renderSmallCountdowns(); // Re-render to include the new one
            closeModal();
        });
    }

    function addDeleteListeners() {
        document.querySelectorAll('.delete-countdown').forEach(button => {
            // Remove old listener before adding new one to prevent multiple fires
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
                const idToDelete = e.currentTarget.dataset.id;
                countdowns = countdowns.filter(cd => cd.id !== idToDelete);
                saveCountdownsToStorage();
                document.getElementById(`countdown-${idToDelete}`)?.remove(); // Remove from DOM
                // No need to call renderSmallCountdowns() again if just removing one
            });
        });
    }

    // Theme Switcher
    let isSimpleTheme = localStorage.getItem('countdownAppThemeSimple') === 'true';
    const themeTextSpan = themeSwitchBtn ? themeSwitchBtn.querySelector('.theme-text') : null;

    function applyBodyTheme() {
        if (isSimpleTheme) {
            document.body.classList.add('simple-theme');
            if (themeTextSpan) themeTextSpan.textContent = 'Giao Diện Đầy Đủ';
        } else {
            document.body.classList.remove('simple-theme');
            if (themeTextSpan) themeTextSpan.textContent = 'Giao Diện Đơn Giản';
        }
        // Re-render all countdowns to apply/remove theme classes on cards
        // This is a bit heavy, could be optimized by toggling classes directly on cards
        renderMainCountdown(); // Re-render main to apply theme changes
        renderSmallCountdowns(); // Re-render small to apply theme changes
    }

    if (themeSwitchBtn) {
        themeSwitchBtn.addEventListener('click', () => {
            isSimpleTheme = !isSimpleTheme;
            localStorage.setItem('countdownAppThemeSimple', isSimpleTheme);
            applyBodyTheme();
        });
    }

    // Initial setup
    function init() {
        applyBodyTheme(); // Apply stored theme preference on load
        // renderMainCountdown(); // Called by applyBodyTheme
        // renderSmallCountdowns(); // Called by applyBodyTheme

        // Consolidate intervals for small countdowns (optional optimization)
        // For now, individual intervals are set in renderSmallCountdowns
    }

    init();
});

// Polyfill for Element.remove() for older browsers if needed
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// Note on Lunar Calendar:
// Accurate Lunar to Solar conversion and countdown for specific Lunar dates (like Tet)
// requires a robust library or a more complex algorithm than simple date difference.
// The current `isLunar` flag is mostly for display purposes (e.g., adding "(âm lịch)").
// For Tet, the `date` field in `defaultHolidays` should be the Gregorian date of Mùng 1 Tết.

// Note on `duration.months()` from Day.js:
// `duration.months()` gives the month component of the duration (0-11).
// `duration.asMonths()` gives the total duration in months, possibly fractional.
// For "X months, Y days" display, custom calculation is needed.
// The main countdown currently shows "N/A" for months for simplicity.


// CSS for simple theme cards (add this to your <style> block in HTML or a CSS file)
/*
.simple-theme .countdown-card {
    background: #f7fafc !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
}
.simple-theme .countdown-card::before,
.simple-theme .countdown-card .rotating-drum,
.simple-theme .countdown-card .fireworks-container {
    display: none !important;
}
.simple-theme .countdown-card h3 { color: #2d3748 !important; }
.simple-theme .countdown-card h3 + p { color: #4a5568 !important; }
.simple-theme .countdown-card .time-block { background: transparent !important; border: none !important; }
.simple-theme .countdown-card .time-value { color: #2d3748 !important; }
.simple-theme .countdown-card .time-label { color: #4a5568 !important; }
.simple-theme .countdown-card .festival-icon { color: #2d3748 !important; }
*/