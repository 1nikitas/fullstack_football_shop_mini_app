import React from 'react';
import { ProductCard } from './ProductCard';

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

interface Badge {
    type: string;
    value: string;
}

interface ProductGridProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onToggleFavorite: (product: Product) => void;
    favorites: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onProductClick,
    onAddToCart,
    onToggleFavorite,
    favorites
}) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductClick(product)}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.some(fav => fav.id === product.id)}
                />
            ))}
        </div>
    );
};
