// Khởi tạo ứng dụng đếm ngược
class CountdownApp {
    constructor() {
        this.timeSync = new TimeSync();
        this.countdownUI = new CountdownUI();
        this.updateInterval = null;
        this.syncInterval = null;
        this.nextSyncTime = null;
    }

    // Khởi tạo ứng dụng
    async init() {
        try {
            console.log('Đang khởi tạo ứng dụng...');
            
            // Khởi tạo đồng bộ thời gian
            await this.timeSync.init();
            
            // Khởi tạo UI
            await this.countdownUI.init();
            
            // Bắt đầu cập nhật thời gian
            this.startTimeUpdates();
            
            // Tạo các card countdown
            this.createCountdownCards();
            
            // Bắt đầu cập nhật countdown
            this.startCountdownUpdates();
            
            console.log('Ứng dụng đã khởi tạo thành công!');
            
        } catch (error) {
            console.error('Lỗi khởi tạo ứng dụng:', error);
            this.showError('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }

    // Bắt đầu cập nhật thời gian
    startTimeUpdates() {
        // Cập nhật ngay lập tức
        this.updateTimeDisplay();
        
        // Cập nhật mỗi giây
        this.updateInterval = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);

        // Đặt lịch đồng bộ tiếp theo (5 phút)
        this.scheduleNextSync();
    }

    // Cập nhật hiển thị thời gian
    updateTimeDisplay() {
        const timeInfo = this.timeSync.getDetailedTimeInfo();
        
        // Cập nhật header
        this.updateHeaderTime(timeInfo);
        
        // Cập nhật phần chi tiết
        this.updateDetailedTime(timeInfo);
    }

    // Cập nhật thời gian trong header
    updateHeaderTime(timeInfo) {
        const { solar, lunar } = timeInfo;
        
        // Cập nhật thời gian hiện tại
        const currentTimeDisplay = document.getElementById('current-time-display');
        const currentDateDisplay = document.getElementById('current-date-display');
        const currentDayDisplay = document.getElementById('current-day-display');
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = solar.time;
        }
        
        if (currentDateDisplay) {
            currentDateDisplay.textContent = solar.formatted;
        }
        
        if (currentDayDisplay) {
            currentDayDisplay.textContent = solar.dayOfWeek;
        }

        // Cập nhật ngày âm lịch
        const lunarDateDisplay = document.getElementById('lunar-date-display');
        const lunarMonthDisplay = document.getElementById('lunar-month-display');
        const syncStatus = document.getElementById('sync-status');
        
        if (lunarDateDisplay) {
            lunarDateDisplay.textContent = `${lunar.day}/${lunar.month}/${lunar.year}`;
        }
        
        if (lunarMonthDisplay) {
            lunarMonthDisplay.textContent = lunar.monthName;
        }
        
        if (syncStatus) {
            const isSync = timeInfo.syncStatus === 'Đã đồng bộ';
            syncStatus.innerHTML = `
                <i class="fas fa-sync-alt ${isSync ? '' : 'animate-spin'}"></i>
                ${timeInfo.syncStatus}
            `;
        }
    }

    // Cập nhật thông tin thời gian chi tiết
    updateDetailedTime(timeInfo) {
        const { solar, lunar } = timeInfo;
        
        // Dương lịch chi tiết
        const detailedSolarDate = document.getElementById('detailed-solar-date');
        const detailedDayOfWeek = document.getElementById('detailed-day-of-week');
        const detailedTimezone = document.getElementById('detailed-timezone');
        
        if (detailedSolarDate) {
            detailedSolarDate.textContent = solar.formatted;
        }
        
        if (detailedDayOfWeek) {
            detailedDayOfWeek.textContent = solar.dayOfWeek;
        }
        
        if (detailedTimezone) {
            detailedTimezone.textContent = timeInfo.timezone;
        }

        // Âm lịch chi tiết
        const detailedLunarDate = document.getElementById('detailed-lunar-date');
        const detailedLunarMonth = document.getElementById('detailed-lunar-month');
        const detailedLunarYear = document.getElementById('detailed-lunar-year');
        
        if (detailedLunarDate) {
            detailedLunarDate.textContent = `${lunar.day}/${lunar.month}/${lunar.year}`;
        }
        
        if (detailedLunarMonth) {
            detailedLunarMonth.textContent = lunar.monthName;
        }
        
        if (detailedLunarYear) {
            detailedLunarYear.textContent = `Năm ${lunar.year}`;
        }

        // Trạng thái đồng bộ
        this.updateSyncStatus(timeInfo);
    }

    // Cập nhật trạng thái đồng bộ
    updateSyncStatus(timeInfo) {
        const syncStatusDetailed = document.getElementById('sync-status-detailed');
        const lastSyncTime = document.getElementById('last-sync-time');
        const nextSyncTime = document.getElementById('next-sync-time');
        
        const isSync = timeInfo.syncStatus === 'Đã đồng bộ';
        
        if (syncStatusDetailed) {
            const statusColor = isSync ? 'bg-green-400' : 'bg-yellow-400';
            const animation = isSync ? '' : 'animate-pulse';
            
            syncStatusDetailed.innerHTML = `
                <span class="inline-block w-3 h-3 ${statusColor} rounded-full mr-2 ${animation}"></span>
                ${timeInfo.syncStatus}
            `;
        }
        
        if (lastSyncTime && timeInfo.lastSync) {
            const lastSync = new Date(timeInfo.lastSync);
            lastSyncTime.textContent = `Lần cuối: ${lastSync.toLocaleTimeString('vi-VN')}`;
        }
        
        if (nextSyncTime && this.nextSyncTime) {
            const nextSync = new Date(this.nextSyncTime);
            nextSyncTime.textContent = `Đồng bộ tiếp theo: ${nextSync.toLocaleTimeString('vi-VN')}`;
        }
    }

    // Lên lịch đồng bộ tiếp theo
    scheduleNextSync() {
        this.nextSyncTime = Date.now() + (5 * 60 * 1000); // 5 phút sau
        
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        this.syncInterval = setInterval(async () => {
            await this.timeSync.syncTime();
            this.scheduleNextSync();
        }, 5 * 60 * 1000); // 5 phút
    }

    // Tạo các card countdown
    createCountdownCards() {
        const container = document.getElementById('countdown-container');
        if (!container) return;

        const upcomingHolidays = HolidaysConfig.getUpcomingHolidays(6);
        
        container.innerHTML = '';
        
        upcomingHolidays.forEach(holiday => {
            const card = this.createCountdownCard(holiday);
            container.appendChild(card);
        });
    }

    // Tạo một card countdown
    createCountdownCard(holiday) {
        const card = document.createElement('div');
        card.className = `countdown-card bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 ${holiday.theme || ''}`;
        card.dataset.targetDate = holiday.date.toISOString();
        
        card.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-3">${holiday.icon}</div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${holiday.name}</h3>
                <p class="text-gray-600 mb-4">${holiday.description}</p>
                
                <div class="grid grid-cols-4 gap-2 mb-4">
                    <div class="time-block days">
                        <div class="number text-2xl font-bold text-blue-600">00</div>
                        <div class="label text-sm text-gray-500">Ngày</div>
                    </div>
                    <div class="time-block hours">
                        <div class="number text-2xl font-bold text-green-600">00</div>
                        <div class="label text-sm text-gray-500">Giờ</div>
                    </div>
                    <div class="time-block minutes">
                        <div class="number text-2xl font-bold text-yellow-600">00</div>
                        <div class="label text-sm text-gray-500">Phút</div>
                    </div>
                    <div class="time-block seconds">
                        <div class="number text-2xl font-bold text-red-600">00</div>
                        <div class="label text-sm text-gray-500">Giây</div>
                    </div>
                </div>
                
                <div class="text-sm text-gray-500">
                    ${holiday.date.toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>
        `;
        
        return card;
    }

    // Bắt đầu cập nhật countdown
    startCountdownUpdates() {
        // Cập nhật ngay lập tức
        this.updateCountdowns();
        
        // Cập nhật mỗi giây
        setInterval(() => {
            this.updateCountdowns();
        }, 1000);
    }

    // Cập nhật tất cả countdown
    updateCountdowns() {
        const countdownCards = document.querySelectorAll('.countdown-card');
        
        countdownCards.forEach(card => {
            const targetDate = card.dataset.targetDate;
            if (!targetDate) return;

            const timeUntil = this.timeSync.getTimeUntil(new Date(targetDate));
            this.updateCountdownCard(card, timeUntil);
        });
    }

    // Cập nhật một card countdown
    updateCountdownCard(card, timeUntil) {
        const daysElement = card.querySelector('.days .number');
        const hoursElement = card.querySelector('.hours .number');
        const minutesElement = card.querySelector('.minutes .number');
        const secondsElement = card.querySelector('.seconds .number');

        if (timeUntil.expired) {
            card.classList.add('expired');
            if (daysElement) daysElement.textContent = '00';
            if (hoursElement) hoursElement.textContent = '00';
            if (minutesElement) minutesElement.textContent = '00';
            if (secondsElement) secondsElement.textContent = '00';
        } else {
            card.classList.remove('expired');
            if (daysElement) daysElement.textContent = timeUntil.days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = timeUntil.hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = timeUntil.minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = timeUntil.seconds.toString().padStart(2, '0');
        }
    }

    // Hiển thị lỗi
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Dọn dẹp khi không sử dụng
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        if (this.timeSync) {
            this.timeSync.destroy();
        }
        
        if (this.countdownUI) {
            this.countdownUI.destroy();
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', async () => {
    const app = new CountdownApp();
    await app.init();
    
    // Lưu instance để có thể truy cập từ console
    window.countdownApp = app;
});

// Xử lý khi trang bị đóng
window.addEventListener('beforeunload', () => {
    if (window.countdownApp) {
        window.countdownApp.destroy();
    }
});