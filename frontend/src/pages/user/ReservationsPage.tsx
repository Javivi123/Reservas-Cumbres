import { useEffect, useState } from 'react';
import { reservationService } from '../../services/api';
import { Reservation } from '../../types';
import { Badge } from '../../components/Badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Euro, Upload, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadComprobante = async () => {
    if (!selectedReservation || !file) return;

    setUploading(true);
    try {
      await reservationService.uploadComprobante(selectedReservation.id, file);
      toast.success('Comprobante subido exitosamente');
      setSelectedReservation(null);
      setFile(null);
      loadReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al subir comprobante');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'RESERVADA':
        return <Badge variant="success">Reservada</Badge>;
      case 'PRE_RESERVADA':
        return <Badge variant="warning">Pendiente de Pago</Badge>;
      case 'LIBRE':
        return <Badge variant="default">Libre</Badge>;
      case 'NO_DISPONIBLE':
        return <Badge variant="danger">No Disponible</Badge>;
      default:
        return <Badge variant="default">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          📅 Mis Reservas
        </h1>
      </div>

      {reservations.length === 0 ? (
        <div className="card text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300">
          <Calendar className="mx-auto text-blue-400 mb-4 animate-bounce-slow" size={48} />
          <p className="text-gray-700 mb-4 text-lg font-semibold">📭 No tienes reservas aún</p>
          <p className="text-gray-600">¡Crea tu primera reserva ahora! 🚀</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation, index) => {
            const gradientColors = [
              'from-blue-500 to-cyan-500',
              'from-green-500 to-emerald-500',
              'from-purple-500 to-pink-500',
              'from-orange-500 to-red-500',
            ];
            const gradient = gradientColors[index % gradientColors.length];
            return (
            <div key={reservation.id} className={`card bg-gradient-to-br ${gradient} bg-opacity-10 border-2 border-${gradient.split(' ')[0].split('-')[1]}-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20`}>
                      <MapPin className={`text-${gradient.split(' ')[0].split('-')[1]}-600`} size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{reservation.space?.nombre}</h3>
                    {getStatusBadge(reservation.estado)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(reservation.fecha), "EEEE, d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div>
                      <strong>Franja:</strong> {reservation.franja}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Euro size={16} />
                      <span>
                        <strong>Total:</strong> €{reservation.precioTotal.toFixed(2)}
                      </span>
                    </div>
                    {reservation.luz && (
                      <div>
                        <strong>Luz:</strong> Incluida
                      </div>
                    )}
                  </div>

                  {reservation.payment && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Número de cuenta:</strong> {reservation.payment.numeroCuenta}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Estado del pago:</strong>{' '}
                        {reservation.payment.status === 'APROBADO' ? (
                          <Badge variant="success">Aprobado</Badge>
                        ) : reservation.payment.status === 'RECHAZADO' ? (
                          <Badge variant="danger">Rechazado</Badge>
                        ) : (
                          <Badge variant="warning">Pendiente</Badge>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                  {reservation.estado === 'PRE_RESERVADA' &&
                    !reservation.payment?.comprobanteUrl && (
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        <Upload size={18} className="mr-2" />
                        Subir Comprobante
                      </Button>
                    )}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Ver detalles
                      setSelectedReservation(reservation);
                    }}
                  >
                    <Eye size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para subir comprobante */}
      <Modal
        isOpen={!!selectedReservation}
        onClose={() => {
          setSelectedReservation(null);
          setFile(null);
        }}
        title="Subir Comprobante de Pago"
      >
        {selectedReservation && (
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Instrucciones:</p>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Realiza la transferencia al número de cuenta indicado</li>
                <li>Monto: €{selectedReservation.precioTotal.toFixed(2)}</li>
                <li>Concepto: Reserva Pistas</li>
                <li>Sube el comprobante de la transferencia</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprobante de Pago (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="input"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedReservation(null);
                  setFile(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUploadComprobante}
                disabled={!file || uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir Comprobante'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

