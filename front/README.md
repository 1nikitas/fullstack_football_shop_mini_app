# Football Store - Telegram WebApp

Современное React-приложение для интернет-магазина футбольных футболок, интегрированное с Telegram WebApp.

## 🚀 Особенности

- **React 18** с TypeScript
- **Redux Toolkit** для управления состоянием
- **Framer Motion** для плавных анимаций
- **Tailwind CSS** для стилизации
- **Telegram WebApp API** интеграция
- **Mobile-first** дизайн
- **Responsive** интерфейс

## 🛠 Технологии

- React 18
- TypeScript
- Redux Toolkit
- Framer Motion
- Tailwind CSS
- Lucide React (иконки)
- Vite

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── Header.tsx      # Заголовок приложения
│   ├── SearchBar.tsx   # Поисковая строка
│   ├── FilterButton.tsx # Кнопка фильтров
│   ├── FilterPanel.tsx # Панель фильтров
│   ├── ProductCard.tsx # Карточка товара
│   ├── ProductGrid.tsx # Сетка товаров
│   ├── ProductModal.tsx # Модальное окно товара
│   └── Cart.tsx        # Корзина
├── store/              # Redux store
│   ├── index.ts        # Основной store
│   ├── cartSlice.ts    # Слайс корзины
│   ├── filtersSlice.ts # Слайс фильтров
│   └── uiSlice.ts      # Слайс UI состояния
├── data/               # Моковые данные
│   └── products.ts     # Товары и фильтры
├── hooks/              # Кастомные хуки
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
├── types/              # TypeScript типы
│   └── index.ts
├── utils/              # Утилиты
│   └── index.ts
├── App.tsx             # Главный компонент
└── main.tsx            # Точка входа
```

## 🚀 Запуск проекта

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

### Предварительный просмотр сборки
```bash
npm run preview
```

## 🔧 Конфигурация

### Telegram WebApp

Приложение автоматически интегрируется с Telegram WebApp API:

```typescript
// Инициализация при загрузке
useEffect(() => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
}, []);
```

### Переменные окружения

Создайте файл `.env.local` для настройки:

```env
VITE_API_URL=your_api_url_here
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## 📱 Функционал

### Каталог товаров
- Отображение товаров в сетке
- Фильтрация по типу, производителю, лиге, сезону, состоянию, размеру
- Поиск по названию и описанию
- Сортировка и пагинация (готово к реализации)

### Карточка товара
- Детальная информация о товаре
- Галерея изображений с навигацией
- Добавление в корзину
- Добавление в избранное

### Корзина
- Добавление/удаление товаров
- Изменение количества
- Расчет общей стоимости
- Оформление заказа

### Фильтры
- Боковая панель с фильтрами
- Сброс всех фильтров
- Применение фильтров в реальном времени

## 🎨 Дизайн

### Цветовая схема
- **Primary**: Синий (#3B82F6)
- **Accent**: Желтый (#EAB308)
- **Gray**: Оттенки серого для текста и фона

### Типографика
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Анимации
- Плавные переходы между состояниями
- Hover эффекты
- Анимации появления/исчезновения
- Spring анимации для интерактивных элементов

## 🔌 API интеграция

### Моковые данные

В `src/data/products.ts` находятся примеры товаров:

```typescript
export const products: Product[] = [
  {
    id: 1,
    name: "Футболка Барселона 2023",
    type: "Клубы",
    manufacturer: "Nike",
    price: 6500,
    // ... другие поля
  }
];
```

### Замена на реальный API

Для интеграции с реальным API замените импорты в компонентах:

```typescript
// Вместо моковых данных
import { products } from '../data/products';

// Используйте API
const { data: products } = useQuery(['products'], fetchProducts);
```

## 📱 Адаптивность

Приложение полностью адаптивно:

- **Mobile**: 1 колонка товаров
- **Tablet**: 2 колонки товаров
- **Desktop**: 3-4 колонки товаров
- **Touch-friendly**: Оптимизировано для мобильных устройств

## 🚀 Развертывание

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Загрузите папку dist в Netlify
```

### GitHub Pages
```bash
npm run build
# Настройте GitHub Actions для автоматического деплоя
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для деталей.

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте Issue в репозитории или свяжитесь с командой разработки.
