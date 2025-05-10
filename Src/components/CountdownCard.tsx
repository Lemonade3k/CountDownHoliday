import React, { useEffect, useState } from 'react';
import { CountdownData } from '../types';

interface CountdownCardProps {
    countdown: CountdownData;
    isMain?: boolean;
}

interface TimeLeft {
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds?: number;
}

// A simplified version of your calculateTimeRemaining logic
const calculateTimeLeft = (targetDateStr: string): TimeLeft & { diff: number } => {
    const target = new Date(targetDateStr);
    let now = new Date();
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        const originalTarget = new Date(targetDateStr);
        let nextTarget = new Date(originalTarget);
        while (nextTarget.getTime() - now.getTime() <= 0) {
            nextTarget.setFullYear(nextTarget.getFullYear() + 1);
        }
        diff = nextTarget.getTime() - now.getTime();
    }

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Simplified month/day calculation for placeholder
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { months, days, hours, minutes, seconds, diff };
};

const CountdownCard: React.FC<CountdownCardProps> = ({ countdown, isMain = false }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(countdown.targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(countdown.targetDate);
            if (newTimeLeft.diff <= 0 && !isMain) {
                clearInterval(timer);
                setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown.targetDate, isMain]);

    const cardClasses = `countdown-card p-4 sm:p-6 shadow-lg rounded-lg ${countdown.themeClass} ${isMain ? 'lg:p-8 max-w-2xl lg:max-w-4xl mx-auto' : ''}`;
    const titleSize = isMain ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl';
    const timeValueSize = isMain ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-lg sm:text-xl';
    const noteSize = isMain ? 'text-md sm:text-lg' : 'text-xs sm:text-sm';
    const iconSize = isMain ? 'text-2xl sm:text-3xl' : 'text-xl';

    return (
        <div className={cardClasses} data-id={countdown.id}>
            {/* Placeholder for drum or fireworks container if needed based on themeClass */}
            {countdown.themeClass === 'hung-kings-theme' && <div className="drum-container absolute inset-0 z-0 flex items-center justify-center pointer-events-none"><div className="rotating-drum w-24 h-24 opacity-25" style={{ backgroundImage: "url('/TrongDong.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', animation: 'rotateDrum 30s linear infinite' }}></div></div>}
            {countdown.themeClass === 'new-year-theme' && <div className="fireworks-container absolute inset-0 z-0 overflow-hidden pointer-events-none"></div>}


            <div className={`flex items-center mb-1 ${countdown.textColor}`}>
                {/* {countdown.icon && <FontAwesomeIcon icon={iconToRender} className={`${iconSize} mr-2 ${countdown.color}`} />} */}
                <h3 className={`${titleSize} font-semibold ${countdown.textColor}`}>
                    {countdown.title}
                    {countdown.note && countdown.note === '(âm lịch)' && (
                        <span className={`${noteSize} font-normal ml-1 ${countdown.textColorAccent}`}>{countdown.note}</span>
                    )}
                </h3>
            </div>
            {countdown.note && countdown.note !== '(âm lịch)' && (
                <p className={`${noteSize} mb-3 ${countdown.textColorAccent}`}>{countdown.note}</p>
            )}
             {(!countdown.note || countdown.note === '(âm lịch)') && <div className={isMain ? "mb-6 sm:mb-8" : "mt-4"}></div>}


            <div className={`grid grid-cols-${countdown.showSeconds || isMain ? 5 : 4} gap-2 sm:gap-3`}>
                <div className={`time-block text-center bg-white/70 backdrop-blur-sm rounded-lg p-2 ${countdown.themeClass}`}>
                    <span className={`${timeValueSize} font-bold block ${countdown.textColor}`}>{timeLeft.months}</span>
                    <span className={`time-label text-xs ${countdown.textColorAccent}`}>Tháng</span>
                </div>
                <div className={`time-block text-center bg-white/70 backdrop-blur-sm rounded-lg p-2 ${countdown.themeClass}`}>
                    <span className={`${timeValueSize} font-bold block ${countdown.textColor}`}>{timeLeft.days}</span>
                    <span className={`time-label text-xs ${countdown.textColorAccent}`}>Ngày</span>
                </div>
                <div className={`time-block text-center bg-white/70 backdrop-blur-sm rounded-lg p-2 ${countdown.themeClass}`}>
                    <span className={`${timeValueSize} font-bold block ${countdown.textColor}`}>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className={`time-label text-xs ${countdown.textColorAccent}`}>Giờ</span>
                </div>
                <div className={`time-block text-center bg-white/70 backdrop-blur-sm rounded-lg p-2 ${countdown.themeClass}`}>
                    <span className={`${timeValueSize} font-bold block ${countdown.textColor}`}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className={`time-label text-xs ${countdown.textColorAccent}`}>Phút</span>
                </div>
                {(countdown.showSeconds || isMain) && timeLeft.seconds !== undefined && (
                    <div className={`time-block text-center bg-white/70 backdrop-blur-sm rounded-lg p-2 ${countdown.themeClass}`}>
                        <span className={`${timeValueSize} font-bold block ${countdown.textColor}`}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className={`time-label text-xs ${countdown.textColorAccent}`}>Giây</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountdownCard;