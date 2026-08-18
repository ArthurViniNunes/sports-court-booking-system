import api from '../../../services/api';

export const quadrasService = {
  getAll: async () => {
    const response = await api.get('/quadras');
    return response.data;
  }
};