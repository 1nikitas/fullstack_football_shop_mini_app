import { Product, FilterOptions } from '../types';

export const filterOptions: FilterOptions = {
    type: ["Сборные", "Клубы"],
    manufacturer: ["Nike", "Adidas", "Puma"],
    league: ["Ла Лига", "АПЛ", "ЧМ", "Серия А"],
    season: ["2023/24", "2022", "2021/22"],
    condition: ["Новая", "Б/У"],
    size: ["XS", "S", "M", "L", "XL"],
};

export const products: Product[] = [
    {
        id: 1,
        name: "Футболка Барселона 2023",
        type: "Клубы",
        manufacturer: "Nike",
        description: "Очень крутая футболка Барселона 2023",
        league: "Ла Лига",
        season: "2023/24",
        condition: "Новая",
        withPlayer: true,
        size: ["M"],
        price: 6500,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Клубы" },
            { type: "manufacturer", value: "Nike" },
            { type: "season", value: "2023/24" }
        ]
    },
    {
        id: 2,
        name: "Футболка Аргентина 2022",
        type: "Сборные",
        manufacturer: "Adidas",
        description: "Очень крутая футболка Аргентина 2022",
        league: "ЧМ",
        season: "2022",
        condition: "Новая",
        withPlayer: false,
        size: ["L"],
        price: 7000,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Сборные" },
            { type: "manufacturer", value: "Adidas" },
            { type: "season", value: "2022" }
        ]
    },
    {
        id: 3,
        name: "Футболка Аргентина 2022 (вариант)",
        type: "Сборные",
        manufacturer: "Adidas",
        description: "Очень крутая футболка Аргентина 2022",
        league: "ЧМ",
        season: "2022",
        condition: "Новая",
        withPlayer: false,
        size: ["L"],
        price: 7000,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Сборные" },
            { type: "manufacturer", value: "Adidas" },
            { type: "season", value: "2022" }
        ]
    },
    {
        id: 4,
        name: "Футболка Аргентина 2022 (красная)",
        type: "Сборные",
        manufacturer: "Adidas",
        description: "Очень крутая футболка Аргентина 2022",
        league: "ЧМ",
        season: "2022",
        condition: "Новая",
        withPlayer: false,
        size: ["L"],
        color: "Красный",
        price: 7000,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Сборные" },
            { type: "manufacturer", value: "Adidas" },
            { type: "season", value: "2022" }
        ]
    },
    {
        id: 5,
        name: "Футболка Манчестер Юнайтед 2023",
        type: "Клубы",
        manufacturer: "Adidas",
        description: "Официальная футболка Манчестер Юнайтед сезона 2023/24",
        league: "АПЛ",
        season: "2023/24",
        condition: "Новая",
        withPlayer: false,
        size: ["S", "M", "L"],
        price: 8000,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Клубы" },
            { type: "manufacturer", value: "Adidas" },
            { type: "season", value: "2023/24" }
        ]
    },
    {
        id: 6,
        name: "Футболка Бразилия 2022",
        type: "Сборные",
        manufacturer: "Nike",
        description: "Домашняя футболка сборной Бразилии на ЧМ 2022",
        league: "ЧМ",
        season: "2022",
        condition: "Б/У",
        withPlayer: true,
        size: ["M", "L"],
        price: 5500,
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face"
        ],
        badges: [
            { type: "type", value: "Сборные" },
            { type: "manufacturer", value: "Nike" },
            { type: "season", value: "2022" }
        ]
    }
];
