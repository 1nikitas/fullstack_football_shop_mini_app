import React from 'react';

interface Badge {
    type: string;
    value: string;
}

interface ProductCardProps {
    product: {
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
    };
    onClick: () => void;
    onAddToCart: (product: any) => void;
    onToggleFavorite: (product: any) => void;
    isFavorite: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onClick,
    onAddToCart,
    onToggleFavorite,
    isFavorite
}) => {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(product);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(product);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badges.slice(0, 2).map((badge, index) => (
                        <span
                            key={index}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${badge.type === 'type'
                                ? 'bg-primary-500 text-white'
                                : 'bg-white/90 text-gray-700'
                                }`}
                        >
                            {badge.value}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="p-1.5 sm:p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                        title="Добавить в корзину"
                    >
                        🛒
                    </button>
                    <button
                        onClick={handleToggleFavorite}
                        className={`p-1.5 sm:p-2 rounded-full shadow-sm transition-colors ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-white'
                            }`}
                        title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>

                {/* Image Counter */}
                {product.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {product.images.length} фото
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs text-gray-500">{product.manufacturer}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{product.league}</span>
                    </div>
                    <span className="text-xs text-gray-500">{product.season}</span>
                </div>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <button
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium px-3 py-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        👁️ Подробнее
                    </button>
                </div>

                {/* Size and Condition */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">Размер: {product.size.join(', ')}</span>
                    <span className="ml-2">{product.condition}</span>
                </div>
            </div>
        </div>
    );
};
