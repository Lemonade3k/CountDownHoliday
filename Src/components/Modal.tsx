import React from 'react';
import { CustomCountdownFormData } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CustomCountdownFormData) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data: CustomCountdownFormData = {
            name: formData.get('name') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string || '00:00',
            isLunar: (formData.get('isLunar') === 'on') as boolean,
        };
        onSubmit(data);
    };

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Close on overlay click
        >
            <div
                className="modal bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">Tạo bộ đếm mới</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên bộ đếm</label>
                        <input type="text" id="name" name="name" required className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Ngày đích</label>
                        <input type="date" id="date" name="date" required className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Giờ đích (HH:mm)</label>
                        <input type="time" id="time" name="time" defaultValue="00:00" className="w-full border-2 border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isLunar" name="isLunar" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="isLunar" className="ml-2 text-sm font-medium text-gray-700">Âm lịch</label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors">Hủy</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">Tạo</button>
                    </div>
                </form>
            </div>
            {/* Add keyframes for modal animation in your CSS if needed */}
            <style jsx>{`
                @keyframes modalEnter {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                :global(.animate-modalEnter) { animation: modalEnter 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
            `}</style>
        </div>
    );
};

export default Modal;