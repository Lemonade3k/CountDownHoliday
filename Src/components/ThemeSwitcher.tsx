import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

interface ThemeSwitcherProps {
    onThemeSwitch: () => void;
    themeButtonText: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeSwitch, themeButtonText }) => {
    return (
        <button
            className="theme-switch" // Class này đã có style trong index.css
            onClick={onThemeSwitch}
            title={themeButtonText}
        >
            <FontAwesomeIcon icon={faPalette} />
            <span className="theme-text ml-2">{themeButtonText}</span>
        </button>
    );
};

export default ThemeSwitcher;