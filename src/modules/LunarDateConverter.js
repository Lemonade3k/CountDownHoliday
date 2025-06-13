// Thuật toán chuyển đổi dương lịch sang âm lịch chính xác
function jdFromDate(dd, mm, yy) {
    let a = Math.floor((14 - mm) / 12);
    let y = yy - a;
    let m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
    return jd;
}

function newMoon(k) {
    let T = k / 1236.85;
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltaT = 0;
    if (T < -11) {
        deltaT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
        deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    let JdNew = Jd1 + C1 - deltaT;
    return JdNew;
}

function sunLongitude(jdn) {
    let T = (jdn - 2451545.0) / 36525;
    let T2 = T * T;
    let dr = Math.PI / 180;
    let M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L - 360 * (Math.floor(L / 360));
    return L;
}

function getSunLongitude(dayNumber, timeZone) {
    return Math.floor(sunLongitude(dayNumber - 0.5 - timeZone / 24) / 30);
}

function getNewMoonDay(k, timeZone) {
    return Math.floor(newMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy, timeZone) {
    let off = jdFromDate(31, 12, yy) - 2415021;
    let k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    let sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}

function getLeapMonthOffset(a11, timeZone) {
    let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
}

// Đổi tên hàm nội bộ để tránh trùng tên nếu muốn export cả class và hàm này riêng
function solarToLunarInternal(dd, mm, yy) {
    let timeZone = 7; // Múi giờ Việt Nam
    let dayNumber = jdFromDate(dd, mm, yy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }
    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        leap: lunarLeap
    };
}

export class LunarDateConverter {
    /**
     * Chuyển đổi ngày dương lịch (dd, mm, yy) sang thông tin ngày âm lịch.
     * @param {number} dd - Ngày (1-31).
     * @param {number} mm - Tháng (1-12).
     * @param {number} yy - Năm.
     * @returns {{day: number, month: number, year: number, isLeap: boolean}} Thông tin ngày âm lịch.
     */
    convertToLunar(dd, mm, yy) {
        const lunarResult = solarToLunarInternal(dd, mm, yy);
        return {
            day: lunarResult.day,
            month: lunarResult.month,
            year: lunarResult.year,
            isLeap: lunarResult.leap === 1 // Chuyển 0/1 thành boolean
        };
    }

    /**
     * Lấy thông tin ngày âm lịch hiện tại.
     * @returns {{day: number, month: number, year: number, isLeap: boolean}} Thông tin ngày âm lịch hiện tại.
     */
    getCurrentLunarInfo() {
        const now = new Date();
        const solarDay = now.getDate();
        const solarMonth = now.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const solarYear = now.getFullYear();
        return this.convertToLunar(solarDay, solarMonth, solarYear);
    }
}

// Xóa các hàm cũ không còn cần thiết khi dùng class: getCurrentDateTime, displayCurrentDate
// Xóa khối export cũ (module.exports / window.LunarCalendar)
// Xóa lệnh gọi displayCurrentDate() tự động