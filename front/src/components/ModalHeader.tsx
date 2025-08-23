import React from 'react';

interface ModalHeaderProps {
    onClose: () => void;
    title?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose, title }) => {
    return (
        <div className="relative flex items-center justify-center mb-4 sm:mb-6 flex-shrink-0">
            {/* Кнопка закрытия справа */}
            <button
                onClick={onClose}
                className="absolute right-0 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            >
                ✕
            </button>
            {/* Логотип по центру */}
            <div className="flex items-center justify-center w-full">
                <img
                    src="/src/assets/logo_dark.svg"
                    alt="Football Store Logo"
                    className="h-8 sm:h-10 w-auto max-w-[240px] sm:max-w-[240px] transition-all duration-300 mx-auto"
                />
            </div>
        </div>
    );
};
