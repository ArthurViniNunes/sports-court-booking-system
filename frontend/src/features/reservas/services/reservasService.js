import api from '../../../services/api';

export const reservasService = {
  create: async (data) => {
    const response = await api.post('/reservas', data);
    return response.data;
  },
  getByJogador: async (jogadorId, page = 1, limit = 5, filters = {}) => {
    console.log(limit);
    
    const params = new URLSearchParams({ page, limit });
    
    if (filters.quadraId) params.append('quadraId', filters.quadraId);
    if (filters.modalidade) params.append('modalidade', filters.modalidade);
    if (filters.searchTerm) params.append('search', filters.searchTerm);
    if (filters.data) params.append('data', filters.data);

    const response = await api.get(`/reservas/jogador/${jogadorId}?${params.toString()}`);

    return response.data;
  },
  getByQuadra: async (quadraId) => {
    const response = await api.get(`/reservas/quadra/${quadraId}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/reservas/${id}`);
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