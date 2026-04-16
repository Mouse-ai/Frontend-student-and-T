import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, FolderOpen, MapPin, CheckCircle, XCircle, Trash2,
    BarChart3, Shield, LogOut, AlertTriangle, Clock, TrendingUp,
    Calendar, Star, Activity, Percent, Target
} from 'lucide-react';
import {
    getAllUsers, deleteUser, approveMentor,
    User as UserType, logout, getCurrentUser
} from '../../services/authService';
import { getProjects, deleteProject, Project } from '../../services/projectService';
import { getBookings, Booking } from '../../services/bookingService';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'space' | 'mentorship' | 'students' | 'business' | 'management'>('overview');

    const [users, setUsers] = useState<UserType[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const currentUser = getCurrentUser();

    const loadData = () => {
        setUsers(getAllUsers());
        setProjects(getProjects());
        setBookings(getBookings());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleApproveMentor = (id: string) => {
        approveMentor(id);
        loadData();
    };

    const handleDeleteUser = (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            deleteUser(id);
            loadData();
        }
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('Удалить этот проект?')) {
            deleteProject(id);
            loadData();
        }
    };

    // ===== МЕТРИКИ =====

    // 1. Метрики пространства
    const totalBookings = bookings.length;
    const activeStudents = new Set(bookings.map(b => b.userId)).size;
    const avgBookingsPerStudent = activeStudents > 0 ? (totalBookings / activeStudents).toFixed(1) : '0';

    // No-show rate (моковый, пока нет поля в Booking)
    const noShowRate = '12%';

    // Peak hours (моковые данные)
    const peakHours = '14:00 - 17:00';

    // 2. Метрики менторства
    const totalMentors = users.filter(u => u.role === 'mentor').length;
    const mentorRequests = 15; // Моковые данные
    const acceptedRequests = 8;
    const mentorConversionRate = ((acceptedRequests / mentorRequests) * 100).toFixed(0) + '%';
    const avgResponseTime = '1.5 дня';

    // 3. Метрики студентов
    const totalStudents = users.filter(u => u.role === 'student').length;
    const dau = Math.floor(totalStudents * 0.3); // 30% DAU
    const wau = Math.floor(totalStudents * 0.6); // 60% WAU
    const mau = totalStudents;
    const studentsWithMentor = Math.floor(totalStudents * 0.25);
    const mentorRequestRate = ((studentsWithMentor / totalStudents) * 100).toFixed(0) + '%';

    // 4. Бизнес-метрики
    const csat = '4.6/5.0';
    const uniqueStudentsRate = '18%';
    const incidents = 2;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="bg-t-bank-black p-2 rounded-lg">
                            <Shield className="w-5 h-5 text-t-bank-yellow" />
                        </div>
                        <span className="font-bold text-lg text-t-bank-black">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem
                        icon={<BarChart3 />}
                        label="Обзор"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={<MapPin />}
                        label="Пространство"
                        active={activeTab === 'space'}
                        onClick={() => setActiveTab('space')}
                    />
                    <SidebarItem
                        icon={<Users />}
                        label="Менторство"
                        active={activeTab === 'mentorship'}
                        onClick={() => setActiveTab('mentorship')}
                    />
                    <SidebarItem
                        icon={<Activity />}
                        label="Студенты"
                        active={activeTab === 'students'}
                        onClick={() => setActiveTab('students')}
                    />
                    <SidebarItem
                        icon={<TrendingUp />}
                        label="Бизнес-метрики"
                        active={activeTab === 'business'}
                        onClick={() => setActiveTab('business')}
                    />
                    <SidebarItem
                        icon={<FolderOpen />}
                        label="Управление"
                        active={activeTab === 'management'}
                        onClick={() => setActiveTab('management')}
                        badge={users.filter(u => u.role === 'mentor' && !u.isApproved).length.toString()}
                    />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Выйти</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-t-bank-black">
                        {activeTab === 'overview' && 'Обзор метрик'}
                        {activeTab === 'space' && 'Метрики использования пространства'}
                        {activeTab === 'mentorship' && 'Метрики менторства'}
                        {activeTab === 'students' && 'Метрики студентов'}
                        {activeTab === 'business' && 'Бизнес-метрики'}
                        {activeTab === 'management' && 'Управление'}
                    </h1>
                    <div className="text-sm text-gray-500">
                        Администратор: {currentUser?.email}
                    </div>
                </div>

                {/* TAB: Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Всего студентов" value={totalStudents} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                            <StatCard title="Активных сегодня" value={dau} icon={<Activity className="text-green-600" />} color="bg-green-50" />
                            <StatCard title="Бронирований" value={totalBookings} icon={<MapPin className="text-purple-600" />} color="bg-purple-50" />
                            <StatCard title="Проектов" value={projects.length} icon={<FolderOpen className="text-orange-600" />} color="bg-orange-50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                                    <Target className="w-5 h-5 text-t-bank-yellow" />
                                    <span>Ключевые показатели</span>
                                </h3>
                                <div className="space-y-4">
                                    <MetricRow label="Загрузка хабов" value="72%" target="60-80%" />
                                    <MetricRow label="Конверсия менторства" value={mentorConversionRate} target=">50%" />
                                    <MetricRow label="CSAT" value={csat} target=">4.5" />
                                    <MetricRow label="No-show rate" value={noShowRate} target="<20%" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-t-bank-yellow" />
                                    <span>Активность</span>
                                </h3>
                                <div className="space-y-4">
                                    <MetricRow label="Пиковые часы" value={peakHours} />
                                    <MetricRow label="Среднее время ответа ментора" value={avgResponseTime} target="<2 дней" />
                                    <MetricRow label="Запросов менторства" value={mentorRequests.toString()} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Space Metrics */}
                {activeTab === 'space' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Общая загрузка" value="72%" subtitle="Цель: 60-80%" icon={<MapPin className="text-blue-600" />} color="bg-blue-50" />
                            <StatCard title="No-show rate" value={noShowRate} subtitle="Цель: <20%" icon={<XCircle className="text-red-600" />} color="bg-red-50" />
                            <StatCard title="Средняя длительность" value="3.5 часа" icon={<Clock className="text-green-600" />} color="bg-green-50" />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Загрузка по типам зон</h3>
                            <div className="space-y-4">
                                <ZoneLoadBar label="Коворкинг" value={85} color="bg-blue-500" />
                                <ZoneLoadBar label="Переговорные" value={92} color="bg-purple-500" />
                                <ZoneLoadBar label="Тихие зоны" value={45} color="bg-green-500" />
                                <ZoneLoadBar label="Акустические кабинки" value={68} color="bg-orange-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Часы пиковой нагрузки</h3>
                            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                Тепловая карта по дням и часам (в разработке)
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Mentorship Metrics */}
                {activeTab === 'mentorship' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Всего менторов" value={totalMentors} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                            <StatCard title="Запросов" value={mentorRequests} icon={<Activity className="text-yellow-600" />} color="bg-yellow-50" />
                            <StatCard title="Конверсия" value={mentorConversionRate} icon={<TrendingUp className="text-green-600" />} color="bg-green-50" />
                            <StatCard title="Ср. время ответа" value={avgResponseTime} icon={<Clock className="text-purple-600" />} color="bg-purple-50" />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Воронка менторства</h3>
                            <div className="space-y-3">
                                <FunnelRow stage="Запросов отправлено" value={mentorRequests} percent="100%" />
                                <FunnelRow stage="Принято ментором" value={acceptedRequests} percent={((acceptedRequests/mentorRequests)*100).toFixed(0) + '%'} />
                                <FunnelRow stage="Состоялось встреч" value={6} percent="40%" />
                                <FunnelRow stage="Постоянное менторство" value={4} percent="27%" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Причины отказов</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-700">Не подходит стек</span>
                                    <span className="font-bold text-gray-900">45%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-700">Нет времени</span>
                                    <span className="font-bold text-gray-900">30%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-700">Не в моём городе</span>
                                    <span className="font-bold text-gray-900">25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Student Metrics */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="DAU" value={dau} subtitle={`${((dau/mau)*100).toFixed(0)}% от MAU`} icon={<Activity className="text-blue-600" />} color="bg-blue-50" />
                            <StatCard title="WAU" value={wau} subtitle={`${((wau/mau)*100).toFixed(0)}% от MAU`} icon={<Calendar className="text-green-600" />} color="bg-green-50" />
                            <StatCard title="MAU" value={mau} icon={<Users className="text-purple-600" />} color="bg-purple-50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Активность студентов</h3>
                                <div className="space-y-4">
                                    <MetricRow label="Среднее кол-во броней/мес" value={avgBookingsPerStudent} />
                                    <MetricRow label="Запросили ментора" value={`${studentsWithMentor} (${mentorRequestRate})`} />
                                    <MetricRow label="Регистрации → первая бронь" value="4.2 дня" target="<7 дней" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Удержание</h3>
                                <div className="space-y-4">
                                    <MetricRow label="Retention после менторства" value="68%" target=">60%" />
                                    <MetricRow label="Регуляры (4+ брони)" value="34%" />
                                    <MetricRow label="Новые (1-3 брони)" value="48%" />
                                    <MetricRow label="Спящие" value="18%" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Business Metrics */}
                {activeTab === 'business' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Cost per active student" value="₽2,450" icon={<TrendingUp className="text-red-600" />} color="bg-red-50" />
                            <StatCard title="Уникальные студенты" value={uniqueStudentsRate} subtitle="от всех студентов вузов" icon={<Percent className="text-blue-600" />} color="bg-blue-50" />
                            <StatCard title="CSAT" value={csat} subtitle="Цель: >4.5" icon={<Star className="text-yellow-600" />} color="bg-yellow-50" />
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4">Интеграционные метрики (с Т-Образованиями)</h3>
                            <div className="space-y-4">
                                <MetricRow label="CTR на мероприятия" value="12.5%" description="Клики из сервиса → регистрация" />
                                <MetricRow label="Доля с Т-Образований" value="28%" description="Сделали бронь после регистрации" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span>Инциденты</span>
                            </h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="font-medium text-red-900">Двойное бронирование</p>
                                    <p className="text-sm text-red-700">2 случая за последнюю неделю</p>
                                </div>
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="font-medium text-yellow-900">Жалобы на менторов</p>
                                    <p className="text-sm text-yellow-700">1 жалоба (не явился на встречу)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: Management */}
                {activeTab === 'management' && (
                    <div className="space-y-6">
                        {/* Mentors Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-bold text-lg">Менторы</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500">ФИО</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Почта</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Должность</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Действия</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {users.filter(u => u.role === 'mentor').map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 font-medium">{user.fullName}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.position} / {user.department}</td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            {!user.isApproved ? (
                                                <button
                                                    onClick={() => handleApproveMentor(user.id)}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200 flex items-center space-x-1"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Одобрить</span>
                                                </button>
                                            ) : (
                                                <span className="text-green-600 text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Подтвержден
                          </span>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-bold text-lg">Все пользователи</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500">Роль</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">ФИО</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Почта</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Действия</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-black text-yellow-400' : user.role === 'mentor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{user.fullName}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Projects Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-bold text-lg">Проекты</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500">Название</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Владелец</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Статус</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Действия</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {projects.map(project => (
                                    <tr key={project.id}>
                                        <td className="px-6 py-4 font-medium">{project.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{project.ownerName}</td>
                                        <td className="px-6 py-4 text-gray-600">{project.status}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Helper Components
interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    badge?: string;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, badge, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${active ? 'bg-t-bank-yellow text-t-bank-black font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        <div className="flex items-center space-x-3">
            {icon}
            <span>{label}</span>
        </div>
        {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
);

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-t-bank-black">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

interface MetricRowProps {
    label: string;
    value: string;
    target?: string;
    description?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, target, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
            <p className="font-medium text-gray-900">{label}</p>
            {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <div className="text-right">
            <p className="font-bold text-t-bank-black text-lg">{value}</p>
            {target && <p className="text-xs text-gray-500">Цель: {target}</p>}
        </div>
    </div>
);

interface ZoneLoadBarProps {
    label: string;
    value: number;
    color: string;
}

const ZoneLoadBar: React.FC<ZoneLoadBarProps> = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-bold text-gray-900">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

interface FunnelRowProps {
    stage: string;
    value: number;
    percent: string;
}

const FunnelRow: React.FC<FunnelRowProps> = ({ stage, value, percent }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-gray-700">{stage}</span>
        <div className="flex items-center space-x-3">
            <span className="font-bold text-t-bank-black">{value}</span>
            <span className="text-sm text-gray-500">{percent}</span>
        </div>
    </div>
);

export default AdminDashboard;