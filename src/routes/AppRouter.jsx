import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Layout components
import MainLayout from '../components/layout/MainLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';
import TermsPage from '../pages/auth/TermsPage';
import ProfilePage from '../pages/auth/ProfilePage';

// Consumer Portal pages
import FamilyHubPage from '../pages/consumer/FamilyHubPage';
import CoverageConfigPage from '../pages/consumer/CoverageConfigPage';
import ProviderAssignmentPage from '../pages/consumer/ProviderAssignmentPage';
import MedicalRecordsPage from '../pages/consumer/MedicalRecordsPage';
import ClaimsPage from '../pages/consumer/ClaimsPage';

// Provider Portal pages
import PracticeDashboardPage from '../pages/provider/PracticeDashboardPage';
import PatientEnrollmentPage from '../pages/provider/PatientEnrollmentPage';
import ClinicalLoggingPage from '../pages/provider/ClinicalLoggingPage';
import CoverageVerificationPage from '../pages/provider/CoverageVerificationPage';

// Admin Portal pages
import ComplianceDashboardPage from '../pages/admin/ComplianceDashboardPage';
import VerificationGatewayPage from '../pages/admin/VerificationGatewayPage';
import NetworkDirectoryPage from '../pages/admin/NetworkDirectoryPage';
import ManageAdminsPage from '../pages/admin/ManageAdminsPage';
import ConsumerApprovalPage from '../pages/admin/ConsumerApprovalPage';

/**
 * AppRouter — Central route definitions
 * Organizes routes by portal with role-based protection
 * 
 * Route naming: kebab-case (e.g., /consumer/family-hub)
 */
function AppRouter() {
  const { isAuthenticated, currentUser } = useAuth();

  /**
   * Determine the default redirect path based on user role
   */
  const getDefaultPath = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'CONSUMER': return '/consumer/family-hub';
      case 'PROVIDER': return '/provider/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* ---- Public Routes ---- */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getDefaultPath()} replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to={getDefaultPath()} replace /> : <RegisterPage />
      } />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ---- Protected Routes (wrapped in MainLayout) ---- */}
      <Route element={
        <ProtectedRoute allowedRoles={['CONSUMER', 'PROVIDER', 'ADMIN']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        {/* Global Protected Routes */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Consumer Portal Routes */}
        <Route path="/consumer/family-hub" element={
          <ProtectedRoute allowedRoles={['CONSUMER']}>
            <FamilyHubPage />
          </ProtectedRoute>
        } />
        <Route path="/consumer/coverage-config" element={
          <ProtectedRoute allowedRoles={['CONSUMER']}>
            <CoverageConfigPage />
          </ProtectedRoute>
        } />
        <Route path="/consumer/provider-assignment" element={
          <ProtectedRoute allowedRoles={['CONSUMER']}>
            <ProviderAssignmentPage />
          </ProtectedRoute>
        } />
        <Route path="/consumer/medical-records" element={
          <ProtectedRoute allowedRoles={['CONSUMER']}>
            <MedicalRecordsPage />
          </ProtectedRoute>
        } />
        <Route path="/consumer/claims" element={
          <ProtectedRoute allowedRoles={['CONSUMER']}>
            <ClaimsPage />
          </ProtectedRoute>
        } />

        {/* Provider Portal Routes */}
        <Route path="/provider/dashboard" element={
          <ProtectedRoute allowedRoles={['PROVIDER']}>
            <PracticeDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/provider/patient-enrollment" element={
          <ProtectedRoute allowedRoles={['PROVIDER']}>
            <PatientEnrollmentPage />
          </ProtectedRoute>
        } />
        <Route path="/provider/clinical-logging" element={
          <ProtectedRoute allowedRoles={['PROVIDER']}>
            <ClinicalLoggingPage />
          </ProtectedRoute>
        } />
        <Route path="/provider/coverage-verification" element={
          <ProtectedRoute allowedRoles={['PROVIDER']}>
            <CoverageVerificationPage />
          </ProtectedRoute>
        } />

        {/* Admin Portal Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ComplianceDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/verification-gateway" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <VerificationGatewayPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/network-directory" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <NetworkDirectoryPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-admins" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageAdminsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/consumer-approvals" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ConsumerApprovalPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* ---- Catch-all redirect ---- */}
      <Route path="*" element={<Navigate to={isAuthenticated ? getDefaultPath() : '/login'} replace />} />
    </Routes>
  );
}

export default AppRouter;
