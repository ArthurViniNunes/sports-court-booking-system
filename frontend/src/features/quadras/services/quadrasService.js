import api from '../../../services/api';

export const quadrasService = {
  getAll: async () => {
    const response = await api.get('/quadras');

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/quadras/${id}`);

    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/quadras', data);

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/quadras/${id}`, data);

    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/quadras/${id}`);
  },
};