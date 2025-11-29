import { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { User } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import toast from 'react-hot-toast';
import { Users, Check, X } from 'lucide-react';

export const AdminUsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      toast.error('Error al cargar usuarios pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (aprobar: boolean) => {
    if (!selectedUser) return;

    try {
      await adminService.approveSpecialRole(selectedUser.id, aprobar, comentario);
      toast.success(aprobar ? 'Rol especial aprobado' : 'Solicitud rechazada');
      setActionModal(null);
      setSelectedUser(null);
      setComentario('');
      loadPendingUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al procesar solicitud');
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
        <Users className="mr-3 text-primary-600" size={32} />
        Usuarios Pendientes de Aprobación
      </h1>

      {pendingUsers.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No hay usuarios pendientes de aprobación</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingUsers.map((user) => (
            <div key={user.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{user.nombre}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>DNI:</strong> {user.dni}
                    </p>
                  </div>
                  <Badge variant="warning" className="mt-2">
                    Pendiente de Aprobación
                  </Badge>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setActionModal('approve');
                    }}
                  >
                    <Check size={18} className="mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setSelectedUser(user);
                      setActionModal('reject');
                    }}
                  >
                    <X size={18} className="mr-2" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de acción */}
      <Modal
        isOpen={actionModal !== null}
        onClose={() => {
          setActionModal(null);
          setSelectedUser(null);
          setComentario('');
        }}
        title={actionModal === 'approve' ? 'Aprobar Rol Especial' : 'Rechazar Solicitud'}
      >
        {selectedUser && (
          <div className="space-y-4">
            <p>
              ¿Estás seguro de que deseas{' '}
              {actionModal === 'approve'
                ? 'aprobar el rol especial para'
                : 'rechazar la solicitud de'}{' '}
              <strong>{selectedUser.nombre}</strong>?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                className="input"
                placeholder="Añade un comentario..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setActionModal(null);
                  setSelectedUser(null);
                  setComentario('');
                }}
              >
                Cancelar
              </Button>
              <Button
                variant={actionModal === 'approve' ? 'primary' : 'danger'}
                onClick={() => handleAction(actionModal === 'approve')}
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

