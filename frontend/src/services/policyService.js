import api from './api';

export const getPolicies = (params) => api.get('/policies', { params });
export const getPolicyById = (id) => api.get(`/policies/${id}`);
export const createPolicy = (data) => api.post('/policies', data);
export const updatePolicy = (id, data) => api.put(`/policies/${id}`, data);
export const deletePolicy = (id) => api.delete(`/policies/${id}`);
export const simplifyPolicy = (id, language) => api.post(`/policies/${id}/simplify`, { language });
export const generateFAQ = (id, language) => api.post(`/policies/${id}/faq`, { language });
export const comparePolicies = (p1, p2, language) => api.post('/policies/compare', { policy1Id: p1, policy2Id: p2, language });

const policyService = {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  simplifyPolicy,
  generateFAQ,
  comparePolicies
};

export default policyService;
