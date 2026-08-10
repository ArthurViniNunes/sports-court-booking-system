import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, jogador } = response.data;
    
    Cookies.set('token', token, { expires: 1, sameSite: 'strict' });
    Cookies.set('jogador', JSON.stringify(jogador), { expires: 1 });
    
    return jogador;
  },
  
  register: async (dados) => {
    const response = await api.post('/auth/register', dados);
    return response.data;
  },
  
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('jogador');
  },
  
  getCurrentUser: () => {
    const jogador = Cookies.get('jogador');
    return jogador ? JSON.parse(jogador) : null;
  }
};