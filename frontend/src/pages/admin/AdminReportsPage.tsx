import { useEffect, useState } from 'react';
import { adminService, spaceService } from '../../services/api';
import { Space } from '../../types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';
import { BarChart3, Euro, TrendingUp } from 'lucide-react';

export const AdminReportsPage = () => {
  const [report, setReport] = useState<any>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fechaDesde: '',
    fechaHasta: '',
    spaceId: '',
  });

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const data = await spaceService.getAll();
      setSpaces(data);
    } catch (error) {
      console.error('Error al cargar pistas:', error);
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReports(filters);
      setReport(data);
    } catch (error) {
      toast.error('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.fechaDesde || filters.fechaHasta) {
      loadReport();
    }
  }, [filters]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <BarChart3 className="mr-3 text-primary-600" size={32} />
        Reportes de Ingresos
      </h1>

      {/* Filtros */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Filtros</h2>
        <div className="grid md:grid-cols-3 gap-4">
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
        <Button onClick={loadReport} className="mt-4">
          Generar Reporte
        </Button>
      </div>

      {/* Reporte */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Resumen general */}
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-1">Total Recaudado</p>
                <p className="text-4xl font-bold">€{report.total?.toFixed(2) || '0.00'}</p>
              </div>
              <Euro size={48} className="text-primary-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-primary-400">
              <p className="text-primary-100">
                Total de Reservas: <strong>{report.totalReservas || 0}</strong>
              </p>
            </div>
          </div>

          {/* Por pista */}
          {report.porPista && Object.keys(report.porPista).length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-primary-600" size={24} />
                Ingresos por Pista
              </h2>
              <div className="space-y-4">
                {Object.entries(report.porPista).map(([pista, data]: [string, any]) => (
                  <div key={pista} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{pista}</h3>
                      <span className="text-lg font-bold text-primary-600">
                        €{data.total?.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {data.count} reserva{data.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Selecciona un rango de fechas para generar el reporte</p>
        </div>
      )}
    </div>
  );
};

