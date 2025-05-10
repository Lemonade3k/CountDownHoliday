import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface AddCountdownButtonProps {
    onClick: () => void;
}

const AddCountdownButton: React.FC<AddCountdownButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="add-button bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-center min-h-[150px] hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            aria-label="Add new countdown"
        >
            {/* <FontAwesomeIcon icon={faPlus} className="text-3xl sm:text-4xl mb-2" /> */}
            <span className="text-3xl sm:text-4xl mb-2">+</span>
            <span className="text-sm font-medium">Thêm Bộ Đếm</span>
        </button>
    );
};

export default AddCountdownButton;