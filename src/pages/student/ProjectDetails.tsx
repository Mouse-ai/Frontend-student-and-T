import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Calendar, Star, AlertCircle, Clock } from 'lucide-react';
import { getProjectById, Project } from '../../services/projectService';

const ProjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (projectId) {
            const foundProject = getProjectById(projectId);
            setProject(foundProject || null);
        }
    }, [projectId]);

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-t-bank-black mb-4">Проект не найден</h2>
                    <button
                        onClick={() => navigate('/student/projects')}
                        className="bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                        Вернуться к проектам
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <button onClick={() => navigate('/student/projects')} className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black">
                        <ArrowLeft className="w-5 h-5" />
                        <span>К проектам</span>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-t-bank-black mb-2">{project.name}</h1>
                        <p className="text-gray-600">{project.direction} • {project.createdAt.split('T')[0]}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                        project.status === 'active' ? 'bg-green-100 text-green-700' :
                            project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                    }`}>
            {project.status === 'active' ? 'Активен' : project.status === 'pending' ? 'Ожидание' : 'Завершён'}
          </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-t-bank-black mb-4">Описание проекта</h2>
                            <p className="text-gray-700 leading-relaxed">{project.description}</p>
                        </div>

                        {project.teamMembers.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-t-bank-black mb-4">Команда проекта</h2>
                                <div className="space-y-3">
                                    {project.teamMembers.map(member => (
                                        <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-t-bank-yellow rounded-full flex items-center justify-center text-t-bank-black font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-t-bank-black">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Логика отображения статуса ментора */}
                        {project.mentor ? (
                            // Если ментор уже назначен (accepted)
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-t-bank-black mb-4">Ментор (Куратор)</h2>
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-12 h-12 bg-t-bank-yellow rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-t-bank-black" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-t-bank-black">{project.mentor.name}</p>
                                        <p className="text-sm text-gray-500">{project.mentor.position}</p>
                                    </div>
                                    <button className="ml-auto bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50">
                                        <MessageSquare className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        ) : project.mentorRequestStatus === 'pending' ? (
                            // Если запрос отправлен и ждем ответа
                            <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <Clock className="w-6 h-6 text-yellow-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-yellow-800 mb-2">Запрос отправлен</h2>
                                        <p className="text-yellow-700 mb-4">
                                            Вы отправили запрос ментору <strong>{project.requestedMentorName}</strong>.
                                            Ожидайте подтверждения встречи.
                                        </p>
                                        {project.meetingDate && (
                                            <div className="bg-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 border border-yellow-200">
                                                <Calendar className="w-4 h-4 text-yellow-600" />
                                                <span className="text-sm font-medium text-yellow-800">Желаемая дата: {project.meetingDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Если ментора нет и запросов нет
                            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-t-bank-black mb-2">Ментор не назначен</h2>
                                <p className="text-gray-600 mb-6">Чтобы получить куратора, отправьте запрос на первую встречу.</p>
                                <button
                                    onClick={() => navigate('/student/mentors')}
                                    className="bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                                >
                                    Найти ментора
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-500 mb-4 uppercase text-xs tracking-wide">Информация</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-600">Создан</span>
                                    <span className="font-medium text-t-bank-black">{new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-600">Владелец</span>
                                    <span className="font-medium text-t-bank-black">{project.ownerName}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-600">Участников</span>
                                    <span className="font-medium text-t-bank-black">{project.teamMembers.length}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-500 mb-4 uppercase text-xs tracking-wide">Действия</h3>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-t-bank-black font-medium flex items-center space-x-2 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span>Календарь проекта</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-red-600 font-medium flex items-center space-x-2">
                                <Star className="w-4 h-4" />
                                <span>Закрыть проект</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;