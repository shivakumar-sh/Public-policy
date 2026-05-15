import api from './api';

const policyService = {
  getPolicies: () => api.get('/policies').then(res => res.data),
  getPolicyById: (id) => api.get(`/policies/${id}`).then(res => res.data),
  createPolicy: (data) => api.post('/policies', data).then(res => res.data),
  updatePolicy: (id, data) => api.put(`/policies/${id}`, data).then(res => res.data),
  deletePolicy: (id) => api.delete(`/policies/${id}`).then(res => res.data),
  simplify: (id) => api.post(`/policies/${id}/simplify`).then(res => res.data),
};

export default policyService;
