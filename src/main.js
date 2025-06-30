import { HOLIDAYS_DATA as holidays } from '/data/holidays.js';
import { LunarDateConverter } from '/src/modules/LunarDateConverter.js';
import { initializePage } from '/src/Js/countdown-ui.js';
import { TimeSync } from '/src/Js/time-sync.js';
import { CountdownManager } from '/src/modules/CountdownManager.js';

class App {
    constructor() {
        this.holidays = holidays;
        this.timeSync = new TimeSync();
        this.countdownManager = new CountdownManager(this.timeSync);
        this.lunarConverter = new LunarDateConverter();
        
        // Expose holidays data for UI
        window.HOLIDAYS_DATA = this.holidays;
    }

    /**
     * Cập nhật phần hiển thị ngày giờ trên header.
     */
    _updateCurrentDateTime() {
        const now = this.timeSync.getCurrentTime();
        
        // Cập nhật ngày dương lịch
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const currentDateStr = now.toLocaleDateString('vi-VN', dateOptions);
        
        // Cập nhật giờ
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const currentTimeStr = now.toLocaleTimeString('vi-VN', timeOptions);
        
        // Cập nhật âm lịch
        const lunarDate = this.lunarConverter.getCurrentLunarInfo();
        const currentLunarStr = `${lunarDate.day}/${lunarDate.month}/${lunarDate.year}${lunarDate.isLeap ? ' (nhuận)' : ''}`;
        
        // Cập nhật DOM
        const currentDateEl = document.getElementById('currentDate');
        const currentTimeEl = document.getElementById('currentTime');
        const currentLunarEl = document.getElementById('currentLunarDate');

        if (currentDateEl) currentDateEl.textContent = currentDateStr;
        if (currentTimeEl) currentTimeEl.textContent = currentTimeStr;
        if (currentLunarEl) currentLunarEl.textContent = currentLunarStr;
    }

    /**
     * Gắn sự kiện cho các nút chuyển đổi chế độ xem.
     */
    _setupViewToggles() {
        this.holidays.forEach(holiday => {
            if (holiday.main) {
                const toggleBtn = document.getElementById(`toggle-view-${holiday.idPrefix}`);
                const container = document.getElementById(`${holiday.idPrefix}Container`);

                if (toggleBtn && container) {
                    toggleBtn.addEventListener('click', () => {
                        container.classList.toggle('view-total-days');
                    });
                }
            }
        });
    }

    /**
     * Tự động thay đổi chế độ xem dựa trên kích thước màn hình.
     */
    _handleResponsiveView() {
        this.holidays.forEach(holiday => {
            if (holiday.main) {
                const container = document.getElementById(`${holiday.idPrefix}Container`);
                if (container) {
                    if (window.innerWidth <= 768) {
                        container.classList.add('view-total-days');
                    } else {
                        container.classList.remove('view-total-days');
                    }
                }
            }
        });
    }

    /**
     * Cập nhật tất cả các thành phần động trên trang.
     */
    _updateAll() {
        this.countdownManager.updateAll(this.holidays);
        this._updateCurrentDateTime();
    }

    /**
     * Khởi chạy ứng dụng.
     */
    async start() {
        // Chờ đồng bộ thời gian lần đầu
        await this.timeSync.init();
        
        // "Vẽ" các thẻ đếm ngược
        initializePage(this.holidays); 
        
        // Gắn sự kiện cho các nút bấm
        this._setupViewToggles();

        // Xử lý chế độ xem ban đầu và khi thay đổi kích thước cửa sổ
        this._handleResponsiveView();
        window.addEventListener('resize', () => this._handleResponsiveView());

        // Cập nhật lần đầu và bắt đầu vòng lặp
        this._updateAll();
        setInterval(() => this._updateAll(), 1000);
    }
}

// Khởi tạo và chạy ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.start();
});