import { useEffect, useState } from 'react';
import { spaceService } from '../../services/api';
import { Space } from '../../types';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import toast from 'react-hot-toast';
import { MapPin, Edit, Check } from 'lucide-react';
import { getSpaceImage } from '../../utils/images';

export const AdminSpacesPage = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precioBase: 0,
    precioEspecial: 0,
    luzPrecio: 0,
    luzIncluida: false,
    disponible: true,
  });

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const data = await spaceService.getAll();
      setSpaces(data);
    } catch (error) {
      toast.error('Error al cargar pistas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      nombre: space.nombre,
      precioBase: space.precioBase,
      precioEspecial: space.precioEspecial,
      luzPrecio: space.luzPrecio,
      luzIncluida: space.luzIncluida,
      disponible: space.disponible,
    });
  };

  const handleSave = async () => {
    if (!editingSpace) return;

    try {
      await spaceService.update(editingSpace.id, formData);
      toast.success('Pista actualizada exitosamente');
      setEditingSpace(null);
      loadSpaces();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar pista');
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
        <MapPin className="mr-3 text-primary-600" size={32} />
        Gestión de Pistas
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {spaces.map((space) => {
          const spaceImage = getSpaceImage(space.nombre, space.tipo || '');
          return (
            <div key={space.id} className="card p-0 overflow-hidden">
              {/* Imagen de la pista */}
              <div className="relative h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={spaceImage} 
                  alt={space.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(space)} className="bg-white/90 hover:bg-white shadow-lg">
                    <Edit size={16} className="mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{space.nombre}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio General:</span>
                    <span className="font-medium">€{space.precioBase.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio Especial:</span>
                    <span className="font-medium">€{space.precioEspecial.toFixed(2)}</span>
                  </div>
                  {!space.luzIncluida && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio Luz:</span>
                      <span className="font-medium">€{space.luzPrecio.toFixed(2)}</span>
                    </div>
                  )}
                  {space.luzIncluida && (
                    <div className="text-primary-600 font-medium">Luz incluida</div>
                  )}
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Estado:</span>
                    <span className={space.disponible ? 'text-green-600' : 'text-red-600'}>
                      {space.disponible ? 'Disponible' : 'No Disponible'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de edición */}
      <Modal
        isOpen={!!editingSpace}
        onClose={() => {
          setEditingSpace(null);
        }}
        title="Editar Pista"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Precio Base (€)"
              type="number"
              step="0.01"
              value={formData.precioBase}
              onChange={(e) =>
                setFormData({ ...formData, precioBase: parseFloat(e.target.value) })
              }
            />

            <Input
              label="Precio Especial (€)"
              type="number"
              step="0.01"
              value={formData.precioEspecial}
              onChange={(e) =>
                setFormData({ ...formData, precioEspecial: parseFloat(e.target.value) })
              }
            />
          </div>

          {!formData.luzIncluida && (
            <Input
              label="Precio Luz (€)"
              type="number"
              step="0.01"
              value={formData.luzPrecio}
              onChange={(e) =>
                setFormData({ ...formData, luzPrecio: parseFloat(e.target.value) })
              }
            />
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="luzIncluida"
              checked={formData.luzIncluida}
              onChange={(e) => setFormData({ ...formData, luzIncluida: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="luzIncluida" className="text-sm text-gray-700">
              Luz incluida en el precio
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="disponible"
              checked={formData.disponible}
              onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="disponible" className="text-sm text-gray-700">
              Disponible
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setEditingSpace(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Check size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

