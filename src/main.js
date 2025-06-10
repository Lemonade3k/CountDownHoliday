import { CountdownManager } from './modules/CountdownManager.js';
import { ModalManager } from './modules/ModalManager.js';
import { TimeSync } from './modules/TimeSync.js';
import { defaultHolidays } from './config/holidays.js';

class App {
    constructor() {
        this.timeSync = new TimeSync();
        this.countdownManager = new CountdownManager(this.timeSync);
        this.modalManager = new ModalManager();
        
        this.init();
    }

    async init() {
        try {
            // Khởi tạo đồng bộ thời gian
            await this.timeSync.initialize();
            
            // Khởi tạo các bộ đếm ngược
            this.countdownManager.initializeCountdowns(defaultHolidays);
            
            // Bắt đầu các bộ đếm ngược
            this.countdownManager.startAllCountdowns();
            
            // Khởi tạo modal
            this.modalManager.initialize();
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new App();
});