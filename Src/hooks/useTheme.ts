import { useState, useEffect, useCallback } from 'react';

type Theme = 'default' | 'simple';

const useTheme = (): [Theme, () => void, string] => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('appTheme') as Theme | null;
        // Đảm bảo rằng nếu giá trị lưu trữ không hợp lệ, nó sẽ mặc định là 'default'
        return (storedTheme === 'default' || storedTheme === 'simple') ? storedTheme : 'default';
    });

    useEffect(() => {
        if (theme === 'simple') {
            document.body.classList.add('simple-theme');
        } else {
            document.body.classList.remove('simple-theme');
        }
        localStorage.setItem('appTheme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'default' ? 'simple' : 'default'));
    }, []);

    const themeButtonText = theme === 'simple' ? 'Giao Diện Mặc Định' : 'Giao Diện Đơn Giản';

    return [theme, toggleTheme, themeButtonText];
};

export default useTheme;