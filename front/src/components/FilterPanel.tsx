import React, { useState } from 'react';
import { ModalHeader } from './ModalHeader';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: any) => void;
    activeFilters: any;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyFilters, activeFilters }) => {
    const [filters, setFilters] = useState(activeFilters);

    if (!isOpen) return null;

    const handleReset = () => {
        setFilters({
            manufacturer: '',
            league: '',
            size: '',
            condition: ''
        });
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-0 sm:p-4" style={{ paddingTop: '8vh' }}>
            <div className="bg-white w-full h-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-xl overflow-y-auto">
                <div className="p-4 sm:p-6 h-full flex flex-col">
                    {/* Header */}
                    <ModalHeader onClose={onClose} />

                    {/* Title */}
                    <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                            Фильтры
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Настройте параметры поиска
                        </p>
                    </div>

                    {/* Filters Content */}
                    <div className="flex-1 min-h-0 space-y-6">
                        {/* Manufacturer Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Производитель
                            </label>
                            <select
                                value={filters.manufacturer}
                                onChange={(e) => setFilters(prev => ({ ...prev, manufacturer: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Все производители</option>
                                <option value="Nike">Nike</option>
                                <option value="Adidas">Adidas</option>
                                <option value="Puma">Puma</option>
                            </select>
                        </div>

                        {/* League Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Лига
                            </label>
                            <select
                                value={filters.league}
                                onChange={(e) => setFilters(prev => ({ ...prev, league: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Все лиги</option>
                                <option value="Ла Лига">Ла Лига</option>
                                <option value="АПЛ">АПЛ</option>
                                <option value="ЧМ">ЧМ</option>
                            </select>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Размер
                            </label>
                            <select
                                value={filters.size}
                                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Все размеры</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>

                        {/* Condition Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Состояние
                            </label>
                            <select
                                value={filters.condition}
                                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Все состояния</option>
                                <option value="Новая">Новая</option>
                                <option value="Б/У">Б/У</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={handleReset}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Сбросить
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
