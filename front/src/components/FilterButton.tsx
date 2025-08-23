import React from 'react';
import { Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFilters } from '../store/uiSlice';
import { getActiveFiltersCount } from '../utils';

export const FilterButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(state => state.filters);
    const isFiltersOpen = useAppSelector(state => state.ui.isFiltersOpen);

    const activeFiltersCount = getActiveFiltersCount(filters);

    return (
        <button
            onClick={() => dispatch(toggleFilters())}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${isFiltersOpen
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
        >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
            {activeFiltersCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {activeFiltersCount}
                </span>
            )}
        </button>
    );
};
