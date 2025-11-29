import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';
import { MessageSquare, Send } from 'lucide-react';

const contactSchema = z.object({
  asunto: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

export const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      await userService.contact(data.asunto, data.mensaje);
      toast.success('Mensaje enviado exitosamente. Te responderemos pronto.');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageSquare className="mr-3 text-primary-600" size={32} />
        Contacto / Soporte
      </h1>

      <div className="card max-w-2xl">
        <p className="text-gray-600 mb-6">
          ¿Tienes alguna pregunta o necesitas ayuda? Envíanos un mensaje y te responderemos lo
          antes posible.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Asunto"
            {...register('asunto')}
            error={errors.asunto?.message}
            placeholder="Ej: Problema con mi reserva"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              {...register('mensaje')}
              rows={6}
              className="input"
              placeholder="Escribe tu mensaje aquí..."
            />
            {errors.mensaje && (
              <p className="mt-1 text-sm text-red-600">{errors.mensaje.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Send size={18} className="mr-2" />
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </form>
      </div>
    </div>
  );
};

