import config from '../config/environment';

const API_BASE_URL = `${config.apiUrl}/api`;

export interface Product {
    id: number;
    name: string;
    team: string;
    national_team?: string;
    brand: string;
    manufacturer: string;
    league: string;
    type: string;
    season: string;
    kit_type: string;
    condition: string;
    price: number;
    size: string;
    color: string;
    features: string;
    description: string;
    withPlayer: boolean;
    contacts: string;
    hashtags: string;
    post_url: string;
    is_available: boolean;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
    images: Array<{
        id: number;
        image: string;
        image_url: string;
        created_at: string;
    }>;
    images_count: number;
    badges: Array<{
        type: string;
        value: string;
    }>;
}

export interface FilterOptions {
    type: string[];
    manufacturer: string[];
    league: string[];
    season: string[];
    condition: string[];
    size: string[];
}

export interface Filters {
    type: string;
    manufacturer: string;
    league: string;
    season: string;
    condition: string;
    size: string;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    selected_size: string;
    created_at: string;
    updated_at: string;
}

export interface Favorite {
    id: number;
    product: Product;
    created_at: string;
}

export interface Order {
    id: number;
    user: number;
    order_number: string;
    status: string;
    total_amount: number;
    shipping_address: string;
    phone_number: string;
    notes: string;
    created_at: string;
    updated_at: string;
    items: Array<{
        id: number;
        product: Product;
        quantity: number;
        price: number;
        selected_size: string;
        created_at: string;
    }>;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Продукты
    async getProducts(filters?: Partial<Filters>, search?: string): Promise<Product[]> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                const { mockProducts } = await import('../data/products');
                let filteredProducts = [...mockProducts];

                // Применяем фильтры
                if (filters) {
                    if (filters.manufacturer) {
                        filteredProducts = filteredProducts.filter(p => p.manufacturer === filters.manufacturer);
                    }
                    if (filters.league) {
                        filteredProducts = filteredProducts.filter(p => p.league === filters.league);
                    }
                    if (filters.season) {
                        filteredProducts = filteredProducts.filter(p => p.season === filters.season);
                    }
                    if (filters.condition) {
                        filteredProducts = filteredProducts.filter(p => p.condition === filters.condition);
                    }
                }

                // Применяем поиск
                if (search) {
                    const searchLower = search.toLowerCase();
                    filteredProducts = filteredProducts.filter(p =>
                        p.name.toLowerCase().includes(searchLower) ||
                        p.team.toLowerCase().includes(searchLower) ||
                        p.manufacturer.toLowerCase().includes(searchLower)
                    );
                }

