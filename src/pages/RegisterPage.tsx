import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { register } from '../services/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
        course: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }

        setLoading(true);

        // Имитация задержки
        setTimeout(() => {
            const result = register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: 'student',
                university: formData.university,
                course: formData.course,
            });

            if (result.success) {
                navigate('/login', { state: { message: 'Регистрация успешна! Теперь войдите.' } });
            } else {
                setError(result.message);
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-t-bank-gray flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <div className="flex justify-center mb-6">
                    <div className="bg-t-bank-yellow p-3 rounded-full">
                        <UserPlus className="w-8 h-8 text-t-bank-black" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-t-bank-black mb-2">Регистрация студента</h1>
                <p className="text-center text-gray-600 mb-8">Заполни анкету, чтобы начать</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                            placeholder="Иванов Иван Иванович"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Почта</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                            placeholder="student@university.ru"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                            placeholder="Минимум 6 символов"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ВУЗ</label>
                            <input
                                type="text"
                                name="university"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none"
                                placeholder="МГТУ им. Баумана"
                                value={formData.university}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Курс</label>
                            <select
                                name="course"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-t-bank-yellow focus:border-transparent outline-none bg-white"
                                value={formData.course}
                                onChange={handleChange}
                            >
                                <option value="">Выбери</option>
                                <option value="1">1 курс</option>
                                <option value="2">2 курс</option>
                                <option value="3">3 курс</option>
                                <option value="4">4 курс</option>
                                <option value="5">5+ курс</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-t-bank-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-t-bank-black font-bold hover:underline">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;