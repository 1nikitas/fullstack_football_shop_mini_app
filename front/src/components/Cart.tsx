import React from 'react';
import { ModalHeader } from './ModalHeader';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-0 sm:p-4" style={{ paddingTop: '8vh' }}>
            <div className="bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-xl overflow-y-auto">
                <div className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Header */}
                    <ModalHeader onClose={onClose} />

                    {/* Title */}
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                            Корзина
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Ваши выбранные товары
                        </p>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 min-h-0">
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🛒</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
                            <p className="text-gray-500">Добавляйте товары в корзину для оформления заказа</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
