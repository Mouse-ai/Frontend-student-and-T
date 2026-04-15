import { useState } from 'react';
import { MOCK_SLOTS } from '../mocks/data';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState('2026-04-16');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Бронирование рабочего пространства</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите дату
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Доступные слоты:</h2>
          {MOCK_SLOTS.map(slot => (
            <div 
              key={slot.id}
              className={`flex justify-between items-center p-4 rounded-lg border ${
                slot.status === 'free'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 bg-gray-100'
              }`}
            >
              <div>
                <p className="font-medium">{slot.time}</p>
                <p className="text-sm text-gray-600">{slot.date}</p>
              </div>
              <button
                disabled={slot.status === 'booked'}
                className={`px-6 py-2 rounded-lg transition ${
                  slot.status === 'free'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {slot.status === 'free' ? 'Забронировать' : 'Занято'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
