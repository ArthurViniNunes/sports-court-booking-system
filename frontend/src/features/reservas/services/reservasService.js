import api from '../../../services/api';

export const reservasService = {
  create: async (data) => {
    const response = await api.post('/reservas', data);
    return response.data;
  },
  getByJogador: async (jogadorId) => {
    const response = await api.get(`/reservas/jogador/${jogadorId}`);
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