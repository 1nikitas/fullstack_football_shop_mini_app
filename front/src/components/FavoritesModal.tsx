import React from 'react';
import { ModalHeader } from './ModalHeader';
import { Favorite } from '../services/api';

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: Favorite[];
    onRemoveFromFavorites: (productId: number) => void;
    onAddToCart: (product: any) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
    isOpen,
    onClose,
    favorites,
    onRemoveFromFavorites,
    onAddToCart
}) => {
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
                            Избранное
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            {favorites.length === 0 ? 'Нет избранных товаров' : `${favorites.length} товаров в избранном`}
                        </p>
                    </div>

                    {/* Favorites List */}
                    <div className="flex-1 min-h-0">
                        {favorites.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">❤️</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Избранное пусто</h3>
                                <p className="text-gray-500">Добавляйте товары в избранное, чтобы вернуться к ним позже</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                    {favorites.map((favorite) => (
                                        <div key={favorite.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                            <img
                                                src={favorite.product.images[0]?.image_url || '/placeholder-image.jpg'}
                                                alt={favorite.product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                                                {favorite.product.name}
                                            </h3>
                                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                                {favorite.product.manufacturer} • {favorite.product.league}
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 mt-2">
                                                {favorite.product.price.toLocaleString('ru-RU')} ₽
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => onAddToCart(favorite.product)}
                                                className="px-3 py-2 bg-primary-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                В корзину
                                            </button>
                                            <button
                                                onClick={() => onRemoveFromFavorites(favorite.product.id)}
                                                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Убрать
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
