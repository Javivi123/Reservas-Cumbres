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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="text-white" size={24} />
              <Link to="/admin" className="text-2xl font-bold text-white flex items-center">
                <span>🛡️</span>
                <span className="ml-2">Panel Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/90 font-medium"><span>👤</span> <span>{user?.nombre}</span></span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
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
            <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
              <ul className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const colors = [
                    { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', hover: 'hover:from-blue-600 hover:to-cyan-600', text: 'text-white' },
                    { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', hover: 'hover:from-green-600 hover:to-emerald-600', text: 'text-white' },
                    { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', hover: 'hover:from-purple-600 hover:to-pink-600', text: 'text-white' },
                    { bg: 'bg-gradient-to-r from-orange-500 to-red-500', hover: 'hover:from-orange-600 hover:to-red-600', text: 'text-white' },
                    { bg: 'bg-gradient-to-r from-indigo-500 to-purple-500', hover: 'hover:from-indigo-600 hover:to-purple-600', text: 'text-white' },
                  ];
                  const itemColors = colors[index % colors.length];
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all transform ${
                          isActive
                            ? `${itemColors.bg} ${itemColors.text} shadow-lg scale-105 font-semibold`
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
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

