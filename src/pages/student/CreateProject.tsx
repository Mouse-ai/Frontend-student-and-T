import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus, Plus, X, Users } from 'lucide-react';
import { createProject } from '../../services/projectService';

interface TeamMember {
    id: string;
    name: string;
    role: string;
}

const CreateProject: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        direction: '',
    });

    const [members, setMembers] = useState<TeamMember[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');
    const [loading, setLoading] = useState(false);

    const addMember = () => {
        if (!newMemberName.trim() || !newMemberRole.trim()) return;

        setMembers([
            ...members,
            { id: Date.now().toString(), name: newMemberName, role: newMemberRole }
        ]);
        setNewMemberName('');
        setNewMemberRole('');
    };

    const removeMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newProject = createProject({
                name: formData.name,
                description: formData.description,
                direction: formData.direction,
                teamMembers: members,
            });

            // Переходим к поиску ментора и передаем ID созданного проекта
            navigate(`/student/mentors?projectId=${newProject.id}`);
        } catch (error) {
            console.error('Ошибка создания проекта:', error);
            alert('Не удалось создать проект');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/student/projects')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад к проектам</span>
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-t-bank-yellow p-3 rounded-lg">
                            <FolderPlus className="w-8 h-8 text-t-bank-black" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-t-bank-black">Создание проекта</h1>
                            <p className="text-gray-600">Расскажите о вашем проекте и соберите команду</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Название проекта *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                placeholder="Например: Мобильное приложение для банка"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Направление *
                            </label>
                            <select
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none bg-white"
                                value={formData.direction}
                                onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                            >
                                <option value="">Выберите направление</option>
                                <option value="frontend">Frontend разработка</option>
                                <option value="backend">Backend разработка</option>
                                <option value="mobile">Mobile разработка</option>
                                <option value="analytics">Аналитика данных</option>
                                <option value="design">Дизайн</option>
                                <option value="management">Проектный менеджмент</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Описание проекта *
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none resize-none"
                                placeholder="Опишите цели проекта, технологии, ожидаемый результат..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-t-bank-black mb-4 flex items-center space-x-2">
                                <Users className="w-5 h-5" />
                                <span>Команда проекта</span>
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                    placeholder="Имя сокомандника"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="w-full sm:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                    placeholder="Роль (например, Дизайнер)"
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addMember}
                                    className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-1"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="sm:hidden">Добавить</span>
                                </button>
                            </div>

                            {members.length > 0 && (
                                <div className="space-y-2">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-t-bank-yellow rounded-full flex items-center justify-center text-t-bank-black font-bold text-xs">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-t-bank-black text-sm">{member.name}</p>
                                                    <p className="text-xs text-gray-500">{member.role}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMember(member.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/student/projects')}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Создание...' : 'Создать и найти ментора'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateProject;