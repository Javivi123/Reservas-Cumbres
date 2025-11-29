import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api';
import { User } from '../../types';
import { Badge } from '../../components/Badge';
import { User as UserIcon, Mail, CreditCard, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <div>Error al cargar perfil</div>;
  }

  const getRoleBadge = () => {
    if (profile.role === 'ADMIN') {
      return <Badge variant="info">Administrador</Badge>;
    }
    if (profile.role === 'SPECIAL_USER') {
      return <Badge variant="success">Usuario Especial</Badge>;
    }
    if (profile.specialRolePending) {
      return <Badge variant="warning">Pendiente de Aprobación</Badge>;
    }
    return <Badge variant="default">Usuario</Badge>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="text-primary-600" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{profile.nombre}</h2>
            <div className="mt-1">{getRoleBadge()}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CreditCard className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">DNI</p>
              <p className="font-medium">{profile.dni || 'No disponible'}</p>
            </div>
          </div>

          {profile.specialRolePending && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Tu solicitud de precio especial está siendo revisada por un administrador.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

