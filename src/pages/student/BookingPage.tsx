import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Calendar, Users, Clock,
    Check, X, Info
} from 'lucide-react';
import {
    SEATS, TIME_SLOTS, createBooking, getUserBookings,
    cancelBooking, isSeatBooked, Booking
} from '../../services/bookingService';

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Загружаем мои брони
        const bookings = getUserBookings();
        setMyBookings(bookings);

        // Устанавливаем минимальную дату (сегодня)
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    const handleBook = async () => {
        if (!selectedSeat || !selectedDate || !selectedTime) return;

        setLoading(true);

        setTimeout(() => {
            createBooking({
                seatNumber: selectedSeat,
                date: selectedDate,
                timeSlot: selectedTime,
                peopleCount,
            });

            setLoading(false);
            setShowSuccess(true);
            setSelectedSeat(null);

            // Обновляем список броней
            setMyBookings(getUserBookings());

            setTimeout(() => setShowSuccess(false), 3000);
        }, 500);
    };

    const handleCancel = (bookingId: string) => {
        cancelBooking(bookingId);
        setMyBookings(getUserBookings());
    };

    const getSeatStatus = (seatNumber: string) => {
        if (!selectedDate || !selectedTime) return 'available';
        return isSeatBooked(seatNumber, selectedDate, selectedTime) ? 'booked' : 'available';
    };

    // Генерируем даты на неделю вперёд
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ru-RU', { month: 'short' });
        const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        return `${weekday}, ${day} ${month}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                    <h1 className="text-3xl font-bold text-t-bank-black mb-2">Бронирование рабочего места</h1>
                    <p className="text-gray-600">Выберите дату, время и место для работы в IT-хабе</p>
                </div>

                {/* Уведомление об успехе */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Место успешно забронировано!</span>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Левая колонка - Параметры бронирования */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Дата */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-t-bank-black mb-4 flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span>Дата</span>
                            </h3>
                            <div className="space-y-2">
                                {generateDates().map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                            selectedDate === date
                                                ? 'border-t-bank-yellow bg-yellow-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {formatDate(date)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Время */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-t-bank-black mb-4 flex items-center space-x-2">
                                <Clock className="w-5 h-5" />
                                <span>Время</span>
                            </h3>
                            <div className="space-y-2">
                                {TIME_SLOTS.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                            selectedTime === time
                                                ? 'border-t-bank-yellow bg-yellow-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Количество людей */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-t-bank-black mb-4 flex items-center space-x-2">
                                <Users className="w-5 h-5" />
                                <span>Количество человек</span>
                            </h3>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-t-bank-yellow transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <span className="text-2xl font-bold text-t-bank-black w-12 text-center">
                  {peopleCount}
                </span>
                                <button
                                    onClick={() => setPeopleCount(Math.min(4, peopleCount + 1))}
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-t-bank-yellow transition-colors"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Максимум 4 человека</p>
                        </div>
                    </div>

                    {/* Правая колонка - Схема мест */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-t-bank-black flex items-center space-x-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>Рабочие места</span>
                                </h3>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                                        <span className="text-gray-600">Свободно</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                        <span className="text-gray-600">Занято</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-t-bank-yellow border-2 border-t-bank-black rounded"></div>
                                        <span className="text-gray-600">Выбрано</span>
                                    </div>
                                </div>
                            </div>

                            {/* Сетка мест */}
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                                {SEATS.map(seat => {
                                    const status = getSeatStatus(seat.number);
                                    const isMySeat = selectedSeat === seat.number;

                                    return (
                                        <button
                                            key={seat.number}
                                            disabled={status === 'booked'}
                                            onClick={() => setSelectedSeat(isMySeat ? null : seat.number)}
                                            className={`
                        aspect-square rounded-xl border-2 flex flex-col items-center justify-center
                        transition-all relative
                        ${status === 'booked'
                                                ? 'bg-gray-200 border-gray-300 cursor-not-allowed'
                                                : isMySeat
                                                    ? 'bg-t-bank-yellow border-t-bank-black scale-105 shadow-lg'
                                                    : 'bg-white border-gray-300 hover:border-t-bank-yellow hover:shadow-md'
                                            }
                      `}
                                        >
                                            <span className="text-lg font-bold">{seat.number}</span>
                                            <span className="text-xs text-gray-500">{seat.capacity} чел.</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Кнопка бронирования */}
                            {selectedSeat && (
                                <div className="mt-6 p-4 bg-yellow-50 border-2 border-t-bank-yellow rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-bold text-t-bank-black">Место {selectedSeat}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(selectedDate)}, {selectedTime}
                                            </p>
                                            <p className="text-sm text-gray-600">{peopleCount} чел.</p>
                                        </div>
                                        <button
                                            onClick={handleBook}
                                            disabled={loading}
                                            className="bg-t-bank-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Бронируем...' : 'Забронировать'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!selectedSeat && selectedDate && selectedTime && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900">Выберите место</p>
                                        <p className="text-sm text-blue-700">Нажмите на свободное место, чтобы забронировать</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Мои бронирования */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-bold text-t-bank-black mb-4">Мои бронирования</h3>
                            {myBookings.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Пока нет бронирований</p>
                            ) : (
                                <div className="space-y-3">
                                    {myBookings.slice(0, 5).map(booking => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-t-bank-yellow p-2 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-t-bank-black" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-t-bank-black">Место {booking.seatNumber}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(booking.date)}, {booking.timeSlot}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{booking.peopleCount} чел.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingPage;