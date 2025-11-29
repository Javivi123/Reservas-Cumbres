import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api';
import { User } from '../../types';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { User as UserIcon, Mail, CreditCard, Lock, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const ProfilePage = () => {
  const { user: _authUser } = useAuth(); // Prefijo _ para indicar que no se usa intencionalmente
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

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

  const handleChangePassword = async (data: ChangePasswordForm) => {
    setChangingPassword(true);
    try {
      await userService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Contraseña cambiada exitosamente');
      setShowPasswordForm(false);
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setChangingPassword(false);
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
      return <Badge variant="info"><span>🛡️</span> <span>Administrador</span></Badge>;
    }
    if (profile.role === 'SPECIAL_USER') {
      return <Badge variant="success"><span>⭐</span> <span>Usuario Especial</span></Badge>;
    }
    if (profile.specialRolePending) {
      return <Badge variant="warning"><span>⏳</span> <span>Pendiente de Aprobación</span></Badge>;
    }
    return <Badge variant="default"><span>👤</span> <span>Usuario</span></Badge>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <span>👤</span>
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">Mi Perfil</span>
      </h1>

      <div className="space-y-6">
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="text-white" size={32} />
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
                <p className="text-sm text-gray-600"><span>📧</span> <span>Email</span></p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600"><span>🆔</span> <span>DNI</span></p>
                <p className="font-medium">{profile.dni || 'No disponible'}</p>
              </div>
            </div>

            {profile.specialRolePending && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span>⏳</span> Tu solicitud de precio especial está siendo revisada por un administrador.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="card bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Lock className="mr-2 text-orange-600" size={24} />
              <span>🔐</span>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ml-2">Cambiar Contraseña</span>
            </h2>
            <Button
              variant="secondary"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                resetPassword();
              }}
            >
              {showPasswordForm ? <><span>❌</span> <span>Cancelar</span></> : <><span>🔑</span> <span>Cambiar</span></>}
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmitPassword(handleChangePassword)} className="space-y-4">
              <Input
                label="Contraseña Actual"
                type="password"
                {...registerPassword('currentPassword')}
                error={passwordErrors.currentPassword?.message}
                placeholder="••••••••"
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                {...registerPassword('newPassword')}
                error={passwordErrors.newPassword?.message}
                placeholder="••••••••"
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                {...registerPassword('confirmPassword')}
                error={passwordErrors.confirmPassword?.message}
                placeholder="••••••••"
              />

              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all" disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Cambiando...
                  </>
                ) : (
                  <>
                    <Key size={18} className="mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
