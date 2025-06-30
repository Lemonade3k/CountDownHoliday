import { updateCountdownUI } from '/src/Js/countdown-ui.js';

export class CountdownManager {
    constructor(timeSync) {
        this.timeSync = timeSync;
    }

    _calculateTimeRemaining(targetDate) {
        const now = this.timeSync.getCurrentTime();
        const target = new Date(targetDate + 'T00:00:00');
        
        // Nếu đã qua ngày đích, tính cho năm sau
        if (target <= now) {
            const nextYear = target.getFullYear() + 1;
            const holiday = this._findHolidayByDate(targetDate);
            if (holiday) {
                // Xử lý ngày cố định
                if (holiday.solarDate) {
                    return this._calculateTimeRemaining(`${nextYear}-${holiday.solarDate}`);
                }
                // Xử lý ngày âm lịch (đã tính sẵn)
                else if (holiday.solarDates && holiday.solarDates[nextYear]) {
                    return this._calculateTimeRemaining(holiday.solarDates[nextYear]);
                }
            }
        }
        
        const diff = target - now;
        
        // Tính tổng số ngày
        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        // Tính số tháng và ngày còn lại
        let months = 0;
        let days = totalDays;
        
        // Tính số tháng (giả định mỗi tháng có 30 ngày)
        if (totalDays >= 30) {
            months = Math.floor(totalDays / 30);
            days = totalDays % 30;
        }
        
        // Tính giờ, phút, giây
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return { 
            months, 
            days, 
            hours, 
            minutes, 
            seconds, 
            totalDays,
            targetDate: target.toISOString() // Trả về ngày đích đã được cập nhật (nếu có)
        };
    }

    _findHolidayByDate(targetDate) {
        return window.HOLIDAYS_DATA.find(holiday => {
            if (holiday.solarDate) {
                // Kiểm tra ngày cố định
                const [month, day] = holiday.solarDate.split('-');
                const year = targetDate.split('-')[0];
                return targetDate === `${year}-${month}-${day}`;
            } else {
                // Kiểm tra ngày âm lịch đã tính sẵn
                return Object.values(holiday.solarDates).includes(targetDate);
            }
        });
    }

    _getInitialTargetDate(holiday) {
        const currentYear = new Date().getFullYear();
        const now = this.timeSync.getCurrentTime();
        
        if (holiday.solarDate) {
            // Xử lý ngày cố định
            const targetDate = `${currentYear}-${holiday.solarDate}`;
            if (new Date(targetDate + 'T00:00:00') > now) {
                return targetDate;
            }
            return `${currentYear + 1}-${holiday.solarDate}`;
        } else {
            // Xử lý ngày âm lịch đã tính sẵn
            // Tìm ngày gần nhất trong tương lai
            for (let year = currentYear; year <= currentYear + 10; year++) {
                const date = holiday.solarDates[year];
                if (date && new Date(date + 'T00:00:00') > now) {
                    return date;
                }
            }
            
            // Nếu không tìm thấy, trả về ngày cuối cùng có sẵn
            const lastYear = Math.max(...Object.keys(holiday.solarDates).map(Number));
            return holiday.solarDates[lastYear];
        }
    }

    updateAll(holidays) {
        holidays.forEach(holiday => {
            const targetDate = holiday.targetDate || this._getInitialTargetDate(holiday);
            const timeRemaining = this._calculateTimeRemaining(targetDate);
            
            // Cập nhật lại targetDate nếu đã được thay đổi
            if (timeRemaining.targetDate) {
                holiday.targetDate = timeRemaining.targetDate;
            }
            
            updateCountdownUI(holiday, timeRemaining);
        });
    }
}
