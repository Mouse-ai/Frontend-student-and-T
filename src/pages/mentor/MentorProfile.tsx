import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, User, Briefcase, Award, MapPin,
    Plus, X, Check
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';

const MentorProfile: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);
    const [newSkill, setNewSkill] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Загружаем данные (в реальности это из API)
            setBio('Senior Frontend Developer в Т-Банке. Люблю делиться знаниями и помогать студентам расти.');
        }
    }, []);

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/mentor/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/mentor/dashboard')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад в дашборд</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cover Image Placeholder */}
                    <div className="h-32 bg-t-bank-yellow relative">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                    <User className="w-12 h-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-14 px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-t-bank-black">{currentUser?.fullName || 'Ментор'}</h1>
                                <p className="text-gray-600">{currentUser?.position || 'Developer'} • {currentUser?.department || 'IT'}</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-t-bank-yellow text-t-bank-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Статус доступности */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {isAvailable ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-t-bank-black">Статус для студентов</p>
                                        <p className="text-sm text-gray-600">
                                            {isAvailable ? 'Вы появляетесь в поиске менторов' : 'Сейчас вы не принимаете новых студентов'}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAvailable}
                                        onChange={() => setIsAvailable(!isAvailable)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-t-bank-black"></div>
                                </label>
                            </div>

                            {/* О себе */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">О себе</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none resize-none"
                                    placeholder="Расскажите о своем опыте и чем вы можете помочь..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            {/* Навыки */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Навыки и технологии</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {skill}
                                            <button onClick={() => removeSkill(skill)} className="ml-2 text-blue-400 hover:text-blue-600">
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                        placeholder="Добавить навык (например, Python)"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                    />
                                    <button
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MentorProfile;