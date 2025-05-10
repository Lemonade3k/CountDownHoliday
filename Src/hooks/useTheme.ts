import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'simple'; // Example themes
const useTheme = (): [Theme, () => void, string] => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('countdownAppTheme') as Theme | null;
        return storedTheme || 'light'; // Default theme
    });
    const [themeButtonText, setThemeButtonText] = useState<string>('Đổi Giao Diện');

    const applyThemeToBody = useCallback((selectedTheme: Theme) => {
        document.body.classList.remove('light-theme', 'dark-theme', 'simple-theme'); // Remove all theme classes
        if (selectedTheme === 'simple') {
            document.body.classList.add('simple-theme'); // Assumes 'simple-theme' class exists in CSS
            setThemeButtonText('Giao Diện Đầy Đủ');
        } else if (selectedTheme === 'dark') {
            document.body.classList.add('dark-theme'); // Assumes 'dark-theme' class exists
            setThemeButtonText('Giao Diện Sáng');
        }
         else { // light theme
            document.body.classList.add('light-theme');
            setThemeButtonText('Giao Diện Đơn Giản');
        }
    }, []);

    useEffect(() => {
        applyThemeToBody(theme);
    }, [theme, applyThemeToBody]);
    const toggleTheme = () => {
        setTheme(prevTheme => {
            let nextTheme: Theme;
            if (prevTheme === 'light') nextTheme = 'simple';
            else if (prevTheme === 'simple') nextTheme = 'dark'; // Example cycle: light -> simple -> dark -> light
            else nextTheme = 'light';
            
            localStorage.setItem('countdownAppTheme', nextTheme);
            return nextTheme;
        });
    };

    // Update button text based on current theme (could be more sophisticated)
    useEffect(() => {
        if (theme === 'simple') setThemeButtonText('Giao Diện Đầy Đủ');
        else if (theme === 'dark') setThemeButtonText('Giao Diện Sáng');
        else setThemeButtonText('Giao Diện Đơn Giản');
    }, [theme]);

    return [theme, toggleTheme, themeButtonText];
};

export default useTheme;