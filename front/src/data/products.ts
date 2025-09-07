import { Product } from '../services/api';

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "Футболка Барселона 2023/24",
        team: "Барселона",
        national_team: "",
        brand: "Nike",
        manufacturer: "Nike",
        league: "La Liga",
        type: "Домашняя",
        season: "2023/24",
        kit_type: "Домашняя",
        condition: "Новая",
        price: 6500,
        size: "M",
        color: "Сине-гранатовый",
        features: "Официальная форма команды",
        description: "Официальная домашняя форма ФК Барселона сезона 2023/24",
        withPlayer: false,
        contacts: "@rooneyform",
        hashtags: "#barcelona #barca #laliga",
        post_url: "https://t.me/rooneyform",
        is_available: true,
        stock_quantity: 5,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        images: [
            {
                id: 1,
                image: "/test1.jpg",
                image_url: "/test1.jpg",
                created_at: "2024-01-15T10:00:00Z"
            }
        ],
        images_count: 1,
        badges: [
            { type: "condition", value: "Новая" },
            { type: "brand", value: "Nike" }
        ]
    },
    {
        id: 2,
        name: "Футболка Реал Мадрид 2023/24",
        team: "Реал Мадрид",
        national_team: "",
        brand: "Adidas",
        manufacturer: "Adidas",
        league: "La Liga",
        type: "Гостевая",
        season: "2023/24",
        kit_type: "Гостевая",
        condition: "Новая",
        price: 7000,
        size: "L",
        color: "Белый",
        features: "Официальная форма команды",
        description: "Официальная гостевая форма Реал Мадрид сезона 2023/24",
        withPlayer: false,
        contacts: "@rooneyform",
        hashtags: "#realmadrid #madrid #laliga",
        post_url: "https://t.me/rooneyform",
        is_available: true,
        stock_quantity: 3,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        images: [
            {
                id: 2,
                image: "/test2.jpg",
                image_url: "/test2.jpg",
                created_at: "2024-01-15T10:00:00Z"
            }
        ],
        images_count: 1,
        badges: [
            { type: "condition", value: "Новая" },
            { type: "brand", value: "Adidas" }
        ]
    },
    {
        id: 3,
        name: "Футболка Манчестер Юнайтед 2023/24",
        team: "Манчестер Юнайтед",
        national_team: "",
        brand: "Adidas",
        manufacturer: "Adidas",
        league: "Premier League",
        type: "Домашняя",
        season: "2023/24",
        kit_type: "Домашняя",
        condition: "Новая",
        price: 7500,
        size: "S",
        color: "Красный",
        features: "Официальная форма команды",
        description: "Официальная домашняя форма Манчестер Юнайтед сезона 2023/24",
        withPlayer: false,
        contacts: "@rooneyform",
        hashtags: "#manutd #manchesterunited #premierleague",
        post_url: "https://t.me/rooneyform",
        is_available: true,
        stock_quantity: 7,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        images: [
            {
                id: 3,
                image: "/test3.jpg",
                image_url: "/test3.jpg",
                created_at: "2024-01-15T10:00:00Z"
            }
        ],
        images_count: 1,
        badges: [
            { type: "condition", value: "Новая" },
            { type: "brand", value: "Adidas" }
        ]
    },
    {
        id: 4,
        name: "Футболка Ливерпуль 2023/24",
        team: "Ливерпуль",
        national_team: "",
        brand: "Nike",
        manufacturer: "Nike",
        league: "Premier League",
        type: "Гостевая",
        season: "2023/24",
        kit_type: "Гостевая",
        condition: "Новая",
        price: 6800,
        size: "XL",
        color: "Белый",
        features: "Официальная форма команды",
        description: "Официальная гостевая форма Ливерпуля сезона 2023/24",
        withPlayer: false,
        contacts: "@rooneyform",
        hashtags: "#liverpool #lfc #premierleague",
        post_url: "https://t.me/rooneyform",
        is_available: true,
        stock_quantity: 4,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
        images: [
            {
                id: 4,
                image: "/test4.jpg",
                image_url: "/test4.jpg",
                created_at: "2024-01-15T10:00:00Z"
            }
        ],
        images_count: 1,
        badges: [
            { type: "condition", value: "Новая" },
            { type: "brand", value: "Nike" }
        ]
    }
];

export const filterOptions = {
    type: ["Домашняя", "Гостевая", "Третья", "Тренировочная"],
    manufacturer: ["Nike", "Adidas", "Puma", "Under Armour"],
    league: ["Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"],
    season: ["2023/24", "2022/23", "2021/22"],
    condition: ["Новая", "Отличная", "Хорошая"],
    size: ["XS", "S", "M", "L", "XL", "XXL"]
};
