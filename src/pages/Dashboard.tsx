export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Мой кабинет</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Активные менторства</h3>
          <p className="text-3xl font-bold text-blue-600">2</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Запланированные встречи</h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Пройдено тестов</h3>
          <p className="text-3xl font-bold text-purple-600">12</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Предстоящие встречи</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Встреча с Алексеем Ивановым</p>
              <p className="text-sm text-gray-600">Python, FastAPI</p>
            </div>
            <p className="text-blue-600 font-medium">16 апреля, 14:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
