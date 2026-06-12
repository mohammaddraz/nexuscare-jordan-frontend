import api from './api';

export const providerService = {
  /**
   * Get pending PCP assignments
   * @returns {Promise<Array>}
   */
  getPendingAssignments: async () => {
    return await api.get('/providers/assignments');
  },

  /**
   * Update assignment status
   * @param {string} id 
   * @param {string} status 'Approved' | 'Rejected'
   * @returns {Promise<Object>}
   */
  updateAssignmentStatus: async (id, status) => {
    return await api.put(`/providers/assignments/${id}`, { status });
  },

  /**
   * Get provider's assigned patients
   * @returns {Promise<Array>}
   */
  getMyPatients: async () => {
    return await api.get('/providers/patients');
  },

  /**
   * Add a medical record
   * @param {Object} data { patient_id, diagnosis, icd_code, prescription, notes }
   * @returns {Promise<Object>}
   */
  addMedicalRecord: async (data) => {
    return await api.post('/providers/clinical-log', data);
  },

  /**
   * Submit a claim
   * @param {Object} data { patient_id, claim_type, billing_code, amount, deductible_applied }
   * @returns {Promise<Object>}
   */
  submitClaim: async (data) => {
    const response = await api.post('/providers/claims', data);
    return response;
  },

  verifyCoverage: async (nationalId) => {
    const response = await api.get(`/providers/verify/${nationalId}`);
    return response;
  }
};
