import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CountdownCard from './components/CountdownCard';
import Modal from './components/Modal';
import AddCountdownButton from './components/AddCountdownButton';
import { CountdownData, CustomCountdownFormData } from './types';
import useTheme from './hooks/useTheme';

// Dữ liệu countdown mẫu - bạn sẽ muốn lấy dữ liệu này từ API, localStorage hoặc file cấu hình
const initialMainCountdown: CountdownData = {
    id: 'main-lunar',
    title: 'Tết Nguyên Đán',
    note: '(âm lịch)',
    targetDate: '2025-01-29T00:00:00', // Example: Year of the Snake
        isLunar: true,
    themeClass: 'tet-theme', // Defined in App.css or global styles
    icon: 'fa-firework', // Example, ensure this icon name is valid if using FontAwesome
    color: 'red-600', // Tailwind color class
    textColor: 'text-red-700',
    textColorAccent: 'text-red-500',
    showSeconds: true,
        };

const initialSecondaryCountdowns: CountdownData[] = [
    {
        id: 'hungkings',
        title: 'Giỗ Tổ Hùng Vương',
        note: '(âm lịch)',
        targetDate: '2025-04-06T00:00:00', // Example: 10th day of 3rd lunar month 2025
        isLunar: true,
        themeClass: 'hung-kings-theme',
        icon: 'fa-drum',
        color: 'yellow-700',
        textColor: 'text-yellow-800',
        textColorAccent: 'text-yellow-600',
        showSeconds: false,
    },
    {
        id: 'april30',
        title: 'Ngày 30 tháng 4',
        note: 'Giải phóng miền Nam',
        targetDate: '2025-04-30T00:00:00',
        isLunar: false,
        themeClass: 'liberation-theme',
        icon: 'fa-dove',
        color: 'blue-500',
        textColor: 'text-blue-700',
        textColorAccent: 'text-blue-500',
        showSeconds: false,
    },
    // Add more initial countdowns as needed
];

function App() {
    // setMainCountdown is not used, so it can be omitted from destructuring if mainCountdown is static
    const [mainCountdown, /* setMainCountdown */] = useState<CountdownData>(initialMainCountdown);
    const [secondaryCountdowns, setSecondaryCountdowns] = useState<CountdownData[]>(initialSecondaryCountdowns);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [_currentTheme, toggleTheme, themeButtonText] = useTheme(); // _currentTheme to avoid unused var warning

    // useEffect for any side effects, e.g., loading countdowns from localStorage
    useEffect(() => {
        // console.log("Current theme:", _currentTheme);
        // Potentially load saved custom countdowns here
    }, [_currentTheme]);

    const handleAddCustomCountdown = (data: CustomCountdownFormData) => {
        const newCountdown: CountdownData = {
            id: `custom-${Date.now()}`,
            title: data.name,
            targetDate: `${data.date}T${data.time || '00:00:00'}`,
            isLunar: data.isLunar,
            note: data.isLunar ? '(âm lịch)' : (data.name.toLowerCase().includes("tết") ? '' : 'Sự kiện tùy chỉnh'),
            themeClass: 'custom-default-theme bg-gray-100 border-gray-300', // A generic theme
            icon: 'fa-calendar-plus',
            color: 'gray-500',
            textColor: 'text-gray-800',
            textColorAccent: 'text-gray-600',
            showSeconds: false, // Default for custom
        };
        setSecondaryCountdowns((prev: CountdownData[]) => [...prev, newCountdown]);
        setIsModalOpen(false);
    };

    return (
        // The body class is handled by the useTheme hook
        <div className={`p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 simple-theme:bg-gray-100`}>
            <Header onThemeSwitch={toggleTheme} currentThemeText={themeButtonText} />

            {mainCountdown && <CountdownCard countdown={mainCountdown} isMain={true} />}

            <section id="smallCountdowns" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto mt-8 sm:mt-12">
                {secondaryCountdowns.map((cd: CountdownData) => (
                    <CountdownCard key={cd.id} countdown={cd} />
                ))}
                <AddCountdownButton onClick={() => setIsModalOpen(true)} />
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCustomCountdown} />
        </div>
    );
}

export default App;