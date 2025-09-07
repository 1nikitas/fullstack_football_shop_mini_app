import { useState, useEffect, useCallback } from 'react';

export const useTelegramWebApp = () => {
    const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
    const [safeAreaTop, setSafeAreaTop] = useState(0);
    const [canGoBack, setCanGoBack] = useState(false);
    const [telegramUser, setTelegramUser] = useState<any>(null);
    const [telegramId, setTelegramId] = useState<number | null>(null);

    const goBack = useCallback(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
        }
    }, []);

    useEffect(() => {
        // Проверяем, запущено ли приложение в Telegram WebApp
        if (window.Telegram?.WebApp) {
            setIsTelegramWebApp(true);

            // Инициализируем WebApp
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();

            // Получаем информацию о пользователе
            const initData = window.Telegram.WebApp.initData;
            const user = window.Telegram.WebApp.initDataUnsafe?.user;

            if (user) {
                setTelegramUser(user);
                setTelegramId(user.id);

                // Сохраняем в localStorage для использования в других компонентах
                localStorage.setItem('telegram_user', JSON.stringify(user));
                localStorage.setItem('telegram_id', user.id.toString());
            }

            // Получаем безопасную область сверху
            const viewportHeight = window.Telegram.WebApp.viewportHeight;
            const viewportStableHeight = window.Telegram.WebApp.viewportStableHeight;
            const safeTop = viewportHeight - viewportStableHeight;
            setSafeAreaTop(Math.max(safeTop, 0));

            // Настраиваем BackButton
            if (window.Telegram.WebApp.BackButton) {
                window.Telegram.WebApp.BackButton.onClick(goBack);
                setCanGoBack(true);
            }

            // Настраиваем MainButton если нужно
            if (window.Telegram.WebApp.MainButton) {
                window.Telegram.WebApp.MainButton.hide();
            }

            // Предотвращаем закрытие WebApp при свайпе вниз
            let startY = 0;
            let isSwipeDown = false;

            const preventSwipeClose = (e: TouchEvent) => {
                const touch = e.touches[0] || e.changedTouches[0];
                const currentY = touch.clientY;

                if (e.type === 'touchstart') {
                    startY = currentY;
                    isSwipeDown = false;
                } else if (e.type === 'touchmove') {
                    // Определяем направление свайпа
                    if (currentY > startY && startY < 100) {
                        isSwipeDown = true;
                    }

                    // Предотвращаем свайп вниз в верхней части экрана
                    if (isSwipeDown && currentY > startY && startY < 150) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }

                    // Предотвращаем любые touch-события в верхней части если есть прокрутка
                    if (startY < 50 && window.scrollY === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
            };

            // Предотвращаем контекстное меню и выделение
            const preventContextMenu = (e: Event) => {
                e.preventDefault();
                return false;
            };

            // Добавляем обработчики событий
            document.addEventListener('touchstart', preventSwipeClose, { passive: false });
            document.addEventListener('touchmove', preventSwipeClose, { passive: false });
            document.addEventListener('touchend', preventSwipeClose, { passive: false });
            document.addEventListener('contextmenu', preventContextMenu);
            document.addEventListener('selectstart', preventContextMenu);

            // Настраиваем viewport для предотвращения зума
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }

            // Устанавливаем стили для предотвращения закрытия
            document.body.style.overflow = 'auto';
            document.body.style.overscrollBehavior = 'contain';
            document.body.style.touchAction = 'pan-y pinch-zoom';
            document.body.style.position = 'relative';
            document.body.style.width = '100%';
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';

            return () => {
                document.removeEventListener('touchstart', preventSwipeClose);
                document.removeEventListener('touchmove', preventSwipeClose);
                document.removeEventListener('touchend', preventSwipeClose);
                document.removeEventListener('contextmenu', preventContextMenu);
                document.removeEventListener('selectstart', preventContextMenu);

                // Восстанавливаем стили
                document.body.style.overflow = '';
                document.body.style.overscrollBehavior = '';
                document.body.style.touchAction = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.body.style.minHeight = '';
            };
        } else {
            // Если не в Telegram WebApp, пытаемся получить данные из localStorage
            const storedUser = localStorage.getItem('telegram_user');
            const storedId = localStorage.getItem('telegram_id');

            if (storedUser && storedId) {
                setTelegramUser(JSON.parse(storedUser));
                setTelegramId(parseInt(storedId));
            }
        }
    }, [goBack]);

    // Функция для получения Telegram ID
    const getTelegramId = useCallback(() => {
        if (telegramId) return telegramId;

        const storedId = localStorage.getItem('telegram_id');
        if (storedId) return parseInt(storedId);

        return null;
    }, [telegramId]);

    // Функция для получения информации о пользователе
    const getUserInfo = useCallback(() => {
        if (telegramUser) return telegramUser;

        const storedUser = localStorage.getItem('telegram_user');
        if (storedUser) return JSON.parse(storedUser);

        return null;
    }, [telegramUser]);

    return {
        isTelegramWebApp,
        safeAreaTop,
        canGoBack,
        goBack,
        telegramUser: getUserInfo(),
        telegramId: getTelegramId(),
        getTelegramId
    };
};
