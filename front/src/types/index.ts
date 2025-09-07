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
    size: string;
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
