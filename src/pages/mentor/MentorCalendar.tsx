import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar as CalendarIcon, Check, Save } from 'lucide-react';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
];

const MentorCalendar: React.FC = () => {
    const navigate = useNavigate();

    // Состояние расписания: { dayIndex: [selectedTimes] }
    const [schedule, setSchedule] = useState<Record<number, string[]>>({
        0: ['10:00', '14:00'], // Понедельник
        1: ['10:00', '11:00'],
        3: ['15:00'],
    });
    const [loading, setLoading] = useState(false);

    const toggleSlot = (dayIndex: number, time: string) => {
        setSchedule(prev => {
            const currentDaySlots = prev[dayIndex] || [];
            const isSelected = currentDaySlots.includes(time);

            let newDaySlots;
            if (isSelected) {
                newDaySlots = currentDaySlots.filter(t => t !== time);
            } else {
                newDaySlots = [...currentDaySlots, time];
            }

            return { ...prev, [dayIndex]: newDaySlots };
        });
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
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/mentor/dashboard')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад в дашборд</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-t-bank-black">Расписание доступности</h1>
                        <p className="text-gray-600">Выберите время, когда вы готовы принимать студентов</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-t-bank-yellow text-t-bank-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>{loading ? 'Сохранение...' : 'Сохранить расписание'}</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-left font-medium text-gray-600 w-24">Время</th>
                                {DAYS.map((day, index) => (
                                    <th key={index} className="p-4 text-center font-medium text-gray-600">
                                        <div className="flex flex-col items-center">
                                            <span>{day}</span>
                                            <span className="text-xs font-normal text-gray-400 mt-1">
                          {schedule[index]?.length || 0} ч.
                        </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {TIME_SLOTS.map(time => (
                                <tr key={time} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-500 text-sm">{time}</td>
                                    {DAYS.map((_, dayIndex) => {
                                        const isSelected = (schedule[dayIndex] || []).includes(time);
                                        return (
                                            <td key={dayIndex} className="p-2 text-center">
                                                <button
                                                    onClick={() => toggleSlot(dayIndex, time)}
                                                    className={`
                              w-full h-10 rounded-lg transition-all flex items-center justify-center
                              ${isSelected
                                                        ? 'bg-t-bank-yellow border-2 border-t-bank-black text-t-bank-black shadow-sm'
                                                        : 'bg-white border-2 border-gray-200 text-transparent hover:border-gray-300'}
                            `}
                                                >
                                                    {isSelected ? <Check className="w-5 h-5" /> : <span className="text-xs">+</span>}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MentorCalendar;