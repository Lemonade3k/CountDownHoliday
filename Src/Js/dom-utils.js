export const getElement = (id) => document.getElementById(id);
export const hideElement = (el) => el ? el.style.display = 'none' : null;
export const showElement = (el, displayType = 'block') => el ? el.style.display = displayType : null;
export const showFlex = (el) => showElement(el, 'flex');

// Main DOM Elements (cached for performance if frequently accessed)
export const modalOverlay = () => getElement('modalOverlay');
export const addBtn = () => getElement('addCountdown');
export const modalForm = () => getElement('customCountdownForm');
export const cancelBtn = () => getElement('cancelBtn');
export const smallCountdownsContainer = () => getElement('smallCountdowns');
export const themeSwitchBtn = () => getElement('themeSwitch');
export const bodyElement = () => document.body;
