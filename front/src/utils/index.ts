import { Product, Filters } from '../types';
import { products } from '../data/products';

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    }).format(price);
};

export const filterProducts = (products: Product[], filters: Filters, searchQuery: string): Product[] => {
    let filtered = products;

    // Поиск по тексту
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.league.toLowerCase().includes(query) ||
            product.manufacturer.toLowerCase().includes(query)
        );
    }

    // Фильтры
    if (filters.type) {
        filtered = filtered.filter(product => product.type === filters.type);
    }
    if (filters.manufacturer) {
        filtered = filtered.filter(product => product.manufacturer === filters.manufacturer);
    }
    if (filters.league) {
        filtered = filtered.filter(product => product.league === filters.league);
    }
    if (filters.season) {
        filtered = filtered.filter(product => product.season === filters.season);
    }
    if (filters.condition) {
        filtered = filtered.filter(product => product.condition === filters.condition);
    }
    if (filters.size) {
        filtered = filtered.filter(product => product.size.includes(filters.size));
    }

    return filtered;
};

export const getActiveFiltersCount = (filters: Filters): number => {
    return Object.values(filters).filter(value => value !== '').length;
};

export const generateOrderId = (): string => {
    return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateTotalPrice = (items: Array<{ product: Product; quantity: number }>): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};
