import { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
          <p className="text-gray-600 mt-1">{mentor.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          mentor.available 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {mentor.available ? 'Доступен' : 'Занят'}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Стек:</p>
        <div className="flex flex-wrap gap-2">
          {mentor.stack.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {mentor.available && (
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Записаться
        </button>
      )}
    </div>
  );
}
