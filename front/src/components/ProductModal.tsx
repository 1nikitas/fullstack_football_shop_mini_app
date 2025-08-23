import React, { useState, useEffect } from 'react';
import { ModalHeader } from './ModalHeader';

interface Badge {
    type: string;
    value: string;
}

interface Product {
    id: number;
    name: string;
    manufacturer: string;
    league: string;
    season: string;
    price: number;
    size: string[];
    condition: string;
    images: string[];
    badges: Badge[];
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Небольшая задержка для плавного появления
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            // Задержка перед скрытием для завершения анимации
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product!.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product!.images.length) % product!.images.length);
    };

    if (!isVisible || !product) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 transition-all duration-500 ease-out ${isAnimating
                ? 'bg-black bg-opacity-75'
                : 'bg-black bg-opacity-0'
                }`}
            style={{ paddingTop: '8vh' }}
            onClick={handleClose}
        >
            <div
                className={`bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-xl overflow-y-auto transition-all duration-500 ease-out transform ${isAnimating
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-20'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Header with Logo and Close Button */}
                    <ModalHeader onClose={handleClose} />

                    {/* Product Title */}
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 line-clamp-2">
                            {product.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 flex-1 min-h-0">
                        {/* Image Gallery */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square overflow-hidden rounded-lg">
                                <img
                                    src={product.images[currentImageIndex]}
                                    alt={`${product.name} - фото ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                    key={currentImageIndex}
                                />

                                {/* Navigation Arrows */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${index === currentImageIndex
                                                ? 'border-primary-500 ring-2 ring-primary-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} - миниатюра ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {product.badges.map((badge, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 ${badge.type === 'type'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {badge.value}
                                    </span>
                                ))}
                            </div>

                            {/* Price */}
                            <div>
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 sm:space-y-4">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { label: 'Производитель', value: product.manufacturer },
                                        { label: 'Лига', value: product.league },
                                        { label: 'Сезон', value: product.season },
                                        { label: 'Состояние', value: product.condition }
                                    ].map((item, index) => (
                                        <div key={item.label}>
                                            <span className="text-xs sm:text-sm font-medium text-gray-500">{item.label}</span>
                                            <p className="text-sm sm:text-base text-gray-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Sizes */}
                                <div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-500">Доступные размеры</span>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {product.size.map((size, index) => (
                                            <button
                                                key={size}
                                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 hover:scale-105"
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 bg-primary-600 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base">
                                    🛒 Добавить в корзину
                                </button>
                                <button className="px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95">
                                    ❤️
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
