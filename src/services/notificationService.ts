import { getCurrentUser } from './authService';

export interface Notification {
    id: string;
    userId: string;
    type: 'project' | 'mentor' | 'booking' | 'system';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    relatedId?: string; // ID проекта, бронирования и т.д.
}

const NOTIFICATIONS_KEY = 'tbank_notifications';

// Получить все уведомления
export const getNotifications = (): Notification[] => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

// Сохранить все уведомления
export const saveNotifications = (notifications: Notification[]) => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// Создать уведомление
export const createNotification = (notification: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'isRead'>): Notification => {
    const user = getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const notifications = getNotifications();

    const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        isRead: false,
    };

    notifications.unshift(newNotification); // Добавляем в начало
    saveNotifications(notifications);

    return newNotification;
};

// Получить уведомления пользователя
export const getUserNotifications = (): Notification[] => {
    const user = getCurrentUser();
    if (!user) return [];

    return getNotifications().filter(n => n.userId === user.id);
};

// Пометить уведомление как прочитанное
export const markAsRead = (id: string): boolean => {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.id === id);

    if (index === -1) return false;

    notifications[index].isRead = true;
    saveNotifications(notifications);
    return true;
};

// Пометить все уведомления как прочитанные
export const markAllAsRead = (): void => {
    const notifications = getNotifications();
    const user = getCurrentUser();
    if (!user) return;

    notifications.forEach(n => {
        if (n.userId === user.id) {
            n.isRead = true;
        }
    });

    saveNotifications(notifications);
};

// Удалить уведомление
export const deleteNotification = (id: string): boolean => {
    const notifications = getNotifications();
    const filtered = notifications.filter(n => n.id !== id);

    if (filtered.length === notifications.length) return false;

    saveNotifications(filtered);
    return true;
};

// Получить количество непрочитанных уведомлений
export const getUnreadCount = (): number => {
    const user = getCurrentUser();
    if (!user) return 0;

    return getNotifications().filter(n => n.userId === user.id && !n.isRead).length;
};