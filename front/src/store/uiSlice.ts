import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    searchQuery: string;
    selectedProduct: number | null;
    isFiltersOpen: boolean;
    isProductModalOpen: boolean;
    theme: 'light' | 'dark';
}

const initialState: UIState = {
    searchQuery: '',
    selectedProduct: null,
    isFiltersOpen: false,
    isProductModalOpen: false,
    theme: 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setSelectedProduct: (state, action: PayloadAction<number | null>) => {
            state.selectedProduct = action.payload;
        },
        toggleFilters: (state) => {
            state.isFiltersOpen = !state.isFiltersOpen;
        },
        openFilters: (state) => {
            state.isFiltersOpen = true;
        },
        closeFilters: (state) => {
            state.isFiltersOpen = false;
        },
        toggleProductModal: (state) => {
            state.isProductModalOpen = !state.isProductModalOpen;
        },
        openProductModal: (state) => {
            state.isProductModalOpen = true;
        },
        closeProductModal: (state) => {
            state.isProductModalOpen = false;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
    },
});

export const {
    setSearchQuery,
    setSelectedProduct,
    toggleFilters,
    openFilters,
    closeFilters,
    toggleProductModal,
    openProductModal,
    closeProductModal,
    toggleTheme,
    setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
