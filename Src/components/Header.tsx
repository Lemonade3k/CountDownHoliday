import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    onThemeSwitch: () => void; // Placeholder for theme switch logic
    currentThemeText: string; // e.g., "Đổi Giao Diện Sáng" or "Đổi Giao Diện Tối"
}

const Header: React.FC<HeaderProps> = ({ onThemeSwitch, currentThemeText }) => {
    return (
        <header className="text-center mb-12 relative">
            <div className="flex items-center justify-center gap-4">
                <h1 className="text-5xl font-bold mb-4 text-indigo-600">
                    Countdown Nghỉ Lễ
                </h1>
                <ThemeSwitcher onThemeSwitch={onThemeSwitch} themeButtonText={currentThemeText} />
            </div>
            <p className="text-gray-600">Đếm ngược đến những ngày lễ đặc biệt của Việt Nam</p>
        </header>
    );
};

export default Header;