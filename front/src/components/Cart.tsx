import React from 'react';
import { ModalHeader } from './ModalHeader';
import { CartItem } from '../services/api';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveFromCart: (cartItemId: number) => void;
    onUpdateQuantity: (cartItemId: number, quantity: number) => void;
    onClearCart: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart }) => {
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
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
                                <p className="text-gray-500">Добавляйте товары в корзину для оформления заказа</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.images[0]?.image_url || '/placeholder-image.jpg'}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Размер: {item.selected_size}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.product.price.toLocaleString('ru-RU')} ₽
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => onRemoveFromCart(item.id)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Cart Summary */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-medium text-gray-900">Итого:</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={onClearCart}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Очистить
                                        </button>
                                        <button
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Оформить заказ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
