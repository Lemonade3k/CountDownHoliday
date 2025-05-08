import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; date: string; time: string; isLunar: boolean; color: string }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('00:00');
    const [isLunar, setIsLunar] = useState(false);
    const [color, setColor] = useState('#4f46e5');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, date, time, isLunar, color });
    };

    return (
        <div id="modalOverlay" className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="modal bg-white rounded-2xl p-8 w-full max-w-md mx-4 active"> {/* Assuming 'active' class controls visibility from CSS */}
                <h2 className="text-2xl font-bold mb-6 text-indigo-600">Tạo bộ đếm mới</h2>
                <form id="customCountdownForm" className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên bộ đếm</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-indigo-100 rounded-lg p-3 focus:outline-none focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đích</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border-2 border-indigo-100 rounded-lg p-3 focus:outline-none focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giờ đích</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border-2 border-indigo-100 rounded-lg p-3 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="flex items-center space-x-32">
                        <div className="flex items-center">
                            <input type="checkbox" id="customLunar" checked={isLunar} onChange={(e) => setIsLunar(e.target.checked)} className="w-5 h-5 rounded border-indigo-500 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="customLunar" className="ml-2 text-sm font-medium text-gray-700">Âm lịch</label>
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="customColor" className="mr-2 text-sm font-medium text-gray-700">Màu:</label>
                            <input type="color" id="customColor" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-7 border-2 border-indigo-100 rounded-md focus:outline-none focus:border-indigo-500" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors">
                            Hủy
                        </button>
                        <button type="submit" className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
                            Tạo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;