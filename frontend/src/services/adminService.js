import api from './api';

const adminService = {
  getUsers: () => api.get('/admin/users').then(res => res.data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}`, { role }).then(res => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(res => res.data),
  getStats: () => api.get('/admin/stats').then(res => res.data),
};

export default adminService;
