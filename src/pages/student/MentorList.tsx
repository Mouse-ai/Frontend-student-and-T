import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, Users, Filter, Star, MapPin,
    Briefcase, ChevronRight
} from 'lucide-react';

interface Mentor {
    id: string;
    name: string;
    position: string;
    department: string;
    skills: string[];
    rating: number;
    projectsCount: number;
    location: string;
    avatar?: string;
}

const MentorList: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');

    // Моковые данные менторов
    const mentors: Mentor[] = [
        {
            id: '1',
            name: 'Анна Петрова',
            position: 'Senior Frontend Developer',
            department: 'Разработка',
            skills: ['React', 'TypeScript', 'UI/UX'],
            rating: 4.9,
            projectsCount: 12,
            location: 'Москва',
        },
        {
            id: '2',
            name: 'Иван Сидоров',
            position: 'Data Scientist',
            department: 'Аналитика',
            skills: ['Python', 'Machine Learning', 'SQL'],
            rating: 4.8,
            projectsCount: 8,
            location: 'Санкт-Петербург',
        },
        {
            id: '3',
            name: 'Мария Козлова',
            position: 'Product Manager',
            department: 'Продукт',
            skills: ['Product Management', 'Agile', 'Analytics'],
            rating: 4.7,
            projectsCount: 15,
            location: 'Москва',
        },
    ];

    const allSkills = ['React', 'TypeScript', 'Python', 'Machine Learning', 'SQL', 'UI/UX', 'Product Management'];

    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSkill = selectedSkill ? mentor.skills.includes(selectedSkill) : true;
        return matchesSearch && matchesSkill;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/student/projects')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-t-bank-black">Поиск ментора</h1>
                                <p className="text-sm text-gray-600">Выберите специалиста для вашего проекта</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск по имени или позиции..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none bg-white appearance-none"
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                            >
                                <option value="">Все навыки</option>
                                {allSkills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Mentors List */}
                <div className="grid gap-6">
                    {filteredMentors.map(mentor => (
                        <div
                            key={mentor.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="w-16 h-16 bg-t-bank-yellow rounded-full flex items-center justify-center flex-shrink-0">
                                        <Users className="w-8 h-8 text-t-bank-black" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-bold text-t-bank-black">{mentor.name}</h3>
                                            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-0.5 rounded">
                                                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                                                <span className="text-sm font-bold text-yellow-700">{mentor.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-2">{mentor.position}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center space-x-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{mentor.department}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{mentor.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{mentor.projectsCount} проектов</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                >
                          {skill}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        // Получаем projectId из URL
                                        const params = new URLSearchParams(window.location.search);
                                        const projectId = params.get('projectId');
                                        // Переходим, сохраняя projectId
                                        navigate(`/student/mentors/${mentor.id}/request?projectId=${projectId}`);
                                    }}
                                    className="ml-4 bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                                >
                                    <span>Выбрать</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMentors.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-t-bank-black mb-2">Менторы не найдены</h2>
                        <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MentorList;