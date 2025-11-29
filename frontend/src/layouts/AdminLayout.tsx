import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Users,
  MapPin,
  BarChart3,
  FileText,
  LogOut,
  Shield,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin/reservations', label: 'Reservas', icon: Calendar },
    { path: '/admin/users', label: 'Usuarios', icon: Users },
    { path: '/admin/spaces', label: 'Pistas', icon: MapPin },
    { path: '/admin/reports', label: 'Reportes', icon: BarChart3 },
    { path: '/admin/logs', label: 'Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="text-primary-600" size={24} />
              <Link to="/admin" className="text-2xl font-bold text-primary-600">
                Panel Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.nombre}</span>
              <Link
                to="/user"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Ver como usuario
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

