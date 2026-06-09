import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * AuthContext — Manages authentication and RBAC state
 * Roles: CONSUMER | PROVIDER | ADMIN
 * 
 * In the frontend-only phase, we use mock login (no real JWT).
 * When the backend is ready, swap mock logic for real API calls in authService.js
 */

const AuthContext = createContext(null);

// Initial state
const initialState = {
  currentUser: null,   // { id, name, email, role, avatarUrl }
  isAuthenticated: false,
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

  // Login function (mock for now — replace with real API call later)
  const login = useCallback((role, userId) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Mock user data based on role (will be replaced by authService.login() later)
      const mockUsers = {
        CONSUMER: {
          id: userId || 'MEM-001',
          name: 'Ahmed Al-Amiri',
          email: 'ahmed.amiri@gmail.com',
          role: 'CONSUMER',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        },
        PROVIDER: {
          id: userId || 'PROV-001',
          name: 'Dr. Reem Al-Khalidi',
          email: 'dr.reem@alkhalidi-medical.jo',
          role: 'PROVIDER',
          avatarUrl: null,
        },
        ADMIN: {
          id: userId || 'ADM-001',
          name: 'Faisal Al-Rifai',
          email: 'faisal.rifai@moh.gov.jo',
          role: 'ADMIN',
          avatarUrl: null,
        },
      };

      const user = mockUsers[role];
      if (!user) {
        throw new Error('Invalid role specified');
      }

      // In real app: store JWT token in localStorage
      localStorage.setItem('nexuscare_user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('nexuscare_user');
    localStorage.removeItem('nexuscare_token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Check for existing session on mount
  const checkAuth = useCallback(() => {
    const savedUser = localStorage.getItem('nexuscare_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('nexuscare_user');
      }
    }
  }, []);

  // Update user profile
  const updateUser = useCallback((updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    const updatedUser = { ...state.currentUser, ...updates };
    localStorage.setItem('nexuscare_user', JSON.stringify(updatedUser));
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
