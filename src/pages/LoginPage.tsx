import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Имитация задержки
        setTimeout(() => {
            const result = login(email, password);

            if (result.success && result.user) {
                // Редирект в зависимости от роли
                if (result.user.role === 'student') {
                    navigate('/student/dashboard');
                } else if (result.user.role === 'mentor') {
                    navigate('/mentor/dashboard');
                } else if (result.user.role === 'admin') {
                    navigate('/admin/dashboard');
                }
            } else {
                setError(result.message);
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-t-bank-gray flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-t-bank-yellow p-3 rounded-full">
                        <LogIn className="w-8 h-8 text-t-bank-black" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-t-bank-black mb-2">Вход в аккаунт</h1>
                <p className="text-center text-gray-600 mb-8">Т-Банк: Студент и Т</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Почта</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none transition-all"
                            placeholder="student@university.ru"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-t-bank-yellow text-t-bank-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Тестовые аккаунты:</p>
                    <p className="text-xs text-gray-500">👨‍🎓 Студент: зарегистрируйтесь</p>
                    <p className="text-xs text-gray-500">👨‍ Админ: admin@t-bank.ru / admin123</p>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-t-bank-black font-bold hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
                <div className="mt-4 text-center border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Вы ментор?</p>
                    <Link to="/register/mentor" className="text-sm font-medium text-t-bank-black hover:underline">
                        Зарегистрироваться как ментор
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;