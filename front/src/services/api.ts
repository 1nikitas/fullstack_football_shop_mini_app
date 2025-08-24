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
    }

    async getProduct(id: number): Promise<Product> {
        return this.request<Product>(`/products/${id}/`);
    }

    async getFilterOptions(): Promise<FilterOptions> {
        return this.request<FilterOptions>('/products/filter_options/');
    }

    // Корзина
    async getCart(telegramId: number): Promise<CartItem[]> {
        return this.request<CartItem[]>(`/cart/by_telegram_id/?telegram_id=${telegramId}`);
    }

    async addToCart(telegramId: number, productId: number, quantity: number, selectedSize: string): Promise<CartItem> {
        return this.request<CartItem>('/cart/', {
            method: 'POST',
            body: JSON.stringify({
                telegram_id: telegramId,
                product: productId,
                quantity,
                selected_size: selectedSize,
            }),
        });
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
        return this.request<Favorite[]>(`/favorites/by_telegram_id/?telegram_id=${telegramId}`);
    }

    async addToFavorites(telegramId: number, productId: number): Promise<Favorite> {
        return this.request<Favorite>('/favorites/', {
            method: 'POST',
            body: JSON.stringify({
                telegram_id: telegramId,
                product: productId,
            }),
        });
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
        return this.request<Order>('/orders/create_from_cart/', {
            method: 'POST',
            body: JSON.stringify({
                telegram_id: telegramId,
                shipping_address: shippingAddress,
                phone_number: phoneNumber,
                notes: notes || '',
            }),
        });
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
