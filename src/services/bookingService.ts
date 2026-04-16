import { getCurrentUser } from './authService';

export interface Booking {
    id: string;
    userId: string;
    userName: string;
    seatNumber: string;
    date: string;
    timeSlot: string;
    peopleCount: number;
    createdAt: string;
}

const BOOKINGS_KEY = 'tbank_bookings';

// Доступные временные слоты
export const TIME_SLOTS = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
];

// Рабочие места (моковые данные)
export const SEATS = Array.from({ length: 20 }, (_, i) => ({
    number: `A${i + 1}`,
    floor: 1,
    capacity: Math.floor(Math.random() * 4) + 1, // 1-4 человека
}));

export const getBookings = (): Booking[] => {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveBookings = (bookings: Booking[]) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const createBooking = (bookingData: Omit<Booking, 'id' | 'userId' | 'userName' | 'createdAt'>): Booking => {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('Пользователь не авторизован');
    }

    const bookings = getBookings();

    const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        userId: user.id,
        userName: user.fullName,
        createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    saveBookings(bookings);

    return newBooking;
};

export const getUserBookings = (): Booking[] => {
    const user = getCurrentUser();
    if (!user) return [];

    const bookings = getBookings();
    return bookings.filter(b => b.userId === user.id);
};

export const cancelBooking = (id: string): boolean => {
    const bookings = getBookings();
    const filtered = bookings.filter(b => b.id !== id);

    if (filtered.length === bookings.length) return false;

    saveBookings(filtered);
    return true;
};

// Проверка, забронировано ли место
export const isSeatBooked = (seatNumber: string, date: string, timeSlot: string): boolean => {
    const bookings = getBookings();
    return bookings.some(
        b => b.seatNumber === seatNumber && b.date === date && b.timeSlot === timeSlot
    );
};