import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Calendar, Briefcase, Bell, LogOut,
    MapPin, User, FolderOpen, Plus, AlertCircle, Clock, CheckCircle,
    Sparkles, ArrowRight
} from 'lucide-react';
import { getCurrentUser, logout, User as UserType } from '../../services/authService';
import { getUserProjects, Project } from '../../services/projectService';
import { getUnreadCount } from '../../services/notificationService';
import { getUserBookings, Booking } from '../../services/bookingService';

interface DashboardEvent {
    id: string;
    type: 'booking' | 'project';
    time: string;
    date: string;
    title: string;
    location: string;
    rawDate: Date;
}

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState<DashboardEvent[]>([]);

    // Моковые данные официальных мероприятий Т-Банка
    const T_BANK_EVENTS = [
        {
            id: 'tb-1',
            title: 'Хакатон: FinTech Solutions 2026',
            date: '25–27 Апреля 2026',
            type: 'Хакатон',
            description: '48 часов кода, менторства и призов. Формируй команду и создавай продукт для банка.',
            color: 'bg-purple-50 border-purple-200 text-purple-700'
        },
        {
            id: 'tb-2',
            title: 'Воркшоп: AI в продуктовых решениях',
            date: '20 Мая 2026',
            type: 'Воркшоп',
            description: 'Как внедрять LLM в реальные кейсы. Спикер: Head of AI Direction.',
            color: 'bg-blue-50 border-blue-200 text-blue-700'
        },
        {
            id: 'tb-3',
            title: 'Нетворкинг: Вечер с экспертами',
            date: '15 Мая 2026',
            type: 'Нетворкинг',
            description: 'Неформальная встреча с лидами направлений. Живое общение и обмен опытом.',
            color: 'bg-green-50 border-green-200 text-green-700'
        }
    ];

    const loadData = () => {
        const user = getCurrentUser();
        setCurrentUser(user);

        // 1. Проекты
        const userProjects = getUserProjects();
        userProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProjects(userProjects.slice(0, 3));

        // 2. Уведомления
        setUnreadCount(getUnreadCount());

        // 3. События (Бронирования + Встречи по проектам)
        const bookings = getUserBookings();
        const now = new Date();
        const events: DashboardEvent[] = [];

        // Бронирования
        bookings.forEach((b: Booking) => {
            const startTime = b.timeSlot.split(' - ')[0];
            const eventDate = new Date(`${b.date}T${startTime}:00`);
            if (eventDate >= now) {
                events.push({
                    id: `book-${b.id}`,
                    type: 'booking',
                    time: b.timeSlot,
                    date: b.date,
                    title: `Бронирование: ${b.seatNumber}`,
                    location: `IT-Хаб Т-Банка`,
                    rawDate: eventDate
                });
            }
        });

        // Встречи по проектам
        userProjects.forEach((p: Project) => {
            if (p.meetingDate) {
                const [dateStr, timeStr] = p.meetingDate.split(' ');
                if (dateStr && timeStr) {
                    const eventDate = new Date(`${dateStr}T${timeStr}:00`);
                    if (eventDate >= now) {
                        events.push({
                            id: `proj-${p.id}`,
                            type: 'project',
                            time: timeStr,
                            date: dateStr,
                            title: `Встреча по проекту`,
                            location: p.name,
                            rawDate: eventDate
                        });
                    }
                }
            }
        });

        // Сортируем по дате
        events.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
        setUpcomingEvents(events);
    };

    useEffect(() => {
        loadData();
        window.addEventListener('focus', loadData);
        return () => window.removeEventListener('focus', loadData);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentName = currentUser?.fullName || "Студент";
    const university = currentUser?.university || "";

    const getStatusBadge = (project: Project) => {
        if (project.mentorRequestStatus === 'pending') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Запрос отправлен
        </span>
            );
        }
        if (project.mentor) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ментор назначен
        </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Нет ментора
      </span>
        );
    };

    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
        return new Date(dateStr).toLocaleDateString('ru-RU', options);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="bg-t-bank-yellow p-2 rounded-lg">
                            <Briefcase className="w-5 h-5 text-t-bank-black" />
                        </div>
                        <span className="font-bold text-lg">Студент и Т</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem icon={<Home />} label="Главная" active />
                    <SidebarItem icon={<Calendar />} label="Календарь" onClick={() => navigate('/student/calendar')} />
                    <SidebarItem icon={<MapPin />} label="Бронирование мест" onClick={() => navigate('/student/booking')} />
                    <SidebarItem icon={<FolderOpen />} label="Мои проекты" onClick={() => navigate('/student/projects')} />
                    <SidebarItem
                        icon={<Bell />}
                        label="Уведомления"
                        badge={unreadCount > 0 ? unreadCount.toString() : undefined}
                        onClick={() => navigate('/student/notifications')}
                    />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Выйти</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-t-bank-black">Привет, {studentName.split(' ')[1]}!</h1>
                        <p className="text-sm text-gray-600">{university}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-t-bank-yellow rounded-full flex items-center justify-center cursor-pointer hover:ring-2 ring-offset-2 ring-t-bank-yellow transition-all">
                            <User className="w-5 h-5 text-t-bank-black" />
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard
                            title="Забронировать место"
                            desc="Найди свободное место в хабе"
                            icon={<MapPin className="w-8 h-8" />}
                            color="bg-blue-50 text-blue-600"
                            onClick={() => navigate('/student/booking')}
                        />
                        <ActionCard
                            title="Мои проекты"
                            desc="Участвуй в проектах с менторами"
                            icon={<FolderOpen className="w-8 h-8" />}
                            color="bg-green-50 text-green-600"
                            onClick={() => navigate('/student/projects')}
                        />
                        <ActionCard
                            title="Новый проект"
                            desc="Создай запрос на менторство"
                            icon={<Plus className="w-8 h-8" />}
                            color="bg-purple-50 text-purple-600"
                            onClick={() => navigate('/student/projects/create')}
                        />
                    </div>

                    {/* My Projects Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-t-bank-black">Мои проекты</h2>
                            <button
                                onClick={() => navigate('/student/projects')}
                                className="text-sm font-medium text-t-bank-black border border-t-bank-black px-3 py-1 rounded hover:bg-t-bank-yellow transition-colors"
                            >
                                Смотреть все
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <div className="bg-t-bank-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FolderOpen className="w-8 h-8 text-t-bank-black" />
                                </div>
                                <h3 className="text-lg font-bold text-t-bank-black mb-2">Пока нет проектов</h3>
                                <p className="text-gray-600 mb-4 text-sm">Создайте первый проект и найдите ментора</p>
                                <button
                                    onClick={() => navigate('/student/projects/create')}
                                    className="bg-t-bank-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Создать проект
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <div
                                        key={project.id}
                                        onClick={() => navigate(`/student/projects/${project.id}`)}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                                            <div className="bg-t-bank-yellow p-2 rounded-lg flex-shrink-0">
                                                <FolderOpen className="w-5 h-5 text-t-bank-black" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <p className="font-bold text-t-bank-black truncate">{project.name}</p>
                                                    {getStatusBadge(project)}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                                                {project.mentorRequestStatus === 'pending' && project.requestedMentorName && (
                                                    <p className="text-xs text-yellow-600 mt-1 flex items-center font-medium">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Запрос: {project.requestedMentorName}
                                                    </p>
                                                )}
                                                {project.mentor && (
                                                    <p className="text-xs text-green-600 mt-1 flex items-center font-medium">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Ментор: {project.mentor.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {project.teamMembers.length > 0 && (
                                            <div className="flex items-center space-x-1 text-gray-500 text-sm ml-4">
                                                <User className="w-4 h-4" />
                                                <span>{project.teamMembers.length}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events Section (Dynamic) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-t-bank-black">Ближайшие события</h2>
                            <button
                                onClick={() => navigate('/student/calendar')}
                                className="text-sm font-medium text-t-bank-black border border-t-bank-black px-3 py-1 rounded hover:bg-t-bank-yellow transition-colors flex items-center space-x-1"
                            >
                                <span>Календарь</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg">
                                <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Нет запланированных событий</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className={`px-3 py-1 rounded font-bold text-sm ${event.type === 'booking' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {event.time}
                                            </div>
                                            <div>
                                                <p className="font-bold text-t-bank-black">{event.title}</p>
                                                <p className="text-sm text-gray-500">{event.location} • {formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-t-bank-black border border-t-bank-black px-3 py-1 rounded hover:bg-t-bank-yellow transition-colors">
                                            Подробнее
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* T-Bank Official Events Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-t-bank-yellow p-2 rounded-lg">
                                <Sparkles className="w-5 h-5 text-t-bank-black" />
                            </div>
                            <h2 className="text-xl font-bold text-t-bank-black">Активные мероприятия Т-Банка</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {T_BANK_EVENTS.map(ev => (
                                <div
                                    key={ev.id}
                                    className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col ${ev.color.replace('text-', 'border-').split(' ')[1]} ${ev.color.split(' ')[0]}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide bg-white/70">
                      {ev.type}
                    </span>
                                        <span className="text-xs font-medium opacity-70">{ev.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-t-bank-black mb-2">{ev.title}</h3>
                                    <p className="text-sm opacity-80 mb-6 flex-1">{ev.description}</p>
                                    <button className="w-full py-2.5 rounded-lg font-bold bg-t-bank-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                                        <span>Подробнее</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${active ? 'bg-t-bank-yellow text-t-bank-black font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
);

interface ActionCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, desc, icon, color, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="font-bold text-lg mb-1 text-t-bank-black">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
    </div>
);

export default StudentDashboard;