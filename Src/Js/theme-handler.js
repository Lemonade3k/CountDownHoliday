import { bodyElement as getBody, themeSwitchBtn as getThemeSwitchBtn } from './dom-utils.js';

let _isSimpleTheme = false; // Internal state

export function isSimpleTheme() {
    return _isSimpleTheme;
}

export function toggleTheme() {
    const body = getBody();
    const themeButton = getThemeSwitchBtn();
    const themeText = themeButton ? themeButton.querySelector('.theme-text') : null;

    _isSimpleTheme = !_isSimpleTheme;

    if (_isSimpleTheme) {
        body.classList.add('simple-theme');
        if (themeText) themeText.textContent = 'Giao Diện Đầy Đủ';

        const scrollPos = window.pageYOffset;
        document.querySelectorAll('.countdown-card').forEach(card => {
            card.style.transform = 'none';
            card.style.animation = 'none';
        });
        window.scrollTo(0, scrollPos);
    } else {
        body.classList.remove('simple-theme');
        if (themeText) themeText.textContent = 'Giao Diện Đơn Giản';
        // Reinitialize decorative elements if any (e.g., addRotatingDrum())
        // For now, this is empty as addRotatingDrum was commented out.
    }
    localStorage.setItem('simpleTheme', _isSimpleTheme);
}

export function initTheme() {
    const savedTheme = localStorage.getItem('simpleTheme');
    if (savedTheme === 'true') {
        // Call toggleTheme to set the state and apply styles correctly
        // but prevent it from flipping the state if it's already correct.
        if (!_isSimpleTheme) { // Only toggle if current state is not simple
             toggleTheme();
        }
    }
    const themeButton = getThemeSwitchBtn();
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}
