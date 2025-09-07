import React, { useState } from 'react';
import { ModalHeader } from './ModalHeader';
import { CartItem } from '../services/api';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveFromCart: (cartItemId: number) => void;
    onUpdateQuantity: (cartItemId: number, quantity: number) => void;
    onClearCart: () => void;
    onCreateOrder: (shippingAddress: string, phoneNumber: string, notes: string) => Promise<boolean>;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onRemoveFromCart, onUpdateQuantity, onClearCart, onCreateOrder }) => {
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const totalAmount = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!shippingAddress.trim() || !phoneNumber.trim()) {
            alert('Пожалуйста, заполните адрес доставки и номер телефона');
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await onCreateOrder(shippingAddress, phoneNumber, notes);

            if (success) {
                alert('Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.');
                setShowCheckout(false);
                onClose();
                // Очищаем корзину после успешного оформления
                onClearCart();
            }
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert('Ошибка оформления заказа. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetCheckout = () => {
        setShowCheckout(false);
        setShippingAddress('');
        setPhoneNumber('');
        setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-0 sm:p-4" style={{ paddingTop: '8vh' }}>
            <div className="bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-xl overflow-y-auto">
                <div className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Header */}
                    <ModalHeader onClose={onClose} />

                    {/* Title */}
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                            {showCheckout ? 'Оформление заказа' : 'Корзина'}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {showCheckout ? 'Заполните данные для доставки' : 'Ваши выбранные товары'}
                        </p>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 min-h-0">
                        {!showCheckout ? (
                            // Показываем содержимое корзины
                            <>
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
                                                        {totalAmount.toLocaleString('ru-RU')} ₽
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
                                                        onClick={() => setShowCheckout(true)}
                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                                    >
                                                        Оформить заказ
                                                    </button>
                                                </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Показываем форму оформления заказа
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Адрес доставки *
                                    </label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Введите полный адрес доставки"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Номер телефона *
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="+7 (999) 123-45-67"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Дополнительные заметки
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                        placeholder="Комментарии к заказу (необязательно)"
                                    />
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Сводка заказа</h3>
                                    <div className="space-y-2">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {item.product.name} (размер: {item.selected_size}) x {item.quantity}
                                                </span>
                                                <span className="text-gray-900">
                                                    {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                                                </span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex justify-between font-medium">
                                                <span>Итого:</span>
                                                <span className="text-lg">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={resetCheckout}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Назад
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
