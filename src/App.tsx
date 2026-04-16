import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Защищенные маршруты */}
                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Здесь будут маршруты для ментора и админа */}
                <Route
                    path="/mentor/dashboard"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <div>Mentor Dashboard</div>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <div>Admin Dashboard</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;