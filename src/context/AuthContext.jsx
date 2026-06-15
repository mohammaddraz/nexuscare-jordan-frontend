import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext — Manages authentication and RBAC state
 * Roles: CONSUMER | PROVIDER | ADMIN
 * 
 * In the frontend-only phase, we use mock login (no real JWT).
 * When the backend is ready, swap mock logic for real API calls in authService.js
 */

const AuthContext = createContext(null);

let initialUser = null;
const savedUser = localStorage.getItem('sehagrid_user');
const savedToken = localStorage.getItem('sehagrid_token');

if (savedUser && savedToken) {
  try {
    initialUser = JSON.parse(savedUser);
  } catch (err) {
    localStorage.removeItem('sehagrid_user');
    localStorage.removeItem('sehagrid_token');
  }
}

// Initial state
const initialState = {
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  error: null,
};

// Reducer actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

/**
 * AuthProvider — Wrap your app with this to access auth state everywhere
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  const checkAuth = useCallback(() => {
    const savedUser = localStorage.getItem('sehagrid_user');
    const token = localStorage.getItem('sehagrid_token');
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('sehagrid_user');
        localStorage.removeItem('sehagrid_token');
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function utilizing the backend API
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { user, token } = await authService.login(email, password);

      // Store JWT token in localStorage
      localStorage.setItem('sehagrid_user', JSON.stringify(user));
      localStorage.setItem('sehagrid_token', token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'An unexpected error occurred during login.' 
      });
      // Re-throw to allow component to handle it if needed
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('sehagrid_user');
    localStorage.removeItem('sehagrid_token');
    dispatch({ type: 'LOGOUT' });
  }, []);


  // Update user profile
  const updateUser = useCallback((updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    const updatedUser = { ...state.currentUser, ...updates };
    localStorage.setItem('sehagrid_user', JSON.stringify(updatedUser));
  }, [state.currentUser]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    checkAuth,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook — Access auth state and actions from any component
 * Usage: const { currentUser, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
