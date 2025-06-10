// Holiday configuration data
const HOLIDAYS_DATA = [
    { 
        idPrefix: 'lunar', 
        title: 'Tết Nguyên Đán', 
        note: '(âm lịch)', 
        targetDate: '2025-01-29T00:00:00', 
        isLunar: true, 
        themeClass: 'tet-theme', 
        main: true, 
        showSeconds: true, 
        iconClass: 'fa-firework' 
    },
    { 
        idPrefix: 'hung', 
        title: 'Giỗ Tổ Hùng Vương', 
        note: '(âm lịch)', 
        targetDate: '2025-04-06T00:00:00', 
        isLunar: true, 
        themeClass: 'hung-kings-theme', 
        iconClass: 'fa-drum' 
    },
    { 
        idPrefix: 'april30', 
        title: 'Ngày 30 tháng 4', 
        note: 'Giải phóng miền Nam', 
        targetDate: '2025-04-30T00:00:00', 
        themeClass: 'liberation-theme', 
        iconClass: 'fa-dove' 
    },
    { 
        idPrefix: 'vnnd', 
        title: 'Ngày Quốc khánh', 
        note: 'Việt Nam', 
        targetDate: '2025-09-02T00:00:00', 
        themeClass: 'national-theme', 
        iconClass: 'fa-star' 
    },
    { 
        idPrefix: 'midautumn', 
        title: 'Tết Trung Thu', 
        note: '(âm lịch)', 
        targetDate: '2024-09-17T00:00:00', 
        isLunar: true, 
        themeClass: 'mid-autumn-theme', 
        iconClass: 'fa-moon' 
    },
    { 
        idPrefix: 'western', 
        title: 'Tết Dương Lịch', 
        note: 'Năm Mới!', 
        targetDate: '2025-01-01T00:00:00', 
        themeClass: 'new-year-theme', 
        iconClass: 'fa-glass-cheers' 
    }
];