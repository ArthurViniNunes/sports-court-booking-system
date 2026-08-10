import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, jogador } = response.data;

    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set('jogador', JSON.stringify(jogador), { expires: 1 });

    return jogador;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('jogador');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const jogador = Cookies.get('jogador');
    return jogador ? JSON.parse(jogador) : null;
  }
};