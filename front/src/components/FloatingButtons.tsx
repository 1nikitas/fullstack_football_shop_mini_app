import React from 'react';

interface FloatingButtonsProps {
    onOpenCart: () => void;
    onOpenFavorites: () => void;
    cartItemsCount: number;
    favoritesCount: number;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
    onOpenCart,
    onOpenFavorites,
    cartItemsCount,
    favoritesCount
}) => {
    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={onOpenCart}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Открыть корзину"
            >
                <span className="text-white text-xl">🛒</span>

                {/* Cart Items Counter */}
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                )}
            </button>

            {/* Floating Favorites Button */}
            <button
                onClick={onOpenFavorites}
                className="fixed bottom-6 right-24 z-40 w-14 h-14 bg-gray-600 hover:bg-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Открыть избранное"
            >
                <span className="text-white text-xl">❤️</span>

                {/* Favorites Counter */}
                {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                )}
            </button>
        </>
    );
};
