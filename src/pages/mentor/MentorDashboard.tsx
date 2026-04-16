import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Calendar, Users, Briefcase, Bell, LogOut,
    Check, X, Clock, MessageSquare, FolderOpen, User as UserIcon
} from 'lucide-react';
import { getCurrentUser, logout, User as UserType } from '../../services/authService';
import { getMentorProjects, updateProject, getProjects, Project } from '../../services/projectService';
import { getUnreadCount } from '../../services/notificationService';

export interface MeetingRequest {
    id: string;
    projectId: string;
    projectName: string;
    studentName: string;
    studentId: string;
    date: string;
    time: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
}

const REQUESTS_KEY = 'tbank_meeting_requests';

const MentorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Вспомогательные функции для сохранения заявок
    const getSavedRequests = (): MeetingRequest[] => {
        const data = localStorage.getItem(REQUESTS_KEY);
        return data ? JSON.parse(data) : [];
    };

    const saveRequests = (reqs: MeetingRequest[]) => {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(reqs));
    };

    const loadData = () => {
        const user = getCurrentUser();
        setCurrentUser(user);

        if (user) {
            setProjects(getMentorProjects(user.id));
            setUnreadCount(getUnreadCount());
        }

        let requests = getSavedRequests();

        // Если заявок нет, создаём моковые, но привязываем их к РЕАЛЬНЫМ проектам
        if (requests.length === 0) {
            const allProjects = getProjects();
            const targetProject = allProjects[0] || {
                id: 'demo-project',
                name: 'Демо-проект (создайте реальный)',
                description: ''
            };

            requests = [
                {
                    id: 'req-1',
                    projectId: targetProject.id,
                    projectName: targetProject.name,
                    studentName: 'Алексей Смирнов',
                    studentId: 'user-456',
                    date: '2026-04-20',
                    time: '14:00',
                    message: 'Здравствуйте! Хотел бы обсудить архитектуру приложения и лучшие практики React Native.',
                    status: 'pending'
                },
                {
                    id: 'req-2',
                    projectId: targetProject.id,
                    projectName: targetProject.name,
                    studentName: 'Мария Иванова',
                    studentId: 'user-789',
                    date: '2026-04-21',
                    time: '11:00',
                    message: 'Нужна помощь с выбором алгоритмов машинного обучения для финансового прогнозирования.',
                    status: 'pending'
                }
            ];
            saveRequests(requests);
        }

        setMeetingRequests(requests);
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

    const handleAcceptRequest = (requestId: string) => {
        const request = meetingRequests.find(r => r.id === requestId);
        if (!request || !currentUser) return;

        // 1. Сохраняем назначение ментора в проект
        updateProject(request.projectId, {
            mentor: {
                id: currentUser.id,
                name: currentUser.fullName,
                position: currentUser.position || 'Ментор'
            },
            mentorRequestStatus: 'accepted'
        });

        // 2. Обновляем статус заявки в localStorage
        const updatedRequests = meetingRequests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted' as const } : r
        );
        saveRequests(updatedRequests);
        setMeetingRequests(updatedRequests);

        // 3. Обновляем список проектов на дашборде
        setProjects(getMentorProjects(currentUser.id));
    };

    const handleRejectRequest = (requestId: string) => {
        const updatedRequests = meetingRequests.map(r =>
            r.id === requestId ? { ...r, status: 'rejected' as const } : r
        );
        saveRequests(updatedRequests);
        setMeetingRequests(updatedRequests);
    };

    const mentorName = currentUser?.fullName || "Ментор";
    const position = currentUser?.position || "Senior Developer";
    const department = currentUser?.department || "Frontend";

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
                    <SidebarItem icon={<Calendar />} label="Календарь" onClick={() => navigate('/mentor/calendar')} />
                    <SidebarItem icon={<FolderOpen />} label="Мои проекты" onClick={() => navigate('/mentor/projects')} />
                    <SidebarItem icon={<UserIcon />} label="Мой профиль" onClick={() => navigate('/mentor/profile')} />
                    <SidebarItem
                        icon={<Bell />}
                        label="Уведомления"
                        badge={unreadCount > 0 ? unreadCount.toString() : undefined}
                        onClick={() => navigate('/mentor/notifications')}
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
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-t-bank-black">Добрый день, {mentorName.split(' ')[1]}!</h1>
                        <p className="text-sm text-gray-600">{position} • {department}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-t-bank-yellow rounded-full flex items-center justify-center cursor-pointer">
                            <UserIcon className="w-5 h-5 text-t-bank-black" />
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Meeting Requests Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-t-bank-black flex items-center space-x-2">
                                <Clock className="w-5 h-5" />
                                <span>Запросы на встречу</span>
                            </h2>
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                {meetingRequests.filter(r => r.status === 'pending').length} новых
              </span>
                        </div>

                        {meetingRequests.filter(r => r.status === 'pending').length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <div className="bg-t-bank-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-8 h-8 text-t-bank-black" />
                                </div>
                                <h3 className="text-lg font-bold text-t-bank-black mb-2">Нет новых запросов</h3>
                                <p className="text-gray-600 text-sm">Запросы от студентов появятся здесь</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {meetingRequests.filter(r => r.status === 'pending').map(request => (
                                    <div
                                        key={request.id}
                                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-t-bank-yellow transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 bg-t-bank-yellow rounded-full flex items-center justify-center flex-shrink-0">
                                                    <UserIcon className="w-6 h-6 text-t-bank-black" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-t-bank-black text-lg">{request.studentName}</h3>
                                                    <p className="text-gray-600 text-sm">Проект: {request.projectName}</p>
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.date).toLocaleDateString('ru-RU')}</span>
                            </span>
                                                        <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{request.time}</span>
                            </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <div className="flex items-start space-x-2">
                                                <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-gray-700 text-sm">{request.message}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="flex-1 bg-t-bank-yellow text-t-bank-black px-4 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <Check className="w-5 h-5" />
                                                <span>Принять</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                                            >
                                                <X className="w-5 h-5" />
                                                <span>Отказаться</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Projects Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-t-bank-black flex items-center space-x-2">
                                <FolderOpen className="w-5 h-5" />
                                <span>Мои проекты</span>
                            </h2>
                            <button onClick={() => navigate('/mentor/projects')} className="text-sm font-medium text-t-bank-black border border-t-bank-black px-3 py-1 rounded hover:bg-t-bank-yellow transition-colors">
                                Смотреть все
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FolderOpen className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-t-bank-black mb-2">Пока нет проектов</h3>
                                <p className="text-gray-600 text-sm">Примите запрос студентов, чтобы проект появился здесь</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {projects.map(project => (
                                    <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex items-start space-x-3 mb-3">
                                            <div className="bg-t-bank-yellow p-2 rounded-lg">
                                                <FolderOpen className="w-5 h-5 text-t-bank-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-t-bank-black">{project.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-1 text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{project.teamMembers.length} участников</span>
                                            </div>
                                            <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded text-xs">Активен</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <StatCard
                            title="Активных проектов"
                            value={projects.length.toString()}
                            icon={<FolderOpen className="w-6 h-6" />}
                            color="bg-blue-50 text-blue-600"
                        />
                        <StatCard
                            title="Ожидает ответа"
                            value={meetingRequests.filter(r => r.status === 'pending').length.toString()}
                            icon={<Clock className="w-6 h-6" />}
                            color="bg-yellow-50 text-yellow-600"
                        />
                        <StatCard
                            title="Всего студентов"
                            value={projects.reduce((acc, p) => acc + p.teamMembers.length, 0).toString()}
                            icon={<Users className="w-6 h-6" />}
                            color="bg-green-50 text-green-600"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

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

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-t-bank-black">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default MentorDashboard;