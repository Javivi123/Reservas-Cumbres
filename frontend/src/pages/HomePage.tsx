import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Shield, Users, MapPin } from 'lucide-react';
import { Button } from '../components/Button';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary-600">
              Reservas Cumbres
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === 'ADMIN' ? (
                    <Link to="/admin">
                      <Button>Panel Admin</Button>
                    </Link>
                  ) : (
                    <Link to="/user">
                      <Button>Mi Panel</Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="secondary">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Sistema de Reservas de Pistas Deportivas
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Reserva fácilmente las pistas deportivas del colegio. Gestión simple y rápida.
          </p>
          {!user && (
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button>Comenzar Ahora</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up">
            <Calendar className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Reservas Fáciles</h3>
            <p className="text-gray-600">
              Reserva tus pistas favoritas en pocos clics. Selecciona fecha, hora y pista.
            </p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MapPin className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Múltiples Pistas</h3>
            <p className="text-gray-600">
              Césped, multi y pádel. Elige la pista que mejor se adapte a tu actividad.
            </p>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Users className="mx-auto text-primary-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Precios Especiales</h3>
            <p className="text-gray-600">
              Alumnos, familias y ex-alumnos disfrutan de tarifas especiales.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2024 Reservas Cumbres. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6">
              <Link to="/legal/privacidad" className="text-gray-600 hover:text-primary-600">
                Privacidad
              </Link>
              <Link to="/legal/normas" className="text-gray-600 hover:text-primary-600">
                Normas
              </Link>
              <Link to="/legal/emergencia" className="text-gray-600 hover:text-primary-600">
                Emergencia
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

