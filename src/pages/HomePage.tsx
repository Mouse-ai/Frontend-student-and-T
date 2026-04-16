import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, ArrowRight, Code, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header */}
            <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="bg-t-bank-yellow p-2 rounded-lg">
                                <Users className="w-6 h-6 text-t-bank-black" />
                            </div>
                            <span className="text-xl font-bold text-t-bank-black">
                Студент и Т
              </span>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-t-bank-black transition-colors font-medium">
                                О сервисе
                            </button>
                            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-t-bank-black transition-colors font-medium">
                                Возможности
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-t-bank-black transition-colors font-medium">
                                Как это работает
                            </button>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-gray-700 hover:text-t-bank-black transition-colors"
                            >
                                <Code className="w-5 h-5" />
                                <span className="hidden sm:inline">GitHub</span>
                            </a>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-t-bank-yellow text-t-bank-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-t-bank-gray py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            {/* Заголовок с фоном ЗА текстом */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-t-bank-black mb-6 leading-tight">
                                Твой старт в{' '}
                                <span className="inline-block relative">
                  <span className="absolute inset-0 bg-t-bank-yellow -skew-y-1 rounded -z-10 scale-105"></span>
                  <span className="relative px-2">Т-Банке</span>
                </span>
                            </h1>
                            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                                Платформа для студентов партнёрских вузов. Получи доступ к инфраструктуре
                                IT-хаба Т-Банка в твоём городе, найди ментора и начни карьеру в IT.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-t-bank-yellow text-t-bank-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                                >
                                    Начать сейчас
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="border-2 border-t-bank-black text-t-bank-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-t-bank-black hover:text-white transition-colors"
                                >
                                    Узнать больше
                                </button>
                            </div>
                        </div>

                        {/* Правая часть с преимуществами */}
                        <div className="hidden md:block">
                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <div className="bg-t-bank-yellow p-6 rounded-xl mb-6 flex justify-center">
                                    <Users className="w-20 h-20 text-t-bank-black" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-t-bank-black">Доступ к IT-хабу</h3>
                                            <p className="text-sm text-gray-600">Работай в современных офисах Т-Банка</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-t-bank-black">Персональный ментор</h3>
                                            <p className="text-sm text-gray-600">Обучение от опытных разработчиков</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-t-bank-black">Реальные проекты</h3>
                                            <p className="text-sm text-gray-600">Участвуй в разработке продуктов банка</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-t-bank-black">Трудоустройство</h3>
                                            <p className="text-sm text-gray-600">Возможность остаться в команде</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-t-bank-black mb-4">
                            Что ты получишь
                        </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            Все инструменты для успешного старта карьеры в IT-компании
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8" />}
                            title="Бронирование рабочих мест"
                            description="Забронируй рабочее пространство в IT-хабе Т-Банка в своём городе"
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8" />}
                            title="Менторство"
                            description="Выбери ментора среди сотрудников компании и получай поддержку"
                        />
                        <FeatureCard
                            icon={<Briefcase className="w-8 h-8" />}
                            title="Карьерный рост"
                            description="Получи реальный опыт и возможность трудоустройства"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8" />}
                            title="IT-инфраструктура"
                            description="Доступ к современным инструментам и технологиям"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-t-bank-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Как это работает
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Три простых шага до твоего первого рабочего места в Т-Банке
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <StepCard
                            number="01"
                            title="Зарегистрируйся"
                            description="Создай аккаунт и заполни профиль. Укажи свой вуз и направление обучения."
                        />
                        <StepCard
                            number="02"
                            title="Выбери ментора"
                            description="Ознакомься с профилями менторов и выбери подходящего специалиста."
                        />
                        <StepCard
                            number="03"
                            title="Начни работать"
                            description="Забронируй рабочее место и приступай к обучению и проектам."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-t-bank-yellow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-t-bank-black mb-6">
                        Готов начать свой путь в IT?
                    </h2>
                    <p className="text-xl text-t-bank-black mb-8">
                        Присоединяйся к сообществу студентов Т-Банка уже сегодня
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-t-bank-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-t-bank-yellow p-1.5 rounded">
                                    <Users className="w-5 h-5 text-t-bank-black" />
                                </div>
                                <span className="text-lg font-bold text-t-bank-black">
                  Студент и Т
                </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Платформа для студентов партнёрских вузов
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-t-bank-black mb-4">Разделы</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-t-bank-black">О сервисе</button></li>
                                <li><button onClick={() => scrollToSection('features')} className="hover:text-t-bank-black">Возможности</button></li>
                                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-t-bank-black">Как это работает</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-t-bank-black mb-4">Ресурсы</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-t-bank-black">Документация</a></li>
                                <li><a href="#" className="hover:text-t-bank-black">API</a></li>
                                <li><a href="#" className="hover:text-t-bank-black">Поддержка</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-t-bank-black mb-4">Контакты</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>student@t-bank.ru</li>
                                <li>+7 (800) 555-35-35</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
                        <p>© 2026 Т-Банк. Все права защищены.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-t-bank-yellow transition-colors group hover:shadow-lg">
        <div className="bg-t-bank-yellow inline-flex p-3 rounded-lg mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-t-bank-black mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
    </div>
);

interface StepCardProps {
    number: string;
    title: string;
    description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
    <div className="text-center bg-gray-800 p-6 rounded-xl">
        <div className="text-5xl font-bold text-t-bank-yellow mb-4">{number}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

export default HomePage;