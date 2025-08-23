import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import filtersReducer from './filtersSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        filters: filtersReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
