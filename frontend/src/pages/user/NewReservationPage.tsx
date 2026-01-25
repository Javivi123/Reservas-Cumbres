import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { spaceService, reservationService } from '../../services/api';
import { Space } from '../../types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { format, addDays, isWeekend, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Euro, Lightbulb } from 'lucide-react';
import { getSpaceImage } from '../../utils/images';

const FRANJAS_SEMANA = ['17:30-19:00', '19:00-20:30', '20:30-22:00'];
const FRANJAS_FINDE = [
  '8:00-9:30',
  '9:30-11:00',
  '11:00-12:30',
  '12:30-14:00',
  '14:00-15:30',
  '15:30-17:00',
  '17:00-18:30',
  '18:30-20:00',
];

/**
 * Convierte una franja horaria a minutos desde medianoche
 * Ejemplo: '8:00-9:30' -> { start: 480, end: 570 }
 */
const parseTimeSlot = (franja: string): { start: number; end: number } | null => {
  const match = franja.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  
  const [, startHour, startMin, endHour, endMin] = match;
  const start = parseInt(startHour, 10) * 60 + parseInt(startMin, 10);
  const end = parseInt(endHour, 10) * 60 + parseInt(endMin, 10);
  
  return { start, end };
};

/**
 * Verifica si dos franjas horarias se solapan
 */
const doTimeSlotsOverlap = (franja1: string, franja2: string): boolean => {
  // Si son iguales, se solapan
  if (franja1 === franja2) return true;
  
  const slot1 = parseTimeSlot(franja1);
  const slot2 = parseTimeSlot(franja2);
  
  if (!slot1 || !slot2) return false;
  
  // Se solapan si: start1 < end2 && start2 < end1
  return slot1.start < slot2.end && slot2.start < slot1.end;
};

