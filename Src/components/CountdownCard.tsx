import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import TimeBlock from './TimeBlock';
import useCountdown from '../hooks/useCountdown';
import { CountdownData } from '../types';

interface CountdownCardProps {
    countdown: CountdownData;
    isMain?: boolean; // To differentiate styling or structure for the main countdown
}

const CountdownCard: React.FC<CountdownCardProps> = ({ countdown, isMain = false }) => {
    const { name, date, time, isLunar, themeClass, iconClass, textColorBase, textColorAccent, note } = countdown;
    const timeLeft = useCountdown(date, time, isLunar);

    // Convert Font Awesome string class to IconProp
    // This requires you to map string names to actual faIcon objects
    // For simplicity, I'm assuming iconClass is directly usable if you've set up FA correctly,
    // or you'd pass the IconProp directly.
    // Example: import { faLantern } from '@fortawesome/free-solid-svg-icons';
    // const icon = faLantern; // And pass this as a prop

    return (
        <section className={`${themeClass} countdown-card rounded-2xl p-8 ${isMain ? 'mb-12 max-w-6xl mx-auto' : ''} shadow-lg relative`}>
            {themeClass === 'hung-kings-theme' && <div className="drum-container"><div className="rotating-drum"></div></div>}
            {/* Add fireworks container if needed based on theme */}
            {/* <div className="fireworks-container"></div> */}

            <div className="flex items-center justify-center mb-4">
                {iconClass && <i className={`${iconClass} festival-icon ${textColorBase} text-2xl`}></i>}
                <h2 id={isMain ? "main-title" : undefined} className={`text-3xl font-bold ${textColorBase} ml-2`}>
                    {name}
                </h2>
            </div>
            {note && (
                <h3 id={isMain ? "main-note" : undefined} className={`text-lg ${textColorAccent} mb-8 text-center`}>
                    {note}
                </h3>
            )}
            <div id={isMain ? "countdown-lunar" : undefined} className="flex flex-wrap justify-center gap-6">
                {timeLeft.months !== undefined && timeLeft.months > 0 && (
                    <TimeBlock value={timeLeft.months} label="Tháng" valueClass={textColorBase} labelClass={textColorAccent} />
                )}
                <TimeBlock value={timeLeft.days} label="Ngày" valueClass={textColorBase} labelClass={textColorAccent} />
                <TimeBlock value={String(timeLeft.hours).padStart(2, '0')} label="Giờ" valueClass={textColorBase} labelClass={textColorAccent} />
                <TimeBlock value={String(timeLeft.minutes).padStart(2, '0')} label="Phút" valueClass={textColorBase} labelClass={textColorAccent} />
                <TimeBlock value={String(timeLeft.seconds).padStart(2, '0')} label="Giây" valueClass={textColorBase} labelClass={textColorAccent} />
            </div>
        </section>
    );
};

export default CountdownCard;