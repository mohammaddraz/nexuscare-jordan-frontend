import axios from 'axios';

/**
 * api.js — Centralized Axios instance
 * 
 * Separation of Concerns: All HTTP logic is centralized here.
 * Error Handling: Interceptors catch and format errors consistently.
 * 
 * When backend is ready:
 * - Request interceptor adds JWT token to headers
 * - Response interceptor handles 401 (token expired) → auto-logout
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor: Attach auth token ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexuscare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- Response Interceptor: Centralized error handling ----
api.interceptors.response.use(
  (response) => {
    // Return only the data payload
    return response.data;
  },
  (error) => {
    // Format error consistently
    const formattedError = {
      message: 'An unexpected error occurred',
      status: null,
      data: null,
    };

    if (error.response) {
      // Server responded with error status
      formattedError.status = error.response.status;
      formattedError.message = error.response.data?.message || error.message;
      formattedError.data = error.response.data;

      // Handle 401 Unauthorized → auto-logout
      if (error.response.status === 401) {
        localStorage.removeItem('nexuscare_user');
        localStorage.removeItem('nexuscare_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Network error (no response received)
      formattedError.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(formattedError);
  }
);

export default api;
