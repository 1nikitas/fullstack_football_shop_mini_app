import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { FilterPanel } from './components/FilterPanel';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { FloatingButtons } from './components/FloatingButtons';
import { FavoritesModal } from './components/FavoritesModal';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

// Импорт изображений
import test1 from './assets/test1.jpg';
import test1_1 from './assets/test1_1.jpg';
import test2 from './assets/test2.jpg';
import test2_2 from './assets/test2_2.jpg';
import test3 from './assets/test3.jpg';
import test3_3 from './assets/test3_3.jpg';
import test4 from './assets/test4.jpg';
import test4_4 from './assets/test4_4.jpg';

// Типы
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

// Тестовые данные с изображениями
const testProducts: Product[] = [
    {
        id: 1,
        name: "Футболка Барселона 2023",
        manufacturer: "Nike",
        league: "Ла Лига",
        season: "2023/24",
        price: 6500,
        size: ["M"],
        condition: "Новая",
        images: [test1, test1_1],
        badges: [
            { type: 'type', value: 'Домашняя' },
            { type: 'league', value: 'Ла Лига' }
        ]
    },
    {
        id: 2,
        name: "Футболка Аргентина 2022",
        manufacturer: "Adidas",
        league: "ЧМ",
        season: "2022",
        price: 7000,
        size: ["L"],
        condition: "Новая",
        images: [test2, test2_2],
        badges: [
            { type: 'type', value: 'Домашняя' },
            { type: 'tournament', value: 'ЧМ 2022' }
        ]
    },
    {
        id: 3,
        name: "Футболка Манчестер Юнайтед 2023",
        manufacturer: "Adidas",
        league: "АПЛ",
        season: "2023/24",
        price: 8000,
        size: ["S", "M", "L"],
        condition: "Новая",
        images: [test3, test3_3],
        badges: [
            { type: 'type', value: 'Гостевая' },
            { type: 'league', value: 'АПЛ' }
        ]
    },
    {
        id: 4,
        name: "Футболка Бразилия 2022",
        manufacturer: "Nike",
        league: "ЧМ",
        season: "2022",
        price: 5500,
        size: ["M", "L"],
        condition: "Б/У",
        images: [test4, test4_4],
        badges: [
            { type: 'type', value: 'Домашняя' },
            { type: 'tournament', value: 'ЧМ 2022' }
        ]
    }
];

const AppContent: React.FC = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<'main' | 'filters' | 'cart'>('main');
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [activeFilters, setActiveFilters] = useState({
        manufacturer: '',
        league: '',
        season: '',
        condition: '',
        priceRange: [0, 10000]
    });

    const { isTelegramWebApp, safeAreaTop, canGoBack, goBack } = useTelegramWebApp();

    const openFilters = () => {
        setIsFiltersOpen(true);
        setCurrentView('filters');
    };

    const closeFilters = () => {
        setIsFiltersOpen(false);
        setCurrentView('main');
    };

    const openCart = () => {
        setIsCartOpen(true);
        setCurrentView('cart');
    };

    const closeCart = () => {
        setIsCartOpen(false);
        setCurrentView('main');
    };

    const openFavorites = () => {
        setIsFavoritesOpen(true);
    };

    const closeFavorites = () => {
        setIsFavoritesOpen(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setSelectedProduct(null);
    };

    const handleBack = () => {
        if (currentView === 'filters') {
            closeFilters();
        } else if (currentView === 'cart') {
            closeCart();
        } else {
            goBack();
        }
    };

    const handleAddToCart = (product: Product) => {
        setCartItems(prev => [...prev, product]);
    };

    const handleToggleFavorite = (product: Product) => {
        setFavorites(prev => {
            const isFavorite = prev.some(fav => fav.id === product.id);
            if (isFavorite) {
                return prev.filter(fav => fav.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const handleRemoveFromFavorites = (productId: number) => {
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
    };

    // Фильтрация товаров по поиску и фильтрам
    const filteredProducts = testProducts.filter(product => {
        // Поиск по тексту
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.league.toLowerCase().includes(searchQuery.toLowerCase());

        // Фильтры
        const matchesManufacturer = !activeFilters.manufacturer || product.manufacturer === activeFilters.manufacturer;
        const matchesLeague = !activeFilters.league || product.league === activeFilters.league;
        const matchesSeason = !activeFilters.season || product.season === activeFilters.season;
        const matchesCondition = !activeFilters.condition || product.condition === activeFilters.condition;
        const matchesPrice = product.price >= activeFilters.priceRange[0] && product.price <= activeFilters.priceRange[1];

        return matchesSearch && matchesManufacturer && matchesLeague && matchesSeason && matchesCondition && matchesPrice;
    });

    return (
        <div
            className={`min-h-screen bg-gray-50 ${isTelegramWebApp ? 'telegram-webapp' : ''}`}
            style={{
                paddingTop: isTelegramWebApp
                    ? `${safeAreaTop + (window.innerWidth < 1024 ? 16 : 0)}px`
                    : (window.innerWidth < 1024 ? '7vh' : '0'),
                // Разрешаем скролл даже в Telegram WebApp, чтобы не закрывалось приложение
                overflow: 'auto',
                height: isTelegramWebApp ? '7vh' : 'auto'
            }}
        >
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8"></div>
            <Header
                onOpenFilters={openFilters}
                onOpenCart={openCart}
                onSearch={handleSearch}
                onBack={handleBack}
                showBackButton={currentView !== 'main'}
            />

            {/* Main Content with Scroll */}
            <div
                className={`${isTelegramWebApp ? 'h-full overflow-y-auto' : ''}`}
                style={{
                    height: isTelegramWebApp ? `calc(120vh - ${safeAreaTop}px)` : 'auto'
                }}
            >
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    {/* Results Info with Filters Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                        <div className="flex flex-row items-center w-full">
                            <div className="flex-1">
                                <p className="text-sm sm:text-base text-gray-600 mt-1">
                                    Найдено {filteredProducts.length} товаров
                                    {searchQuery && ` по запросу "${searchQuery}"`}
                                </p>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <button
                                    onClick={openFilters}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 border border-blue-600 rounded-md text-xs font-medium text-white hover:bg-blue-600 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    aria-label="Открыть фильтры"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.414a2 2 0 00-.293-1.293L2.293 6.707A1 1 0 012 6V4z" />
                                    </svg>
                                    <span className="hidden sm:inline">Фильтры</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <ProductGrid
                        products={filteredProducts}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                        favorites={favorites}
                    />
                </main>
            </div>

            {/* Filter Panel */}
            <FilterPanel isOpen={isFiltersOpen} onClose={closeFilters} />

            {/* Cart */}
            <Cart isOpen={isCartOpen} onClose={closeCart} />

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={closeProductModal}
            />

            {/* Favorites Modal */}
            <FavoritesModal
                isOpen={isFavoritesOpen}
                onClose={closeFavorites}
                favorites={favorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                onAddToCart={handleAddToCart}
            />

            {/* Floating Buttons (Mobile Only) */}
            <div className="lg:hidden">
                <FloatingButtons
                    onOpenCart={openCart}
                    onOpenFavorites={openFavorites}
                    cartItemsCount={cartItems.length}
                    favoritesCount={favorites.length}
                />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
};

export default App;
