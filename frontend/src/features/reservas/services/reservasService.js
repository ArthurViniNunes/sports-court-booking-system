import api from '../../../services/api';

export const reservasService = {
  create: async (data) => {
    const response = await api.post('/reservas', data);
    return response.data;
  },
  getByJogador: async (jogadorId, page = 1, limit = 10) => {
    const response = await api.get(`/reservas/jogador/${jogadorId}?page=${page}&limit=${limit}`);

    return response.data;
  },
  getByQuadra: async (quadraId) => {
    const response = await api.get(`/reservas/quadra/${quadraId}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/reservas/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  }
};