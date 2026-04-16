import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FolderOpen, Plus, User, Clock,
    MoreVertical, CheckCircle, AlertCircle
} from 'lucide-react';
import { getUserProjects, Project } from '../../services/projectService';

const StudentProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);

    const loadProjects = () => {
        const userProjects = getUserProjects();
        // Сортировка по дате (сначала новые)
        userProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProjects(userProjects);
    };

    useEffect(() => {
        loadProjects();
        // Слушаем фокус окна, чтобы обновить данные, если студент вернулся с другой вкладки
        window.addEventListener('focus', loadProjects);
        return () => window.removeEventListener('focus', loadProjects);
    }, []);

    const getStatusBadge = (project: Project) => {
        if (project.mentorRequestStatus === 'pending') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Запрос отправлен
        </span>
            );
        }
        if (project.mentor) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ментор назначен
        </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <AlertCircle className="w-3 h-3 mr-1" />
        Нет ментора
      </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/student/dashboard')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-t-bank-black">Мои проекты</h1>
                                <p className="text-sm text-gray-600">Управление проектами и менторами</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/student/projects/create')}
                            className="bg-t-bank-yellow text-t-bank-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Новый проект</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {projects.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-t-bank-yellow w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="w-10 h-10 text-t-bank-black" />
                        </div>
                        <h2 className="text-xl font-bold text-t-bank-black mb-2">Пока нет проектов</h2>
                        <p className="text-gray-600 mb-6">Создайте первый проект и найдите ментора</p>
                        <button
                            onClick={() => navigate('/student/projects/create')}
                            className="bg-t-bank-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Создать проект
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/student/projects/${project.id}`)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="bg-t-bank-yellow p-2 rounded-lg">
                                                <FolderOpen className="w-5 h-5 text-t-bank-black" />
                                            </div>
                                            <h3 className="text-lg font-bold text-t-bank-black">{project.name}</h3>
                                            {getStatusBadge(project)}
                                        </div>
                                        <p className="text-gray-600 mb-4">{project.description}</p>

                                        <div className="flex items-center space-x-6 text-sm">
                                            {/* Логика отображения статуса ментора */}
                                            {project.mentorRequestStatus === 'pending' && project.requestedMentorName ? (
                                                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Запрос: {project.requestedMentorName}</span>
                                                </div>
                                            ) : project.mentor ? (
                                                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                    <User className="w-4 h-4" />
                                                    <span>Ментор: {project.mentor.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2 text-gray-500">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Ментор не назначен</span>
                                                </div>
                                            )}

                                            {project.teamMembers.length > 0 && (
                                                <div className="flex items-center space-x-2 text-gray-500">
                                                    <User className="w-4 h-4" />
                                                    <span>{project.teamMembers.length} участников</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentProjects;