import api from './api';

export const consumerService = {
  /**
   * Get family members
   * @returns {Promise<Array>}
   */
  getFamily: async () => {
    return await api.get('/consumers/family');
  },

  /**
   * Get provider directory with optional filters
   * @param {Object} filters { city, specialty, accepting_new }
   * @returns {Promise<Array>}
   */
  getProviders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.accepting_new) params.append('accepting_new', 'true');
    
    return await api.get(`/consumers/providers?${params.toString()}`);
  },

  /**
   * Request a PCP assignment
   * @param {string} patientId 
   * @param {string} providerId 
   * @returns {Promise<Object>}
   */
  requestPCP: async (patientId, providerId) => {
    return await api.post('/consumers/pcp-request', { 
      patient_id: patientId, 
      provider_id: providerId 
    });
  },

  /**
   * Get historical and pending PCP assignments for all family members
   * @returns {Promise<Array>}
   */
  getPCPHistory: async () => {
    return await api.get('/consumers/pcp-history');
  },

  /**
   * Get medical records for a patient
   * @param {string} patientId 
   * @returns {Promise<Array>}
   */
  getMedicalRecords: async (patientId) => {
    return await api.get(`/consumers/records/${patientId}`);
  },

  /**
   * Get claims for a patient
   * @param {string} patientId 
   * @returns {Promise<Array>}
   */
  getClaims: async (patientId) => {
    return await api.get(`/consumers/claims/${patientId}`);
  },

  /**
   * Submit a coverage modification request
   * @param {Object} data { patient_id, current_plan, requested_plan, deductible_preference, rider_dental, rider_vision, rider_maternity }
   * @returns {Promise<Object>}
   */
  submitCoverageRequest: async (data) => {
    return await api.post('/consumers/coverage-request', data);
  },

  /**
   * Get coverage requests for consumer's family
   * @returns {Promise<Array>}
   */
  getCoverageRequests: async () => {
    return await api.get('/consumers/coverage-requests');
  }
};
