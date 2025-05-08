import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface AddCountdownButtonProps {
    onClick: () => void;
}

const AddCountdownButton: React.FC<AddCountdownButtonProps> = ({ onClick }) => {
    return (
        <div
            onClick={onClick}
            className="add-button rounded-xl p-6 flex items-center justify-center cursor-pointer text-white shadow-lg hover-scale" // Class 'hover-scale' từ CSS gốc
            title="Thêm bộ đếm mới"
        >
            <FontAwesomeIcon icon={faPlus} className="text-4xl" />
        </div>
    );
};

export default AddCountdownButton;