import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CountdownCard from './components/CountdownCard';
import Modal from './components/Modal';
import AddCountdownButton from './components/AddCountdownButton';
import { CountdownData } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useTheme from './hooks/useTheme'; // Thêm import
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Dữ liệu countdown mẫu - bạn sẽ muốn lấy dữ liệu này từ API, localStorage hoặc file cấu hình
const initialMainCountdown: CountdownData = {
    id: 'tet',
    name: 'Tết Nguyên Đán',
    date: '2025-01-29', // Cần cập nhật ngày Tết hàng năm, hoặc có logic tính toán
    isLunar: true, // Sẽ cần logic chuyển đổi ngày Âm Lịch
    themeClass: 'tet-theme',
    iconClass: 'fas fa-lantern', // Sử dụng class string của FontAwesome
    textColorBase: 'text-red-600',
    textColorAccent: 'text-red-400',
    note: '(âm lịch)',
};

const initialSecondaryCountdowns: CountdownData[] = [
    {
        id: 'hungkings',
        name: 'Giỗ Tổ Hùng Vương',
        date: '2025-04-08', // Mùng 10 tháng 3 Âm lịch (ví dụ, cần logic tính)
        isLunar: true,
        themeClass: 'hung-kings-theme',
        iconClass: 'fas fa-drum',
        textColorBase: 'text-yellow-700',
        textColorAccent: 'text-yellow-500',
        note: '(mùng 10/3 âm lịch)',
    },
    // Thêm các ngày lễ khác ở đây
];

function App() {
    const [mainCountdown, setMainCountdown] = useState<CountdownData>(initialMainCountdown);
    const [secondaryCountdowns, setSecondaryCountdowns] = useState<CountdownData[]>(initialSecondaryCountdowns);
    const [isModalOpen, setIsModalOpen] = useState(false);    
    const [theme, toggleTheme, themeButtonText] = useTheme();


    // TODO: Implement adding custom countdown
    const handleAddCustomCountdown = (data: { name: string; date: string; time: string; isLunar: boolean; color: string }) => {
        const newCountdown: CountdownData = {
            id: new Date().toISOString(), // Unique ID
            name: data.name,
            date: data.date,
            time: data.time,
            isLunar: data.isLunar,
            themeClass: `custom-theme border-2 rounded-xl shadow-lg p-6`, // Basic theme for custom
            iconClass: 'fas fa-star', // Default icon
            textColorBase: `text-[${data.color}]`, // Sử dụng màu người dùng chọn
            textColorAccent: `text-[${data.color}] opacity-75`,
        };
        setSecondaryCountdowns(prev => [...prev, newCountdown]);
        setIsModalOpen(false);
        // TODO: Save to localStorage
    };

    // TODO: Load custom countdowns from localStorage on mount
    useEffect(() => {
        // const savedCustomCountdowns = localStorage.getItem('customCountdowns');
        // if (savedCustomCountdowns) {
        // setSecondaryCountdowns(prev => [...prev, ...JSON.parse(savedCustomCountdowns)]);
        // }
    }, []);

    return (
        <div className={`p-6 min-h-screen`}> {/* Bỏ 'simple-theme-bg' vì body đã được xử lý bởi useTheme */}
            <Header onThemeSwitch={toggleTheme} currentThemeText={themeButtonText} />

            <CountdownCard countdown={mainCountdown} isMain={true} />

            <section id="smallCountdowns" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
                {secondaryCountdowns.map(cd => (
                    <CountdownCard key={cd.id} countdown={cd} />
                ))}
+                <AddCountdownButton onClick={() => setIsModalOpen(true)} />
            </section>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCustomCountdown} />
        </div>
    );
}

export default App;