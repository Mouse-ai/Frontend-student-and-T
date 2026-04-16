import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Bell, Check, Trash2,
    MapPin, Users, FolderOpen, Info
} from 'lucide-react';
import {
    getUserNotifications, markAsRead, markAllAsRead,
    deleteNotification, Notification
} from '../../services/notificationService';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const loadNotifications = () => {
        const notifs = getUserNotifications();
        setNotifications(notifs);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        loadNotifications();
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        loadNotifications();
    };

    const handleDelete = (id: string) => {
        deleteNotification(id);
        loadNotifications();
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'project': return <FolderOpen className="w-5 h-5" />;
            case 'mentor': return <Users className="w-5 h-5" />;
            case 'booking': return <MapPin className="w-5 h-5" />;
            case 'system': return <Info className="w-5 h-5" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    const getIconBg = (type: Notification['type']) => {
        switch (type) {
            case 'project': return 'bg-purple-100 text-purple-600';
            case 'mentor': return 'bg-green-100 text-green-600';
            case 'booking': return 'bg-blue-100 text-blue-600';
            case 'system': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Только что';
        if (minutes < 60) return `${minutes} мин. назад`;
        if (hours < 24) return `${hours} ч. назад`;
        if (days < 7) return `${days} дн. назад`;
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-t-bank-black mb-2 flex items-center space-x-3">
                            <Bell className="w-8 h-8" />
                            <span>Уведомления</span>
                        </h1>
                        <p className="text-gray-600">{notifications.filter(n => !n.isRead).length} непрочитанных</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-gray-600 hover:text-t-bank-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Прочитать все
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    filter === 'all' ? 'bg-t-bank-yellow text-t-bank-black' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Все
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    filter === 'unread' ? 'bg-t-bank-yellow text-t-bank-black' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Непрочитанные
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-t-bank-black mb-2">Нет уведомлений</h2>
                            <p className="text-gray-600">
                                {filter === 'unread' ? 'Все уведомления прочитаны' : 'У вас пока нет уведомлений'}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl border-2 p-4 transition-all ${
                                    notification.isRead ? 'border-gray-200' : 'border-t-bank-yellow bg-yellow-50'
                                }`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${getIconBg(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className={`font-bold text-t-bank-black ${!notification.isRead ? 'text-lg' : 'text-base'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Отметить как прочитанное"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;