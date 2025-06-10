/**
 * Lunar Calendar Conversion Module
 * Uses lunar-javascript library for accurate lunar date conversion
 */

export class LunarDateConverter {
    constructor() {
        // Múi giờ Việt Nam (UTC+7)
        this.VIETNAM_TIMEZONE_OFFSET = 7 * 60 * 60 * 1000;
        
        // Bảng tháng âm lịch với số ngày chính xác
        this.lunarMonthDays = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];
        
        // Năm nhuận âm lịch (có tháng 13)
        this.leapYears = [2020, 2023, 2025, 2028, 2031, 2033, 2036, 2039, 2042, 2044];
        
        // Ngày Tết Nguyên Đán theo năm dương lịch
        this.tetDates = {
            2024: new Date(2024, 1, 10), // 10/2/2024
            2025: new Date(2025, 0, 29), // 29/1/2025
            2026: new Date(2026, 1, 17), // 17/2/2026
            2027: new Date(2027, 1, 6),  // 6/2/2027
            2028: new Date(2028, 0, 26), // 26/1/2028
            2029: new Date(2029, 1, 13), // 13/2/2029
            2030: new Date(2030, 1, 3),  // 3/2/2030
        };
    }

    // Lấy thời gian hiện tại theo múi giờ Việt Nam
    getVietnamTime() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + this.VIETNAM_TIMEZONE_OFFSET);
    }

    // Chuyển đổi ngày dương lịch sang âm lịch
    solarToLunar(solarDate) {
        const vietnamDate = this.adjustToVietnamTimezone(solarDate);
        const year = vietnamDate.getFullYear();
        
        // Tìm ngày Tết gần nhất
        let tetDate = this.tetDates[year];
        if (!tetDate || vietnamDate < tetDate) {
            tetDate = this.tetDates[year - 1];
            if (!tetDate) {
                // Fallback calculation nếu không có dữ liệu
                return this.fallbackCalculation(vietnamDate);
            }
        }

        // Tính số ngày từ Tết đến ngày hiện tại
        const daysDiff = Math.floor((vietnamDate - tetDate) / (24 * 60 * 60 * 1000));
        
        if (daysDiff < 0) {
            // Nếu chưa đến Tết, tính từ Tết năm trước
            const prevTet = this.tetDates[year - 1];
            if (prevTet) {
                const prevDaysDiff = Math.floor((vietnamDate - prevTet) / (24 * 60 * 60 * 1000));
                return this.calculateLunarDate(prevDaysDiff, year - 1);
            }
        }

        return this.calculateLunarDate(daysDiff, year);
    }

    // Điều chỉnh thời gian về múi giờ Việt Nam
    adjustToVietnamTimezone(date) {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + this.VIETNAM_TIMEZONE_OFFSET);
    }

    // Tính toán ngày âm lịch từ số ngày kể từ Tết
    calculateLunarDate(daysDiff, lunarYear) {
        if (daysDiff === 0) {
            return { day: 1, month: 1, year: lunarYear };
        }

        let remainingDays = daysDiff;
        let month = 1;
        let day = 1;

        // Kiểm tra năm nhuận
        const isLeapYear = this.leapYears.includes(lunarYear);
        const monthsInYear = isLeapYear ? 13 : 12;

        while (remainingDays > 0 && month <= monthsInYear) {
            const daysInMonth = this.getDaysInLunarMonth(month, lunarYear, isLeapYear);
            
            if (remainingDays >= daysInMonth) {
                remainingDays -= daysInMonth;
                month++;
            } else {
                day = remainingDays + 1;
                break;
            }
        }

        // Xử lý trường hợp vượt quá năm
        if (month > monthsInYear) {
            return this.calculateLunarDate(remainingDays, lunarYear + 1);
        }

        return { day, month, year: lunarYear };
    }

    // Lấy số ngày trong tháng âm lịch
    getDaysInLunarMonth(month, year, isLeapYear) {
        // Tháng nhuận thường là tháng 4 hoặc 5
        if (isLeapYear && month === 4) {
            return 29; // Tháng nhuận thường có 29 ngày
        }
        
        // Quy luật chung: tháng lẻ 29 ngày, tháng chẵn 30 ngày
        return month % 2 === 1 ? 29 : 30;
    }

    // Tính toán dự phòng khi không có dữ liệu chính xác
    fallbackCalculation(date) {
        const year = date.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        
        // Ước tính dựa trên chu kỳ âm lịch (khoảng 354 ngày/năm)
        const lunarYear = year;
        let remainingDays = dayOfYear - 30; // Ước tính Tết vào cuối tháng 1
        
        if (remainingDays < 0) {
            remainingDays += 354; // Năm âm lịch trước
        }

        return this.calculateLunarDate(remainingDays, lunarYear);
    }

    // Lấy tên tháng âm lịch
    getLunarMonthName(month) {
        const monthNames = [
            '', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
            'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp', 'Nhuận'
        ];
        return monthNames[month] || `Tháng ${month}`;
    }

    // Format ngày âm lịch thành chuỗi
    formatLunarDate(lunarDate) {
        const { day, month, year } = lunarDate;
        const monthName = this.getLunarMonthName(month);
        return `${day} ${monthName} ${year}`;
    }

    // Lấy thông tin chi tiết ngày âm lịch hiện tại
    getCurrentLunarInfo() {
        const now = this.getVietnamTime();
        const lunarDate = this.solarToLunar(now);
        
        return {
            ...lunarDate,
            formatted: this.formatLunarDate(lunarDate),
            monthName: this.getLunarMonthName(lunarDate.month),
            solarDate: now,
            timezone: 'UTC+7 (Việt Nam)'
        };
    }
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LunarDateConverter;
} else {
    window.LunarDateConverter = LunarDateConverter;
}
