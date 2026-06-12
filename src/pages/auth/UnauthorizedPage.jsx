import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ShieldOff, ArrowLeft } from 'lucide-react';

/**
 * UnauthorizedPage — Shown when a user tries to access a role-restricted route
 */
function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="text-center animate-fadeIn">
        <div
          className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 80, height: 80, backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <ShieldOff size={40} color="var(--color-danger)" />
        </div>
        <h2 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>Access Denied</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: 400, margin: '0 auto' }}>
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
