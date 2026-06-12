import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';

/**
 * App Root Component
 * Wraps everything in AuthProvider for global auth state (RBAC)
 */
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
