import { useEffect, useState } from 'react';
import { adminService, spaceService } from '../../services/api';
import { Reservation, Space } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Calendar, Filter, Download, Check, X } from 'lucide-react';

export const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    spaceId: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    loadSpaces();
    loadReservations();
  }, [filters, pagination.page]);

  const loadSpaces = async () => {
    try {
      const data = await spaceService.getAll();
      setSpaces(data);
    } catch (error) {
      console.error('Error al cargar pistas:', error);
    }
  };

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReservations({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setReservations(data.reservations);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (estado: 'RESERVADA' | 'LIBRE') => {
    if (!selectedReservation) return;

    try {
      await adminService.updateReservationStatus(
        selectedReservation.id,
        estado,
        estado === 'LIBRE' ? motivoRechazo : undefined
      );
      toast.success(
        estado === 'RESERVADA' ? 'Reserva aprobada' : 'Reserva rechazada'
      );
      setActionModal(null);
      setSelectedReservation(null);
      setMotivoRechazo('');
      loadReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar estado');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminService.exportReservations(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservas-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Reservas exportadas exitosamente');
    } catch (error) {
      toast.error('Error al exportar reservas');
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'RESERVADA':
        return <Badge variant="success">Reservada</Badge>;
      case 'PRE_RESERVADA':
        return <Badge variant="warning">Pre-reservada</Badge>;
      case 'LIBRE':
        return <Badge variant="default">Libre</Badge>;
      case 'NO_DISPONIBLE':
        return <Badge variant="danger">No Disponible</Badge>;
      default:
        return <Badge variant="default">{estado}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
        <Button onClick={handleExport} variant="secondary">
          <Download size={18} className="mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-primary-600" size={20} />
          <h2 className="font-semibold">Filtros</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="PRE_RESERVADA">Pre-reservada</option>
              <option value="RESERVADA">Reservada</option>
              <option value="LIBRE">Libre</option>
              <option value="NO_DISPONIBLE">No Disponible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pista</label>
            <select
              value={filters.spaceId}
              onChange={(e) => setFilters({ ...filters, spaceId: e.target.value })}
              className="input"
            >
              <option value="">Todas</option>
              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <Input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <Input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tabla de reservas */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {format(new Date(reservation.fecha), 'dd/MM/yyyy', { locale: es })}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.franja}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.space?.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{reservation.user?.nombre}</div>
                    <div className="text-sm text-gray-500">{reservation.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reservation.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    €{reservation.precioTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.estado === 'PRE_RESERVADA' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setActionModal('approve');
                          }}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setActionModal('reject');
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de aprobación/rechazo */}
      <Modal
        isOpen={actionModal !== null}
        onClose={() => {
          setActionModal(null);
          setSelectedReservation(null);
          setMotivoRechazo('');
        }}
        title={actionModal === 'approve' ? 'Aprobar Reserva' : 'Rechazar Reserva'}
      >
        {selectedReservation && (
          <div className="space-y-4">
            <p>
              ¿Estás seguro de que deseas{' '}
              {actionModal === 'approve' ? 'aprobar' : 'rechazar'} esta reserva?
            </p>
            {actionModal === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del rechazo
                </label>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  rows={3}
                  className="input"
                  placeholder="Explica el motivo del rechazo..."
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setActionModal(null);
                  setSelectedReservation(null);
                  setMotivoRechazo('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant={actionModal === 'approve' ? 'primary' : 'danger'}
                onClick={() =>
                  handleStatusChange(actionModal === 'approve' ? 'RESERVADA' : 'LIBRE')
                }
              >
                {actionModal === 'approve' ? 'Aprobar' : 'Rechazar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

