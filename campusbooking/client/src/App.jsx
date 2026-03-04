import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FacilitiesPage from './pages/FacilitiesPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes with sidebar layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                  <Navbar />
                  <main style={{
                    marginLeft: '240px',
                    flex: 1,
                    padding: '28px 32px',
                    minHeight: '100vh',
                    background: '#f1f5f9',
                  }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/facilities" replace />} />
                      <Route path="/facilities" element={<FacilitiesPage />} />
                      <Route path="/book/:facilityId?" element={<BookingPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
