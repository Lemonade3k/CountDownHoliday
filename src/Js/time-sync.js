import { LunarDateConverter } from '/src/modules/LunarDateConverter.js';

class TimeSync {
    constructor() {
        this.vietnamTimezoneOffset = 7 * 60 * 60 * 1000; // UTC+7
        this.lastSyncTime = null;
        this.timeDrift = 0;
        this.syncInterval = null;
        this.lunarConverter = new LunarDateConverter();
    }

    // Khởi tạo đồng bộ thời gian
    async init() {
        await this.syncTime();
        // Đồng bộ lại mỗi 5 phút để đảm bảo độ chính xác
        this.syncInterval = setInterval(() => {
            this.syncTime();
        }, 5 * 60 * 1000);
    }

    // Đồng bộ thời gian với server hoặc sử dụng thời gian local
    async syncTime() {
        try {
            // Thử lấy thời gian từ API (nếu có)
            const serverTime = await this.getServerTime();
            if (serverTime) {
                this.timeDrift = serverTime.getTime() - Date.now();
                this.lastSyncTime = Date.now();
            }
        } catch (error) {
            console.warn('Không thể đồng bộ với server, sử dụng thời gian local:', error);
            this.timeDrift = 0;
            this.lastSyncTime = Date.now();
        }
    }

    // Lấy thời gian từ server (có thể thay thế bằng API thực tế)
    async getServerTime() {
        try {
            // Sử dụng WorldTimeAPI cho múi giờ Việt Nam
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh');
            if (response.ok) {
                const data = await response.json();
                return new Date(data.datetime);
            }
        } catch (error) {
            // Fallback: sử dụng thời gian local
            return null;
        }
        return null;
    }

    // Lấy thời gian hiện tại đã được đồng bộ
    getCurrentTime() {
        const now = new Date(Date.now() + this.timeDrift);
        return this.adjustToVietnamTimezone(now);
    }

    // Điều chỉnh thời gian về múi giờ Việt Nam
    adjustToVietnamTimezone(date) {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + this.vietnamTimezoneOffset);
    }

    // Lấy thông tin thời gian chi tiết
    getDetailedTimeInfo() {
        const currentTime = this.getCurrentTime();
        const lunarInfo = this.lunarConverter.getCurrentLunarInfo();
        
        return {
            solar: {
                date: currentTime,
                formatted: this.formatSolarDate(currentTime),
                day: currentTime.getDate(),
                month: currentTime.getMonth() + 1,
                year: currentTime.getFullYear(),
                dayOfWeek: this.getDayOfWeekName(currentTime.getDay()),
                time: this.formatTime(currentTime)
            },
            lunar: lunarInfo,
            timezone: 'UTC+7 (Việt Nam)',
            lastSync: this.lastSyncTime ? new Date(this.lastSyncTime) : null,
            syncStatus: this.lastSyncTime ? 'Đã đồng bộ' : 'Chưa đồng bộ'
        };
    }

    // Format ngày dương lịch
    formatSolarDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Format thời gian
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Lấy tên thứ trong tuần
    getDayOfWeekName(dayIndex) {
        const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        return days[dayIndex];
    }

    // Dọn dẹp khi không sử dụng
    destroy() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

// Export cho sử dụng
export { TimeSync };