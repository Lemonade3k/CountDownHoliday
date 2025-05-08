import React from 'react';

interface TimeBlockProps {
    value: string | number;
    label: string;
    valueClass?: string;
    labelClass?: string;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ value, label, valueClass = "text-red-600", labelClass = "text-red-400" }) => {
    return (
        <div className="time-block text-center p-4 min-w-[120px]">
            <span className={`text-5xl font-bold block mb-2 time-value ${valueClass}`}>{value}</span>
            <span className={`text-sm time-label ${labelClass}`}>{label}</span>
        </div>
    );
};

export default TimeBlock;