const reservationSchema = z.object({
  spaceId: z.string().min(1, 'Selecciona una pista'),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  franja: z.string().min(1, 'Selecciona una franja horaria'),
  luz: z.boolean().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export const NewReservationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [pricing, setPricing] = useState<{
    precioBase: number;
    precioLuz: number;
    precioTotal: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });

  const spaceId = watch('spaceId');
  const fecha = watch('fecha');
  const franja = watch('franja');
  const luz = watch('luz');

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    if (spaceId) {
      const space = spaces.find((s) => s.id === spaceId);
      setSelectedSpace(space || null);
    }
  }, [spaceId, spaces]);

  useEffect(() => {
    if (fecha && spaceId) {
      loadAvailability();
    }
  }, [fecha, spaceId]);

  useEffect(() => {
    if (selectedSpace) {
      calculatePrice();
    }
  }, [selectedSpace, luz, user]);

  const loadSpaces = async () => {
    try {
      const data = await spaceService.getAll();
      setSpaces(data.filter((s) => s.disponible));
    } catch (error) {
      toast.error('Error al cargar pistas');
    }
  };

  const loadAvailability = async () => {
    if (!fecha || !spaceId) return;

    try {
      const data = await spaceService.getAvailability(spaceId, fecha);
      const fechaDate = new Date(fecha);
      const isWeekendDay = isWeekend(fechaDate);

      if (isWeekendDay) {
        // Fines de semana: franjas de hora y media
        // Filtrar franjas que se solapen con reservas existentes (incluyendo legacy '8:00-20:00')
        const reservedSlots = data.reservations.map((r: any) => r.franja);
        setAvailableSlots(
          FRANJAS_FINDE.filter((slot) => {
            // Verificar si la franja se solapa con alguna reserva existente
            return !reservedSlots.some((reservedFranja: string) => 
              doTimeSlotsOverlap(slot, reservedFranja)
            );
          })
        );
      } else {
        // Entre semana: franjas fijas
        const reservedSlots = data.reservations.map((r: any) => r.franja);
        setAvailableSlots(
          FRANJAS_SEMANA.filter((slot) => !reservedSlots.includes(slot))
        );
      }
    } catch (error) {
      toast.error('Error al cargar disponibilidad');
    }
  };

  const calculatePrice = () => {
    if (!selectedSpace) {
      setPricing(null);
      return;
    }

    const isSpecialUser = user?.role === 'SPECIAL_USER';
    const precioBase = isSpecialUser
      ? selectedSpace.precioEspecial
      : selectedSpace.precioBase;
    const precioLuz = luz && !selectedSpace.luzIncluida ? selectedSpace.luzPrecio : 0;
    const precioTotal = precioBase + precioLuz;

    setPricing({
      precioBase,
      precioLuz,
      precioTotal,
    });
  };

  const onSubmit = async (data: ReservationForm) => {
    const fechaDate = new Date(data.fecha);
    if (isPast(fechaDate)) {
      toast.error('No se pueden reservar fechas pasadas');
      return;
    }

    setLoading(true);
    try {
      await reservationService.create(data);
      toast.success('Reserva creada. Realiza el pago para completar la solicitud.');
      navigate('/user/reservations');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear reserva');
    } finally {
      setLoading(false);
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <span>✨</span>
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ml-2">Nueva Reserva</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selección de pista */}
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600" size={24} />
            <span>🏟️</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">Selecciona una Pista</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {spaces.map((space) => {
              const getEmoji = () => {
                if (space.tipo.includes('cesped')) return '⚽';
                if (space.tipo.includes('multi')) return '🏀';
                if (space.tipo.includes('padel')) return '🎾';
                return '🏟️';
              };
              const spaceImage = getSpaceImage(space.nombre, space.tipo);
              return (
                <label
                  key={space.id}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
                    spaceId === space.id
                      ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg ring-2 ring-blue-300'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={space.id}
                    {...register('spaceId')}
                    className="sr-only"
                  />
                  <div className="relative">
                    {/* Imagen de la pista */}
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={spaceImage} 
                        alt={space.nombre}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          // Fallback si la imagen no se carga
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.className = 'relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center';
                          target.parentElement!.innerHTML = `<span class="text-6xl">${getEmoji()}</span>`;
                        }}
                      />
                      {/* Overlay con emoji */}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <span className="text-2xl">{getEmoji()}</span>
                      </div>
                    </div>
                    {/* Información de la pista */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">{space.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <span>💰</span> General: €{space.precioBase} | <span>⭐</span> Especial: €{space.precioEspecial}
                      </p>
                      {space.luzIncluida && (
                        <Badge variant="info" className="mt-2">
                          <span>💡</span> <span>Luz incluida</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.spaceId && (
            <p className="mt-2 text-sm text-red-600">{errors.spaceId.message}</p>
          )}
        </div>

        {/* Selección de fecha */}
        {selectedSpace && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-primary-600" size={24} />
              Selecciona una Fecha
            </h2>
            <Input
              type="date"
              {...register('fecha')}
              error={errors.fecha?.message}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                setValue('fecha', e.target.value);
              }}
            />
            {fecha && (
              <p className="mt-2 text-sm text-gray-600">
                {format(new Date(fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            )}
          </div>
        )}

        {/* Selección de franja */}
        {selectedSpace && fecha && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-primary-600" size={24} />
              Selecciona una Franja Horaria
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {availableSlots.map((slot) => (
                <label
                  key={slot}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    franja === slot
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={slot}
                    {...register('franja')}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <p className="font-semibold">{slot}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.franja && (
              <p className="mt-2 text-sm text-red-600">{errors.franja.message}</p>
            )}
            {availableSlots.length === 0 && (
              <p className="text-sm text-yellow-600 mt-2">
                No hay franjas disponibles para esta fecha
              </p>
            )}
          </div>
        )}

        {/* Opción de luz */}
        {selectedSpace && !selectedSpace.luzIncluida && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lightbulb className="mr-2 text-primary-600" size={24} />
              Iluminación
            </h2>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('luz')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                Añadir iluminación (+€{selectedSpace.luzPrecio.toFixed(2)})
              </span>
            </label>
          </div>
        )}

        {/* Resumen y precio */}
        {selectedSpace && (
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Euro className="mr-2 text-green-600" size={24} />
              <span>💰</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ml-2">Resumen del Pedido</span>
            </h2>
            {pricing ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Precio base:</span>
                  <span>€{pricing.precioBase.toFixed(2)}</span>
                </div>
                {pricing.precioLuz > 0 && (
                  <div className="flex justify-between">
                    <span><span>💡</span> <span>Iluminación:</span></span>
                    <span>€{pricing.precioLuz.toFixed(2)}</span>
                  </div>
                )}
                {selectedSpace.luzIncluida && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span><span>✨</span> <span>Luz incluida</span></span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-green-300">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Total:</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-3xl font-extrabold">€{pricing.precioTotal.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Selecciona una pista para ver el precio</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full text-lg py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all" disabled={loading || !pricing || !franja}>
          {loading ? <><span>⏳</span> <span>Creando reserva...</span></> : <><span>✅</span> <span>Crear Reserva</span></>}
        </Button>
      </form>
    </div>
  );
};

