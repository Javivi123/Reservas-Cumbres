import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, MapPin, Football, Basketball, Activity } from 'lucide-react';
import { Button } from '../components/Button';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Iconos animados de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Football className="absolute top-20 left-10 text-blue-200 opacity-20 animate-bounce-slow" size={80} style={{ animationDelay: '0s' }} />
        <Basketball className="absolute top-40 right-20 text-blue-200 opacity-20 animate-bounce-slow" size={80} style={{ animationDelay: '1s' }} />
        <Activity className="absolute bottom-40 left-20 text-blue-200 opacity-20 animate-bounce-slow" size={80} style={{ animationDelay: '2s' }} />
        <Football className="absolute bottom-20 right-10 text-blue-200 opacity-20 animate-bounce-slow" size={80} style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-primary-600">
                ⚽ Reservas Cumbres
              </div>
              <a 
                href="https://cumbresschool.es" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              >
                Cumbres School Valencia
              </a>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === 'ADMIN' ? (
                    <Link to="/admin">
                      <Button>🛡️ Panel Admin</Button>
                    </Link>
                  ) : (
                    <Link to="/user">
                      <Button>🏠 Mi Panel</Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="secondary">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button>✨ Registrarse</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              ⚽🏀🎾 Sistema de Reservas
            </h1>
            <h2 className="text-4xl font-bold text-primary-600 mb-4">
              Pistas Deportivas
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            🏃‍♂️ Reserva fácilmente las pistas deportivas del colegio. 
            <br />
            <span className="font-semibold text-primary-600">Gestión simple y rápida</span> ✨
          </p>
          {!user && (
            <div className="flex justify-center space-x-4 animate-slide-up">
              <Link to="/register">
                <Button className="text-lg px-8 py-3">
                  🚀 Comenzar Ahora
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  👤 Ya tengo cuenta
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features con imágenes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up hover:shadow-xl transition-shadow group">
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Football className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⚽</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">📅 Reservas Fáciles</h3>
            <p className="text-gray-600">
              Reserva tus pistas favoritas en pocos clics. Selecciona fecha, hora y pista. 🎯
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-xl transition-shadow group" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏀</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">🏟️ Múltiples Pistas</h3>
            <p className="text-gray-600">
              Césped ⚽, multi 🏀 y pádel 🎾. Elige la pista que mejor se adapte a tu actividad.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-xl transition-shadow group" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎾</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">💰 Precios Especiales</h3>
            <p className="text-gray-600">
              Alumnos 👨‍🎓, familias 👨‍👩‍👧‍👦 y ex-alumnos 🎓 disfrutan de tarifas especiales.
            </p>
          </div>
        </div>
      </section>

      {/* Logo del colegio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center">
          <p className="text-gray-600 mb-4">🏫 Desarrollado para</p>
          <a 
            href="https://cumbresschool.es" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Cumbres School Valencia
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 Javier Sánchez (alumno de Cumbres). Todos los derechos reservados. 🎓
            </div>
            <div className="flex space-x-6">
              <Link to="/legal/privacidad" className="text-gray-600 hover:text-primary-600 transition-colors">
                🔒 Privacidad
              </Link>
              <Link to="/legal/normas" className="text-gray-600 hover:text-primary-600 transition-colors">
                📋 Normas
              </Link>
              <Link to="/legal/emergencia" className="text-gray-600 hover:text-primary-600 transition-colors">
                🚨 Emergencia
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
