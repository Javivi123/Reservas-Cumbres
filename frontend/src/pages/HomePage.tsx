import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, MapPin, Activity, Circle } from 'lucide-react';
import { Button } from '../components/Button';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Iconos animados de fondo con más colores */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Circle className="absolute top-20 left-10 text-blue-300 opacity-30 animate-bounce-slow" size={80} style={{ animationDelay: '0s' }} />
        <Activity className="absolute top-40 right-20 text-green-300 opacity-30 animate-bounce-slow" size={80} style={{ animationDelay: '1s' }} />
        <Circle className="absolute bottom-40 left-20 text-purple-300 opacity-30 animate-bounce-slow" size={80} style={{ animationDelay: '2s' }} />
        <Activity className="absolute bottom-20 right-10 text-orange-300 opacity-30 animate-bounce-slow" size={80} style={{ animationDelay: '1.5s' }} />
        <Circle className="absolute top-1/2 left-1/4 text-pink-300 opacity-20 animate-float" size={60} />
        <Activity className="absolute top-1/3 right-1/3 text-cyan-300 opacity-25 animate-float" size={70} style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>⚽</span>
                <span>Reservas Cumbres</span>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === 'ADMIN' ? (
                    <Link to="/admin">
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">🛡️ Panel Admin</Button>
                    </Link>
                  ) : (
                    <Link to="/user">
                      <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">🏠 Mi Panel</Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold">✨ Registrarse</Button>
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
            <h1 className="text-6xl font-bold mb-4 flex items-center justify-center flex-wrap gap-2">
              <span>⚽</span><span>🏀</span><span>🎾</span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Sistema de Reservas</span>
            </h1>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Pistas Deportivas
            </h2>
          </div>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            <span>🏃‍♂️</span> Reserva fácilmente las pistas deportivas del colegio. 
            <br />
            <span className="font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Gestión simple y rápida</span> <span>✨</span>
          </p>
          {!user && (
            <div className="flex justify-center space-x-4 animate-slide-up">
              <Link to="/register">
                <Button className="text-lg px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <span>🚀</span> <span>Comenzar Ahora</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="text-lg px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg">
                  <span>👤</span> <span>Ya tengo cuenta</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features con imágenes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up hover:shadow-xl transition-all transform hover:scale-105 group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Activity className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce">⚽</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
              <span>📅</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ml-2">Reservas Fáciles</span>
            </h3>
            <p className="text-gray-700">
              Reserva tus pistas favoritas en pocos clics. Selecciona fecha, hora y pista. <span>🎯</span>
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-xl transition-all transform hover:scale-105 group bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <MapPin className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏀</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
              <span>🏟️</span>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-2">Múltiples Pistas</span>
            </h3>
            <p className="text-gray-700">
              Césped <span>⚽</span>, multi <span>🏀</span> y pádel <span>🎾</span>. Elige la pista que mejor se adapte a tu actividad.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up hover:shadow-xl transition-all transform hover:scale-105 group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Users className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎾</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
              <span>💰</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">Precios Especiales</span>
            </h3>
            <p className="text-gray-700">
              Alumnos <span>👨‍🎓</span>, familias <span>👨‍👩‍👧‍👦</span> y ex-alumnos <span>🎓</span> disfrutan de tarifas especiales.
            </p>
          </div>
        </div>
      </section>

      {/* Logo del colegio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center">
          <p className="text-gray-600 mb-4"><span>🏫</span> Desarrollado para</p>
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
      <footer className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/90 mb-4 md:mb-0">
              © 2025 Javier Sánchez (alumno de Cumbres). Todos los derechos reservados. <span>🎓</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/legal/privacidad" className="text-white/90 hover:text-white transition-colors font-medium">
                <span>🔒</span> <span>Privacidad</span>
              </Link>
              <Link to="/legal/normas" className="text-white/90 hover:text-white transition-colors font-medium">
                <span>📋</span> <span>Normas</span>
              </Link>
              <Link to="/legal/emergencia" className="text-white/90 hover:text-white transition-colors font-medium">
                <span>🚨</span> <span>Emergencia</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
