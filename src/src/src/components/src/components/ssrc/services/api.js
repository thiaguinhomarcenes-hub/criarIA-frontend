import axios from 'axios';

const API_URL = 'https://criaria.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  cadastro: (email, senha, nome) =>
    api.post('/auth/cadastro', { email, senha, nome }),
  
  login: (email, senha) =>
    api.post('/auth/login', { email, senha }),
};

export const roteirosService = {
  gerar: (tema, nicho, tom) =>
    api.post('/roteiros/gerar', { tema, nicho, tom }),
  
  gerarImagem: (descricao, estilo) =>
    api.post('/roteiros/gerar-imagem', { descricao, estilo }),
  
  listar: () =>
    api.get('/roteiros/meus-roteiros'),
  
  deletar: (id) =>
    api.delete(`/roteiros/${id}`),
};

export const usuarioService = {
  getPerfil: () =>
    api.get('/usuario/perfil'),
  
  atualizarPerfil: (nome, instagram) =>
    api.put('/usuario/perfil', { nome, instagram }),
  
  getDashboard: () =>
    api.get('/usuario/dashboard'),
  
  getLimites: () =>
    api.get('/usuario/limites'),
};

export const pagamentoService = {
  checkout: (plano) =>
    api.post('/pagamento/checkout', { plano }),
  
  getStatus: () =>
    api.get('/pagamento/status'),
};

export default api;
