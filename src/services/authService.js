import api from './api';

export const authService = {
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
