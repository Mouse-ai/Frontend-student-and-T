import { useState } from 'react';
import { MOCK_MENTORS } from '../mocks/data';
import MentorCard from '../components/MentorCard';

export default function Mentors() {
  const [filter, setFilter] = useState('');

  const filteredMentors = MOCK_MENTORS.filter(mentor =>
    mentor.name.toLowerCase().includes(filter.toLowerCase()) ||
    mentor.role.toLowerCase().includes(filter.toLowerCase()) ||
    mentor.stack.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Наши менторы</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по имени, роли или стеку..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}
