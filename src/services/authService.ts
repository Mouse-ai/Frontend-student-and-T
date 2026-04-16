// Типы для пользователей
export interface User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: 'student' | 'mentor' | 'admin';
    university?: string;
    course?: string;
    createdAt: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

// Ключи для localStorage
const USERS_KEY = 'tbank_users';
const CURRENT_USER_KEY = 'tbank_current_user';

// Инициализация админа при первом запуске
const initializeAdmin = () => {
    const users = getUsers();
    if (users.length === 0) {
        const admin: User = {
            id: 'admin-1',
            email: 'admin@t-bank.ru',
            password: 'admin123',
            fullName: 'Администратор',
            role: 'admin',
            createdAt: new Date().toISOString(),
        };
        users.push(admin);
        saveUsers(users);
        console.log('Admin created: admin@t-bank.ru / admin123');
    }
};

// Получить всех пользователей
export const getUsers = (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

// Сохранить всех пользователей
export const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Регистрация пользователя
export const register = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string } => {
    initializeAdmin();

    const users = getUsers();

    // Проверка на существующий email
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Регистрация успешна' };
};

// Вход в систему
export const login = (email: string, password: string): { success: boolean; user?: User; message: string } => {
    initializeAdmin();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: 'Неверный email или пароль' };
    }

    // Сохраняем текущего пользователя
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    return { success: true, user, message: 'Вход выполнен' };
};

// Выход из системы
export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Получить текущего пользователя
export const getCurrentUser = (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
};

// Проверка аутентификации
export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};