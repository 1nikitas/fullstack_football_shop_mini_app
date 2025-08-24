import React, { useState, useEffect } from 'react';
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
import { apiService, Product, CartItem, Favorite } from './services/api';

const AppContent: React.FC = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState<'main' | 'filters' | 'cart'>('main');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState({
        manufacturer: '',
        league: '',
        season: '',
        condition: '',
        priceRange: [0, 10000]
    });

    const { isTelegramWebApp, safeAreaTop, canGoBack, goBack } = useTelegramWebApp();

    // Моковый telegram_id для тестирования (в реальном приложении будет получен из Telegram WebApp)
    const mockTelegramId = 123456789;

    // Загрузка продуктов при монтировании компонента
    useEffect(() => {
        loadProducts();
        loadCart();
        loadFavorites();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const productsData = await apiService.getProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Ошибка загрузки продуктов:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCart = async () => {
        try {
            const cartData = await apiService.getCart(mockTelegramId);
            setCartItems(cartData);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    };

    const loadFavorites = async () => {
        try {
            const favoritesData = await apiService.getFavorites(mockTelegramId);
            setFavorites(favoritesData);
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
        }
    };

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

    const handleAddToCart = async (product: Product) => {
        try {
            const newCartItem = await apiService.addToCart(
                mockTelegramId,
                product.id,
                1,
                product.size || 'M'
            );
            await loadCart(); // Перезагружаем корзину
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
        }
    };

    const handleToggleFavorite = async (product: Product) => {
        try {
            const isFavorite = favorites.some(fav => fav.product.id === product.id);

            if (isFavorite) {
                const favoriteItem = favorites.find(fav => fav.product.id === product.id);
                if (favoriteItem) {
                    await apiService.removeFromFavorites(favoriteItem.id);
                }
            } else {
                await apiService.addToFavorites(mockTelegramId, product.id);
            }

            await loadFavorites(); // Перезагружаем избранное
        } catch (error) {
            console.error('Ошибка работы с избранным:', error);
        }
    };

    const handleRemoveFromFavorites = async (productId: number) => {
        try {
            const favoriteItem = favorites.find(fav => fav.product.id === productId);
            if (favoriteItem) {
                await apiService.removeFromFavorites(favoriteItem.id);
                await loadFavorites();
            }
        } catch (error) {
            console.error('Ошибка удаления из избранного:', error);
        }
    };

    const handleRemoveFromCart = async (cartItemId: number) => {
        try {
            await apiService.removeFromCart(cartItemId);
            await loadCart();
        } catch (error) {
            console.error('Ошибка удаления из корзины:', error);
        }
    };

    const handleUpdateCartQuantity = async (cartItemId: number, quantity: number) => {
        try {
            await apiService.updateCartItem(cartItemId, quantity);
            await loadCart();
        } catch (error) {
            console.error('Ошибка обновления количества:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await apiService.clearCart(mockTelegramId);
            await loadCart();
        } catch (error) {
            console.error('Ошибка очистки корзины:', error);
        }
    };

    // Фильтрация товаров по поиску и фильтрам
    const filteredProducts = products.filter(product => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка товаров...</p>
                </div>
            </div>
        );
    }

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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A2 2 0 0013 14.586V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-3.414a2 2 0 00-.293-1.293L2.293 6.707A1 1 0 012 6V4z" />
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
            <FilterPanel
                isOpen={isFiltersOpen}
                onClose={closeFilters}
                onApplyFilters={setActiveFilters}
                activeFilters={activeFilters}
            />

            {/* Cart */}
            <Cart
                isOpen={isCartOpen}
                onClose={closeCart}
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onClearCart={handleClearCart}
            />

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={closeProductModal}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(fav => fav.product.id === selectedProduct?.id)}
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
