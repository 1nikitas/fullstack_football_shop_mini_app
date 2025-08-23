export interface Product {
    id: number;
    name: string;
    type: string;
    manufacturer: string;
    description: string;
    league: string;
    season: string;
    condition: string;
    withPlayer: boolean;
    size: string[];
    price: number;
    color?: string;
    images: string[];
    badges: Badge[];
}

export interface Badge {
    type: string;
    value: string;
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
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface TelegramWebApp {
    WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
            text: string;
            color: string;
            textColor: string;
            isVisible: boolean;
            isActive: boolean;
            show: () => void;
            hide: () => void;
            enable: () => void;
            disable: () => void;
            onClick: (callback: () => void) => void;
        };
        themeParams: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
        };
    };
}

declare global {
    interface Window {
        Telegram?: TelegramWebApp;
    }
}