                return filteredProducts;
            }

        // Реальный API
            const params = new URLSearchParams();

            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });
            }

            if (search) params.append('search', search);

            const queryString = params.toString();
            const endpoint = `/products/${queryString ? `?${queryString}` : ''}`;

            return this.request<Product[]>(endpoint);
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProduct(id: number): Promise<Product> {
        return this.request<Product>(`/products/${id}/`);
    }

    async getFilterOptions(): Promise<FilterOptions> {
        return this.request<FilterOptions>('/products/filter_options/');
    }

    // Корзина
    async getCart(telegramId: number): Promise<CartItem[]> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                // Возвращаем пустую корзину для тестирования
                return [];
            }

            return this.request<CartItem[]>(`/cart/by_telegram_id/?telegram_id=${telegramId}`);
        } catch (error) {
            console.error('Error fetching cart:', error);
            return [];
        }
    }

    async addToCart(telegramId: number, productId: number, quantity: number, selectedSize: string): Promise<CartItem> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                // Создаем моковый элемент корзины
                const mockCartItem: CartItem = {
                    id: Date.now(),
                    product: {
                        id: productId,
                        name: "Тестовый товар",
                        team: "Тест",
                        national_team: "",
                        brand: "Test",
                        manufacturer: "Test",
                        league: "Test League",
                        type: "Test",
                        season: "2024",
                        kit_type: "Test",
                        condition: "Новая",
                        price: 1000,
                        size: selectedSize,
                        color: "Test",
                        features: "Test",
                        description: "Test",
                        withPlayer: false,
                        contacts: "Test",
                        hashtags: "Test",
                        post_url: "Test",
                        is_available: true,
                        stock_quantity: 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        images: [],
                        images_count: 0,
                        badges: []
                    },
                    quantity,
                    selected_size: selectedSize,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                console.log('Mock cart item added:', mockCartItem);
                return mockCartItem;
            }

            return this.request<CartItem>('/cart/', {
                method: 'POST',
                body: JSON.stringify({
                    telegram_id: telegramId,
                    product: productId,
                    quantity,
                    selected_size: selectedSize,
                }),
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async updateCartItem(id: number, quantity: number): Promise<CartItem> {
        return this.request<CartItem>(`/cart/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(id: number): Promise<void> {
        return this.request<void>(`/cart/${id}/`, {
            method: 'DELETE',
        });
    }

    async clearCart(telegramId: number): Promise<void> {
        return this.request<void>(`/cart/clear/?telegram_id=${telegramId}`, {
            method: 'DELETE',
        });
    }

    // Избранное
    async getFavorites(telegramId: number): Promise<Favorite[]> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                // Возвращаем пустое избранное для тестирования
                return [];
            }

            return this.request<Favorite[]>(`/favorites/by_telegram_id/?telegram_id=${telegramId}`);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    }

    async addToFavorites(telegramId: number, productId: number): Promise<Favorite> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                // Создаем моковый элемент избранного
                const mockFavorite: Favorite = {
                    id: Date.now(),
                    product: {
                        id: productId,
                        name: "Тестовый товар",
                        team: "Тест",
                        national_team: "",
                        brand: "Test",
                        manufacturer: "Test",
                        league: "Test League",
                        type: "Test",
                        season: "2024",
                        kit_type: "Test",
                        condition: "Новая",
                        price: 1000,
                        size: "M",
                        color: "Test",
                        features: "Test",
                        description: "Test",
                        withPlayer: false,
                        contacts: "Test",
                        hashtags: "Test",
                        post_url: "Test",
                        is_available: true,
                        stock_quantity: 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        images: [],
                        images_count: 0,
                        badges: []
                    },
                    created_at: new Date().toISOString()
                };

                console.log('Mock favorite added:', mockFavorite);
                return mockFavorite;
            }

            return this.request<Favorite>('/favorites/', {
                method: 'POST',
                body: JSON.stringify({
                    telegram_id: telegramId,
                    product: productId,
                }),
            });
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    }

    async removeFromFavorites(id: number): Promise<void> {
        return this.request<void>(`/favorites/${id}/`, {
            method: 'DELETE',
        });
    }

    async checkFavorite(telegramId: number, productId: number): Promise<{ is_favorite: boolean }> {
        return this.request<{ is_favorite: boolean }>(`/favorites/${productId}/check/?telegram_id=${telegramId}`);
    }

    // Заказы
    async createOrder(telegramId: number, shippingAddress: string, phoneNumber: string, notes?: string): Promise<Order> {
        try {
            // Для тестирования используем моковые данные
            if (process.env.NODE_ENV === 'development' || !this.baseUrl.includes('rooneyform.store')) {
                // Создаем моковый заказ
                const mockOrder: Order = {
                    id: Date.now(),
                    user: telegramId,
                    order_number: `ORD-${Date.now().toString(36).toUpperCase()}`,
                    status: 'pending',
                    total_amount: 1000,
                    shipping_address: shippingAddress,
                    phone_number: phoneNumber,
                    notes: notes || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    items: []
                };

                console.log('Mock order created:', mockOrder);
                return mockOrder;
            }

            return this.request<Order>('/orders/create_from_cart/', {
                method: 'POST',
                body: JSON.stringify({
                    telegram_id: telegramId,
                    shipping_address: shippingAddress,
                    phone_number: phoneNumber,
                    notes: notes || '',
                }),
            });
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async getOrders(telegramId: number): Promise<Order[]> {
        return this.request<Order[]>(`/orders/?telegram_id=${telegramId}`);
    }

    async getOrderStats(telegramId: number): Promise<{
        total_orders: number;
        total_spent: number;
        pending_orders: number;
        completed_orders: number;
    }> {
        return this.request(`/orders/stats/?telegram_id=${telegramId}`);
    }

    async cancelOrder(telegramId: number, orderId: number): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/orders/${orderId}/cancel/`, {
            method: 'POST',
            body: JSON.stringify({ telegram_id: telegramId }),
        });
    }

    // Пользователи
    async registerUser(telegramId: number, username?: string, firstName?: string, lastName?: string, phoneNumber?: string): Promise<any> {
        return this.request('/users/register_telegram/', {
            method: 'POST',
            body: JSON.stringify({
                telegram_id: telegramId,
                username,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
            }),
        });
    }

    // Изображения
    async uploadImage(productId: number, imageFile: File): Promise<any> {
        const formData = new FormData();
        formData.append('image', imageFile);

        const url = `${API_BASE_URL}/products/${productId}/upload_image/`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async getProductImages(productId: number): Promise<any[]> {
        return this.request<any[]>(`/products/${productId}/images/`);
    }

    async deleteProductImage(productId: number, imageId: number): Promise<void> {
        return this.request<void>(`/products/${productId}/delete_image/${imageId}/`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
export default apiService;
