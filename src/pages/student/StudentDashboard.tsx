import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Calendar, Briefcase, Bell, LogOut,
    MapPin, User, FolderOpen, Plus, AlertCircle, Clock, CheckCircle
} from 'lucide-react';
import { getCurrentUser, logout, User as UserType } from '../../services/authService';
import { getUserProjects, Project } from '../../services/projectService';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);

        // Загружаем проекты пользователя
        const userProjects = getUserProjects();
        setProjects(userProjects.slice(0, 3)); // Показываем только 3 последних
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const studentName = currentUser?.fullName || "Студент";
    const university = currentUser?.university || "";

    const upcomingMeetings = [
        { id: 1, time: "14:00", title: "Встреча с ментором (Frontend)", location: "IT-Хаб Москва" },
        { id: 2, time: "16:30", title: "Лекция по AI", location: "Онлайн" },
    ];

    const getStatusBadge = (project: Project) => {
        if (project.mentorRequestStatus === 'pending') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Запрос отправлен
        </span>
            );
        }
        if (project.mentor) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ментор назначен
        </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <AlertCircle className="w-3 h-3 mr-1" />
        Нет ментора
      </span>
        );
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
                    <SidebarItem icon={<Calendar />} label="Календарь" onClick={() => {}} />
                    <SidebarItem icon={<MapPin />} label="Бронирование мест" onClick={() => {}} />
                    <SidebarItem icon={<FolderOpen />} label="Мои проекты" onClick={() => navigate('/student/projects')} />
                    <SidebarItem icon={<Bell />} label="Уведомления" badge="2" onClick={() => {}} />
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
                        <div className="w-10 h-10 bg-t-bank-yellow rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-t-bank-black" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <ActionCard
                            title="Забронировать место"
                            desc="Найди свободное место в хабе"
                            icon={<MapPin className="w-8 h-8" />}
                            color="bg-blue-50 text-blue-600"
                            onClick={() => {}}
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="bg-t-bank-yellow p-2 rounded-lg">
                                                <FolderOpen className="w-5 h-5 text-t-bank-black" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <p className="font-bold text-t-bank-black">{project.name}</p>
                                                    {getStatusBadge(project)}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                                                {project.mentorRequestStatus === 'pending' && project.requestedMentorName && (
                                                    <p className="text-xs text-yellow-600 mt-1 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Запрос: {project.requestedMentorName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {project.teamMembers.length > 0 && (
                                            <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                                <User className="w-4 h-4" />
                                                <span>{project.teamMembers.length}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Schedule */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-t-bank-black">Ближайшие события</h2>
                        <div className="space-y-4">
                            {upcomingMeetings.map(meeting => (
                                <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-t-bank-yellow px-3 py-1 rounded font-bold text-sm">
                                            {meeting.time}
                                        </div>
                                        <div>
                                            <p className="font-bold text-t-bank-black">{meeting.title}</p>
                                            <p className="text-sm text-gray-500">{meeting.location}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-t-bank-black border border-t-bank-black px-3 py-1 rounded hover:bg-t-bank-yellow transition-colors">
                                        Подробнее
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

// Helper Components for Dashboard
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