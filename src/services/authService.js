import api from './api';

export const authService = {
  /**
   * Register a new Consumer
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  registerConsumer: async (data) => {
    return await api.post('/auth/register/consumer', data);
  },

  /**
   * Register a new Provider
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  registerProvider: async (data) => {
    return await api.post('/auth/register/provider', data);
  },

  /**
   * Log in user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} { user, token }
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  }
};
