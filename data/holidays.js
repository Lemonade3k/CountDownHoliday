// Holiday configuration data with pre-calculated solar dates
export const HOLIDAYS_DATA = [
    { 
        idPrefix: 'lunar', 
        title: 'Tết Nguyên Đán', 
        note: '(âm lịch)', 
        solarDates: {
            2026: '2026-02-17',
            2027: '2027-02-06',
            2028: '2028-01-27',
            2029: '2029-02-13',
            2030: '2030-02-03',
            2031: '2031-01-23',
            2032: '2032-02-11',
            2033: '2033-01-31',
            2034: '2034-02-19',
            2035: '2035-02-08',
            2036: '2036-01-28'
        },
        themeClass: 'tet-theme', 
        main: true, 
        showSeconds: true, 
        iconClass: 'fa-firework'
    },
    { 
        idPrefix: 'hung', 
        title: 'Giỗ Tổ Hùng Vương', 
        note: '(âm lịch)', 
        solarDates: {
            2026: '2026-04-26',
            2027: '2027-04-15',
            2028: '2028-04-04',
            2029: '2029-04-23',
            2030: '2030-04-12',
            2031: '2031-04-02',
            2032: '2032-04-20',
            2033: '2033-04-10',
            2034: '2034-04-28',
            2035: '2035-04-17',
            2036: '2036-04-05'
        },
        themeClass: 'hung-kings-theme',
        main: false,
        showSeconds: false,
        iconClass: 'fa-drum'
    },
    {
        idPrefix: 'liberation',
        title: 'Giải Phóng Miền Nam',
        note: '',
        solarDate: '04-30',
        themeClass: 'liberation-theme',
        main: false,
        showSeconds: false,
        iconClass: 'fa-dove'
    },
    {
        idPrefix: 'national',
        title: 'Quốc Khánh',
        note: '',
        solarDate: '09-02',
        themeClass: 'national-theme',
        main: false,
        showSeconds: false,
        iconClass: 'fa-flag'
    },
    {
        idPrefix: 'new-year',
        title: 'Tết Dương Lịch',
        note: '',
        solarDate: '01-01',
        themeClass: 'new-year-theme',
        main: false,
        showSeconds: false,
        iconClass: 'fa-champagne-glasses'
    },
];

