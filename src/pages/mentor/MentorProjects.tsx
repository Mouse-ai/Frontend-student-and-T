import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { getMentorProjects, Project } from '../../services/projectService';

const MentorProjects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            // Загружаем проекты, где этот ментор назначен
            const mentorProjects = getMentorProjects(user.id);
            setProjects(mentorProjects);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <button onClick={() => navigate('/mentor/dashboard')} className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад в дашборд</span>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-t-bank-black mb-6 flex items-center space-x-2">
                    <FolderOpen className="w-6 h-6" />
                    <span>Мои проекты</span>
                </h1>

                {projects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-t-bank-black mb-2">Пока нет проектов</h2>
                        <p className="text-gray-600">Принимайте запросы студентов, чтобы проекты появились здесь.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-t-bank-yellow p-2 rounded-lg">
                                            <FolderOpen className="w-5 h-5 text-t-bank-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-t-bank-black text-lg">{project.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project.teamMembers.length} участников</span>
                        </span>
                                                <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    Активен
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MentorProjects;