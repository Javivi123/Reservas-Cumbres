import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().regex(/^\d{8}[A-Z]$/, 'DNI inválido (formato: 12345678A)'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  specialRole: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await registerUser({
        nombre: data.nombre,
        email: data.email,
        dni: data.dni,
        password: data.password,
        specialRole: data.specialRole,
      });
      toast.success('¡Registro exitoso!');
      navigate('/user');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 px-4 py-8 relative overflow-hidden">
      {/* Iconos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="max-w-md w-full relative z-10">
        <div className="card bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Regístrate para comenzar a reservar 🎯</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nombre Completo"
              {...register('nombre')}
              error={errors.nombre?.message}
              placeholder="Juan Pérez"
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="tu@email.com"
            />

            <Input
              label="DNI"
              {...register('dni')}
              error={errors.dni?.message}
              placeholder="12345678A"
              maxLength={9}
            />

            <Input
              label="Contraseña"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="specialRole"
                {...register('specialRole')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="specialRole" className="ml-2 block text-sm text-gray-700">
                Soy alumno/familia de alumno/ex-alumno (precio especial)
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Tu solicitud será revisada por un administrador
            </p>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                '✨ Registrarse'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

