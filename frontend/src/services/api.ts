import axios from 'axios';
import { User, Space, Reservation } from '../types';

// En producción, VITE_API_URL debe estar configurado
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Validación en producción
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error('❌ Error: VITE_API_URL no está configurado en producción');
  console.error('💡 Configura VITE_API_URL en Netlify con la URL de tu backend (ej: https://tu-backend.onrender.com)');
}

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API_URL configurada:', API_URL);
} else {
  console.log('🌐 API_URL en producción:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error de red (CORS, conexión, etc.)
    if (!error.response) {
      console.error('❌ Error de conexión:', error.message);
      console.error('💡 Verifica que:');
      console.error('   1. VITE_API_URL esté configurado correctamente en Netlify');
      console.error('   2. El backend esté funcionando en Render');
      console.error('   3. CORS esté habilitado en el backend');
      console.error('   URL intentada:', error.config?.url);
      console.error('   Base URL:', error.config?.baseURL);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Error de CORS
    if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
      console.error('❌ Error de CORS detectado');
      console.error('💡 Asegúrate de que el backend permita el origen de Netlify');
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (data: {
    nombre: string;
    email: string;
    dni: string;
    password: string;
    specialRole?: boolean;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const spaceService = {
  getAll: async (): Promise<Space[]> => {
    const { data } = await api.get('/spaces');
    return data;
  },
  getById: async (id: string): Promise<Space> => {
    const { data } = await api.get(`/spaces/${id}`);
    return data;
  },
  getAvailability: async (id: string, fecha: string) => {
    const { data } = await api.get(`/spaces/${id}/availability`, {
      params: { fecha },
    });
    return data;
  },
  update: async (id: string, data: Partial<Space>) => {
    const response = await api.patch(`/spaces/${id}`, data);
    return response.data;
  },
};

export const reservationService = {
  create: async (data: {
    spaceId: string;
    fecha: string;
    franja: string;
    luz?: boolean;
    dni?: string;
  }) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  getMyReservations: async (): Promise<Reservation[]> => {
    const { data } = await api.get('/reservations/my-reservations');
    return data;
  },
  getById: async (id: string): Promise<Reservation> => {
    const { data } = await api.get(`/reservations/${id}`);
    return data;
  },
  uploadComprobante: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('comprobante', file);
    const { data } = await api.post(`/reservations/${id}/comprobante`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/reservations/${id}`);
    return data;
  },
};

export const adminService = {
  getReservations: async (params?: {
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    spaceId?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get('/admin/reservations', { params });
    return data;
  },
  updateReservationStatus: async (
    id: string,
    estado: 'RESERVADA' | 'LIBRE',
    motivoRechazo?: string
  ) => {
    const { data } = await api.patch(`/reservations/${id}/status`, {
      estado,
      motivoRechazo,
    });
    return data;
  },
  getPendingUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users/pending-special');
    return data;
  },
  approveSpecialRole: async (userId: string, aprobar: boolean, comentario?: string) => {
    const { data } = await api.patch(`/admin/users/${userId}/special-role`, {
      aprobar,
      comentario,
    });
    return data;
  },
  getReports: async (params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    spaceId?: string;
  }) => {
    const { data } = await api.get('/admin/reports/revenue', { params });
    return data;
  },
  getLogs: async (params?: {
    reservationId?: string;
    action?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get('/admin/logs', { params });
    return data;
  },
  exportReservations: async (params?: {
    fechaDesde?: string;
    fechaHasta?: string;
  }) => {
    const { data } = await api.get('/admin/export/reservations', {
      params,
      responseType: 'blob',
    });
    return data;
  },
};

export const userService = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/users/profile');
    return data;
  },
  contact: async (asunto: string, mensaje: string) => {
    const { data } = await api.post('/users/contact', { asunto, mensaje });
    return data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

export const legalService = {
  getPage: async (page: string) => {
    const { data } = await api.get(`/legal/${page}`);
    return data;
  },
};

