import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Добавили useSearchParams
import { ArrowLeft, Clock, Check, Users } from 'lucide-react';
import { updateProject } from '../../services/projectService'; // Импортируем сервис

const MentorAvailability: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId'); // Получаем ID проекта из URL

    const mentor = {
        name: 'Анна Петрова',
        role: 'Senior Frontend Developer'
    };

    const slots = [
        { id: 1, date: '2026-04-20', time: '14:00', isAvailable: true },
        { id: 2, date: '2026-04-20', time: '16:00', isAvailable: true },
        { id: 3, date: '2026-04-21', time: '10:00', isAvailable: false },
        { id: 4, date: '2026-04-21', time: '11:00', isAvailable: true },
        { id: 5, date: '2026-04-22', time: '15:00', isAvailable: true },
    ];

    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBook = () => {
        if (!selectedSlotId || !projectId) return;
        setLoading(true);

        // Находим выбранный слот
        const selectedSlot = slots.find(s => s.id === selectedSlotId);

        setTimeout(() => {
            // Обновляем проект: ставим статус pending и сохраняем имя ментора
            updateProject(projectId, {
                mentorRequestStatus: 'pending',
                requestedMentorName: mentor.name,
                meetingDate: selectedSlot ? `${selectedSlot.date} ${selectedSlot.time}` : undefined
            });

            setLoading(false);
            navigate('/student/projects');
        }, 800);
    };

    // ... остальной код рендера (JSX) остается без изменений ...

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад</span>
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-center space-x-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-16 h-16 bg-t-bank-yellow rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-t-bank-black" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-t-bank-black">Ментор: {mentor.name}</h2>
                            <p className="text-gray-600">{mentor.role}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 text-t-bank-black">Выберите свободное время для первой встречи:</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {slots.map(slot => (
                            <button
                                key={slot.id}
                                disabled={!slot.isAvailable}
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                                    !slot.isAvailable
                                        ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                                        : selectedSlotId === slot.id
                                            ? 'bg-t-bank-yellow border-t-bank-black shadow-md'
                                            : 'bg-white border-gray-200 hover:border-t-bank-yellow'
                                }`}
                            >
                                <div>
                                    <p className="font-bold">{slot.date}</p>
                                    <p className="text-sm flex items-center mt-1">
                                        <Clock className="w-3 h-3 mr-1" /> {slot.time}
                                    </p>
                                </div>
                                {!slot.isAvailable ? (
                                    <span className="text-xs font-medium">Занято</span>
                                ) : selectedSlotId === slot.id ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 text-gray-600 hover:text-t-bank-black font-medium"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleBook}
                            disabled={!selectedSlotId || loading}
                            className="px-8 py-3 bg-t-bank-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Отправка...' : 'Отправить запрос на встречу'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MentorAvailability;