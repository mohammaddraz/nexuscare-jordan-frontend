import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — Role-based access guard (RBAC)
 * Wraps page components to enforce authentication and role requirements
 * 
 * @param {React.ReactNode} children - The protected page component
 * @param {string[]} allowedRoles - Array of roles allowed (e.g., ['ADMIN', 'PROVIDER'])
 * 
 * Usage in AppRouter:
 *   <Route path="/admin/*" element={
 *     <ProtectedRoute allowedRoles={['ADMIN']}>
 *       <AdminLayout />
 *     </ProtectedRoute>
 *   } />
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, currentUser } = useAuth();

  // Not logged in → redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render the page
  return children;
}

export default ProtectedRoute;
