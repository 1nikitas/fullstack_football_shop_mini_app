import { useState, useEffect, useCallback } from 'react';

export const useTelegramWebApp = () => {
    const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
    const [safeAreaTop, setSafeAreaTop] = useState(0);
    const [canGoBack, setCanGoBack] = useState(false);

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

            // Предотвращаем закрытие WebApp при свайпе вниз
            const preventClose = (e: TouchEvent) => {
                // Предотвращаем только свайпы сверху вниз в верхней части экрана
                if (e.touches[0].clientY < 100 && e.touches[0].clientY > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            // Предотвращаем pull-to-refresh
            const preventPullToRefresh = (e: TouchEvent) => {
                if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    if (touch.clientY < 50) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            };

            document.addEventListener('touchstart', preventClose, { passive: false });
            document.addEventListener('touchmove', preventClose, { passive: false });
            document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
            document.addEventListener('touchmove', preventPullToRefresh, { passive: false });

            // Предотвращаем скролл страницы
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';

            return () => {
                document.removeEventListener('touchstart', preventClose);
                document.removeEventListener('touchmove', preventClose);
                document.removeEventListener('touchstart', preventPullToRefresh);
                document.removeEventListener('touchmove', preventPullToRefresh);

                // Восстанавливаем скролл страницы
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.height = '';
            };
        }
    }, [goBack]);

    return { isTelegramWebApp, safeAreaTop, canGoBack, goBack };
};
