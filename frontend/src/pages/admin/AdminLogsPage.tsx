import { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { Log } from '../../types';
import { Badge } from '../../components/Badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { FileText, Filter } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const AdminLogsPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    reservationId: '',
    action: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadLogs();
  }, [filters, pagination.page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getLogs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Error al cargar logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'created':
        return <Badge variant="info">Creado</Badge>;
      case 'approved':
        return <Badge variant="success">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rechazado</Badge>;
      case 'comprobante_uploaded':
        return <Badge variant="warning">Comprobante Subido</Badge>;
      default:
        return <Badge variant="default">{action}</Badge>;
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <FileText className="mr-3 text-primary-600" size={32} />
        Logs del Sistema
      </h1>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-primary-600" size={20} />
          <h2 className="font-semibold">Filtros</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="ID de Reserva"
            value={filters.reservationId}
            onChange={(e) => setFilters({ ...filters, reservationId: e.target.value })}
            placeholder="Filtrar por ID de reserva..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="input"
            >
              <option value="">Todas</option>
              <option value="created">Creado</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="comprobante_uploaded">Comprobante Subido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reserva
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.user ? (
                    <div>
                      <div className="text-sm font-medium">{log.user.nombre}</div>
                      <div className="text-sm text-gray-500">{log.user.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Sistema</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {log.reservationId ? (
                    <code className="text-xs">{log.reservationId.substring(0, 8)}...</code>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {log.detalles ? (
                    <details>
                      <summary className="cursor-pointer text-primary-600">Ver detalles</summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">
                        {log.detalles}
                      </pre>
                    </details>
                  ) : (
                    '-'
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
    </div>
  );
};

