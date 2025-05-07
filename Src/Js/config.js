export let countdowns = [
    { idPrefix: 'lunar', title: 'Tết Nguyên Đán', note: '(âm lịch)', targetDate: '2025-01-29T00:00:00', showMinuteSecond: true, theme: 'tet-theme' },
    { idPrefix: 'hung', title: 'Giỗ Tổ Hùng Vương', note: '(âm lịch)', targetDate: '2025-04-07T00:00:00', showMinuteSecond: false, theme: 'hung-kings-theme' },
    { idPrefix: 'april30', title: 'Ngày 30 tháng 4', note: '', targetDate: '2025-04-30T00:00:00', showMinuteSecond: false, theme: 'liberation-theme' },
    { idPrefix: 'vnnd', title: 'Ngày Quốc khánh', note: '', targetDate: '2025-09-02T00:00:00', showMinuteSecond: false, theme: 'national-theme' },
    { idPrefix: 'midautumn', title: 'Tết Trung Thu', note: '(âm lịch)', targetDate: '2024-09-17T00:00:00', showMinuteSecond: false, theme: 'mid-autumn-theme' },
    { idPrefix: 'western', title: 'Tết Dương Lịch', note: '', targetDate: '2025-01-01T00:00:00', showMinuteSecond: false, theme: 'new-year-theme' },
];

export let customCounterId = 1000;

export function incrementCustomCounterId() {
    customCounterId++;
    return customCounterId -1;
}

export function addCountdownData(data) {
    countdowns.push(data);
}

export function findCountdown(idPrefix) {
    return countdowns.find(c => c.idPrefix === idPrefix);
}
