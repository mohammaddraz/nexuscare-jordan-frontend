import api from './api';

export const adminService = {
  /**
   * Get dashboard stats
   * @returns {Promise<Object>}
   */
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  /**
   * Get pending consumers
   * @returns {Promise<Array>}
   */
  getPendingConsumers: async () => {
    return await api.get('/admin/pending-consumers');
  },

  /**
   * Update consumer status
   * @param {string} patientId 
   * @param {string} status 'Approved' | 'Rejected'
   */
  updateConsumerStatus: async (patientId, status) => {
    return await api.put(`/admin/approve-consumer/${patientId}`, { status });
  },

  /**
   * Get pending certifications
   */
  getPendingCertifications: async () => {
    return await api.get('/admin/certifications');
  },

  /**
   * Update provider certification status
   * @param {string} id 
   * @param {string} status 'Approved' | 'Flagged'
   * @returns {Promise<Object>}
   */
  updateCertificationStatus: async (id, status) => {
    return await api.put(`/admin/certifications/${id}`, { status });
  },

  /**
   * Get system administrators
   * @returns {Promise<Array>}
   */
  getAdmins: async () => {
    return await api.get('/admin/admins');
  },

  /**
   * Get provider directory
   * @returns {Promise<Array>}
   */
  getProviderDirectory: async () => {
    return await api.get('/admin/providers');
  },

  /**
   * Get all coverage modification requests
   * @returns {Promise<Array>}
   */
  getCoverageRequests: async () => {
    return await api.get('/admin/coverage-requests');
  },

  /**
   * Approve or reject a coverage request
   * @param {string} id 
   * @param {string} status 'Approved' | 'Rejected'
   * @param {string} adminNotes optional notes
   * @returns {Promise<Object>}
   */
  updateCoverageRequest: async (id, status, adminNotes) => {
    return await api.put(`/admin/coverage-requests/${id}`, { status, admin_notes: adminNotes });
  },

  // -- Insurance Networks --
  getInsuranceCompanies: async () => {
    return await api.get('/admin/insurance-companies');
  },
  getProviderNetworks: async () => {
    return await api.get('/admin/provider-networks');
  },
  assignProviderToNetwork: async (data) => {
    return await api.post('/admin/provider-networks', data);
  },
  removeProviderFromNetwork: async (providerId, companyId) => {
    return await api.delete(`/admin/provider-networks/${providerId}/${companyId}`);
  },
  
  // -- Manage All Consumers --
  getAllConsumers: async () => {
    return await api.get('/admin/consumers');
  },
  updateConsumerDetails: async (id, data) => {
    const response = await api.put(`/admin/consumers/${id}`, data);
    return response.data;
  },

  getClaims: async () => {
    const response = await api.get('/admin/claims');
    return response.data;
  },

  processClaim: async (id, status) => {
    const response = await api.put(`/admin/claims/${id}/process`, { status });
    return response.data;
  }
};
