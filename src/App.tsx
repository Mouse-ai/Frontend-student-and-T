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
import BookingPage from './pages/student/BookingPage';
import CalendarPage from './pages/student/CalendarPage';
import NotificationsPage from './pages/student/NotificationsPage';
import MentorRegisterPage from './pages/MentorRegisterPage';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorProfile from './pages/mentor/MentorProfile';
import MentorCalendar from './pages/mentor/MentorCalendar';
import MentorProjects from './pages/mentor/MentorProjects';
import MentorNotifications from './pages/mentor/MentorNotifications';

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
                <Route path="/register/mentor" element={<MentorRegisterPage />} />
                <Route
                    path="/student/calendar"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <CalendarPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor/projects"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <MentorProjects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor/notifications"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <MentorNotifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor/dashboard"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <MentorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor/profile"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <MentorProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentor/calendar"
                    element={
                        <ProtectedRoute requiredRole="mentor">
                            <MentorCalendar />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/notifications"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <NotificationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/booking"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <BookingPage />
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