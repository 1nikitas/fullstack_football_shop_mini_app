import React from 'react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
    onOpenFilters: () => void;
    onOpenCart: () => void;
    onSearch: (query: string) => void;
    onBack?: () => void;
    showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFilters, onOpenCart, onSearch, onBack, showBackButton = false }) => {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="auto items-center">
                        <img
                            src="/src/assets/logo_dark.svg"
                            alt="Football Store Logo"
                            className="h-10 w-auto max-w-[220px] transition-all duration-300"
                        />
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <SearchBar onSearch={onSearch} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={onOpenFilters}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Фильтры
                        </button> */}

                        <button
                            onClick={onOpenCart}
                            className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            🛒 Корзина
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* First Row - Back Button and Logo */}
                    <div className="flex items-center justify-between py-3 relative" style={{ minHeight: "4vh" }}>
                        {/* Center - Logo */}
                        <div
                            className="flex items-center justify-center w-full absolute left-0 top-1/2 -translate-y-1/2"
                            style={{ minHeight: "5vh", minWidth: 220 }}
                        >
                            <img
                                src="/src/assets/logo_dark.svg"
                                alt="Football Store Logo"
                                className="h-8 w-auto max-w-[220px] transition-all duration-300"
                            />
                        </div>

                        {/* Right Side - Empty space for balance */}
                        <div className="w-20" />
                    </div>

                    {/* Second Row - Search Bar */}
                    <div className="pb-3">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>
            </div>
        </header>
    );
};
