import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Student IT Hub
          </Link>
          <nav className="flex space-x-6">
            <Link to="/mentors" className="text-gray-700 hover:text-blue-600 transition">
              Менторы
            </Link>
            <Link to="/booking" className="text-gray-700 hover:text-blue-600 transition">
              Бронирование
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
              Мой кабинет
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
