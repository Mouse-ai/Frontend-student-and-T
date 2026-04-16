import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StudentProjects from './pages/student/StudentProjects';
import CreateProject from './pages/student/CreateProject';
import MentorList from './pages/student/MentorList';
import MentorAvailability from './pages/student/MentorAvailability';
import ProjectDetails from './pages/student/ProjectDetails';

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

                <Route
                    path="/student/projects"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <StudentProjects />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/projects/create"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <CreateProject />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/projects/:projectId"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <ProjectDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/mentors"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <MentorList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/mentors/:mentorId/request"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <MentorAvailability />
                        </ProtectedRoute>
                    }
                />

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