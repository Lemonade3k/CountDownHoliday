import { updateCountdownUI } from '/src/Js/countdown-ui.js';

export class CountdownManager {
    constructor(timeSync) {
        this.timeSync = timeSync;
    }

    _calculateTimeRemaining(targetDate) {
        const now = this.timeSync.getCurrentTime();
        const target = new Date(targetDate);
        
        if (target <= now) {
            target.setFullYear(target.getFullYear() + 1);
        }
        
        const diff = target - now;
        
        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        
        let tempNow = new Date(now);
        let tempTarget = new Date(target);
        
        let months = 0;
        while (
            new Date(tempNow.getFullYear(), tempNow.getMonth() + 1, tempNow.getDate()) <= tempTarget
        ) {
            months++;
            tempNow.setMonth(tempNow.getMonth() + 1);
        }
        
        const days = Math.floor((tempTarget - tempNow) / (1000 * 60 * 60 * 24));
        
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        
        return { months, days, hours, minutes, seconds, totalDays };
    }

    updateAll(holidays) {
        holidays.forEach(holiday => {
            const timeRemaining = this._calculateTimeRemaining(holiday.targetDate);
            updateCountdownUI(holiday, timeRemaining);
        });
    }
}
