import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import './UnauthorizedPage.css';

/**
 * UnauthorizedPage — Shown when a user tries to access a role-restricted route
 */
function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 unauthorized-page-bg">
      <div className="text-center animate-fadeIn">
        <div
          className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center unauthorized-page-icon"
        >
          <ShieldOff size={40} color="var(--color-danger)" />
        </div>
        <h2 className="fw-bold mb-2 unauthorized-page-title">Access Denied</h2>
        <p className="unauthorized-page-text">
          You don't have permission to access this page. Please contact your system administrator if you believe this is an error.
        </p>
        <Button variant="primary" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} className="me-2" /> Go Back
        </Button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
