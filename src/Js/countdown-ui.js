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