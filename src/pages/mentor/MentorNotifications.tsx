import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, Trash2, Clock } from 'lucide-react';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification, Notification } from '../../services/notificationService';

const MentorNotifications: React.FC = () => {
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

    const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Только что';
        if (minutes < 60) return `${minutes} мин. назад`;
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button onClick={() => navigate('/mentor/dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад в дашборд</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-t-bank-black flex items-center space-x-2">
                        <Bell className="w-6 h-6" />
                        <span>Уведомления</span>
                    </h1>
                    <div className="flex items-center space-x-3">
                        <button onClick={handleMarkAllAsRead} className="text-sm text-gray-600 hover:text-t-bank-black px-3 py-1.5 rounded hover:bg-gray-100">
                            Прочитать все
                        </button>
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-t-bank-yellow text-t-bank-black font-medium' : 'text-gray-600'}`}>Все</button>
                            <button onClick={() => setFilter('unread')} className={`px-3 py-1 rounded text-sm ${filter === 'unread' ? 'bg-t-bank-yellow text-t-bank-black font-medium' : 'text-gray-600'}`}>Непрочитанные</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Нет уведомлений</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notif => (
                            <div key={notif.id} className={`bg-white rounded-xl border-2 p-4 flex items-start space-x-4 transition-all ${notif.isRead ? 'border-gray-200' : 'border-t-bank-yellow bg-yellow-50'}`}>
                                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 mt-1">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`font-bold text-t-bank-black ${!notif.isRead ? 'text-base' : 'text-sm'}`}>{notif.title}</p>
                                            <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            {!notif.isRead && (
                                                <button onClick={() => handleMarkAsRead(notif.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(notif.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTime(notif.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default MentorNotifications;