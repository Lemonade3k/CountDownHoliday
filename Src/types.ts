    export interface CountdownData {
        id: string;
    title: string; // Changed from 'name' for consistency
    note?: string;
    targetDate: string; // ISO string format e.g., "2025-01-29T00:00:00"
        isLunar?: boolean;
    themeClass: string; // For specific CSS styling
    icon?: string; // e.g., Font Awesome icon name or class from free-solid-svg-icons
    color: string; // e.g., Tailwind color class like 'red-600'
    textColor: string; // Added this property
    textColorAccent: string; // Added this property
        showSeconds?: boolean;
    }

export interface CustomCountdownFormData { // Ensure this is EXPORTED
    name: string; // This will map to CountdownData.title
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
        isLunar: boolean;
    }