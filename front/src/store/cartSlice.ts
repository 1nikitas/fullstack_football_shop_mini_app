import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.product.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.product.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const item = state.items.find(item => item.product.id === action.payload.productId);
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter(item => item.product.id !== action.payload.productId);
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
} = cartSlice.actions;

export default cartSlice.reducer;
