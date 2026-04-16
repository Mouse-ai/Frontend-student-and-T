import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar as CalendarIcon, Clock, MapPin,
    Users, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import { getUserBookings, Booking } from '../../services/bookingService';
import { getUserProjects, Project } from '../../services/projectService';

const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        // Загружаем бронирования и проекты с встречами
        setBookings(getUserBookings());
        setProjects(getUserProjects());
    }, []);

    // Получаем события для выбранной даты
    const getEventsForDate = (dateStr: string) => {
        const events: Array<{ type: string; title: string; time: string; description: string }> = [];

        // Бронирования
        bookings
            .filter(b => b.date === dateStr)
            .forEach(b => {
                events.push({
                    type: 'booking',
                    title: `Бронирование: ${b.seatNumber}`,
                    time: b.timeSlot,
                    description: `${b.peopleCount} чел.`
                });
            });

        // Встречи из проектов (если есть meetingDate)
        projects
            .filter(p => p.meetingDate?.startsWith(dateStr))
            .forEach(p => {
                events.push({
                    type: 'meeting',
                    title: `Встреча с ментором`,
                    time: p.meetingDate?.split(' ')[1] || 'Не указано',
                    description: `Проект: ${p.name}`
                });
            });

        return events;
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = formatDate(new Date());

    // Создаем массив дней месяца
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-t-bank-black transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-t-bank-black mb-2 flex items-center space-x-3">
                        <CalendarIcon className="w-8 h-8" />
                        <span>Календарь</span>
                    </h1>
                    <p className="text-gray-600">Встречи, бронирования и события</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Календарь */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            {/* Навигация по месяцам */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-xl font-bold text-t-bank-black">
                                    {monthNames[month]} {year}
                                </h2>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Дни недели */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Дни месяца */}
                            <div className="grid grid-cols-7 gap-2">
                                {days.map((day, index) => {
                                    if (!day) return <div key={`empty-${index}`} />;

                                    const dateStr = formatDate(day);
                                    const isToday = dateStr === today;
                                    const isSelected = dateStr === selectedDate;
                                    const events = getEventsForDate(dateStr);
                                    const hasEvents = events.length > 0;

                                    return (
                                        <button
                                            key={dateStr}
                                            onClick={() => setSelectedDate(dateStr)}
                                            className={`
                        aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative
                        transition-all text-sm font-medium
                        ${isToday ? 'border-t-bank-yellow bg-yellow-50' : 'border-gray-100'}
                        ${isSelected ? 'border-t-bank-black bg-t-bank-yellow' : 'hover:border-gray-300'}
                      `}
                                        >
                                            <span>{day.getDate()}</span>
                                            {hasEvents && (
                                                <div className="absolute bottom-1 flex space-x-0.5">
                                                    {events.slice(0, 3).map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-t-bank-black' : 'bg-t-bank-yellow'}`} />
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* События выбранного дня */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-t-bank-black mb-4">
                                {selectedDate ? `События на ${new Date(selectedDate).toLocaleDateString('ru-RU')}` : 'Выберите дату'}
                            </h3>

                            {selectedDate ? (
                                selectedEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedEvents.map((event, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg border-2 ${
                                                    event.type === 'booking'
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-green-50 border-green-200'
                                                }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        event.type === 'booking' ? 'bg-blue-100' : 'bg-green-100'
                                                    }`}>
                                                        {event.type === 'booking' ? (
                                                            <MapPin className={`w-4 h-4 ${event.type === 'booking' ? 'text-blue-600' : 'text-green-600'}`} />
                                                        ) : (
                                                            <Users className={`w-4 h-4 ${event.type === 'booking' ? 'text-blue-600' : 'text-green-600'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-t-bank-black text-sm">{event.title}</p>
                                                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {event.time}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Нет событий на этот день</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-sm">Нажмите на дату, чтобы увидеть события</p>
                                </div>
                            )}

                            <button className="w-full mt-4 bg-t-bank-yellow text-t-bank-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Добавить событие</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CalendarPage;