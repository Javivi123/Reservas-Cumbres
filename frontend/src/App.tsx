import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { UserLayout } from './layouts/UserLayout';

// Páginas públicas
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';

// Páginas de usuario
import { ReservationsPage } from './pages/user/ReservationsPage';
import { NewReservationPage } from './pages/user/NewReservationPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { ContactPage } from './pages/user/ContactPage';

// Páginas de admin
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSpacesPage } from './pages/admin/AdminSpacesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/legal/:page" element={<LegalPage />} />

          {/* Rutas de usuario */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/user/reservations" replace />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="new-reservation" element={<NewReservationPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Rutas de admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/reservations" replace />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="spaces" element={<AdminSpacesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

