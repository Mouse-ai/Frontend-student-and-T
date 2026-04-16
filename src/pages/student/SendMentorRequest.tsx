import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Calendar, MessageSquare } from 'lucide-react';

const SendMentorRequest: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        message: '',
        meetingDate: '',
        meetingTime: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate('/student/projects');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/student/mentors')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад к менторам</span>
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-t-bank-yellow p-3 rounded-lg">
                            <Send className="w-8 h-8 text-t-bank-black" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-t-bank-black">Запрос ментору</h1>
                            <p className="text-gray-600">Отправьте запрос на менторство</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-t-bank-black mb-2">Информация о менторе</h3>
                            <p className="text-gray-600">Анна Петрова - Senior Frontend Developer</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Проект
                            </label>
                            <div className="bg-t-bank-yellow/20 border border-t-bank-yellow px-4 py-3 rounded-lg">
                                <p className="font-medium text-t-bank-black">Разработка мобильного приложения</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Сообщение ментору
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none resize-none"
                                placeholder="Расскажите о проекте и почему вы хотите работать с этим ментором..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Желаемая дата встречи
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                    value={formData.meetingDate}
                                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Желаемое время
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none bg-white"
                                    value={formData.meetingTime}
                                    onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
                                >
                                    <option value="">Выберите время</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-blue-900 mb-1">Как это работает?</h4>
                                    <p className="text-sm text-blue-700">
                                        После отправки запроса ментор получит уведомление.
                                        Если он согласится, вы сможете назначить первую встречу
                                        и обсудить детали проекта.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/student/mentors')}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                <Send className="w-5 h-5" />
                                <span>{loading ? 'Отправка...' : 'Отправить запрос'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SendMentorRequest;