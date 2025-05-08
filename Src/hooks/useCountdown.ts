import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { TimeLeft } from '../types';

dayjs.extend(duration);

const useCountdown = (targetDate: string, targetTime?: string, isLunar: boolean = false): TimeLeft => {
    // Placeholder for lunar conversion - this needs actual implementation
    const getSolarDate = (lunarDateStr: string): dayjs.Dayjs => {
        if (isLunar) {
            // Đây là nơi bạn cần tích hợp thư viện hoặc logic chuyển đổi âm lịch
            // Ví dụ: return convertLunarToSolar(lunarDateStr);
            console.warn("Lunar date conversion is not implemented yet. Using date as solar.");
        }
        const dateTimeString = targetTime ? `${targetDate}T${targetTime}` : targetDate;
        return dayjs(dateTimeString);
    };

    const calculateTimeLeft = (): TimeLeft => {
        const difference = +getSolarDate(targetDate) - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            const d = dayjs.duration(difference);
            timeLeft = {
                // months: d.months(), // Dayjs duration months can be tricky with days
                days: Math.floor(d.asDays()), // Or d.days() if you want remaining days after months
                hours: d.hours(),
                minutes: d.minutes(),
                seconds: d.seconds(),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    }); // Runs on every render to update every second

    return timeLeft;
};

export default useCountdown;