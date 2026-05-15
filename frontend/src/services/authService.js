import api from './api';

const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data),
  updateProfile: (userData) => api.put('/auth/profile', userData).then(res => res.data),
};

export default authService;
