import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPalette } from '@fortawesome/free-solid-svg-icons';
interface HeaderProps {
    onThemeSwitch: () => void;
    currentThemeText: string;
}

const Header: React.FC<HeaderProps> = ({ onThemeSwitch, currentThemeText }) => {
    return (
        <header className="text-center mb-8 sm:mb-12 relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-700">
                    Countdown Nghỉ Lễ
                </h1>
                <button
                    onClick={onThemeSwitch}
                    className="theme-switch mt-2 sm:mt-0 bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-2"
                >
                    {/* <FontAwesomeIcon icon={faPalette} /> */}
                    <span>{currentThemeText}</span>
                </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Đếm ngược đến những ngày lễ đặc biệt của Việt Nam</p>
        </header>
    );
};

export default Header;