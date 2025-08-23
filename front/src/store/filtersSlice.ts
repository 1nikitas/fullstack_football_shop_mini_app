import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filters } from '../types';

const initialState: Filters = {
    type: '',
    manufacturer: '',
    league: '',
    season: '',
    condition: '',
    size: '',
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
            state[action.payload.key] = action.payload.value;
        },
        resetFilters: (state) => {
            Object.keys(state).forEach(key => {
                state[key as keyof Filters] = '';
            });
        },
        setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { setFilter, resetFilters, setFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
