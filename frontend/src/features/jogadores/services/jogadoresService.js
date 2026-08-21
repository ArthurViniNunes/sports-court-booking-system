import api from '../../../services/api';

export const jogadoresService = {
  getAll: async () => {
    const response = await api.get('/jogadores');

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/jogadores/${id}`);

    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/jogadores', data);

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/jogadores/${id}`, data);

    return response.data;
  },

  updateSenha: async (id, data) => {
    const response = await api.put(`/jogadores/${id}/senha`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/jogadores/${id}`);
  },
};