export interface TimeLeft {
    months?: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export interface CountdownData {
    id: string;
    name: string;
    date: string; // ISO string or specific format
    time?: string; // HH:mm
    isLunar: boolean;
    themeClass: string; // e.g., 'tet-theme', 'hung-kings-theme'
    iconClass: string; // Font Awesome icon class string e.g. 'fa-solid fa-lantern-o'
    textColorBase: string; // e.g., 'text-red-600'
    textColorAccent: string; // e.g., 'text-red-400'
    note?: string;
}