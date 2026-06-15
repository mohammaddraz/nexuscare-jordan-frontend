import { Alert } from 'react-bootstrap';
import { AlertCircle, X } from 'lucide-react';
import './ErrorAlert.css';

/**
 * ErrorAlert — Consistent error display (DRY, centralized error handling)
 * 
 * @param {string} message - Error message to display
 * @param {function} onClose - Optional close handler
 * @param {string} variant - Bootstrap alert variant: 'danger' | 'warning' | 'info'
 */
function ErrorAlert({ message, onClose, variant = 'danger' }) {
  if (!message) return null;

  return (
    <Alert
      variant={variant}
      className="d-flex align-items-center gap-2 animate-fadeIn error-alert"
      dismissible={!!onClose}
      onClose={onClose}
    >
      <AlertCircle size={16} />
      <span>{message}</span>
    </Alert>
  );
}

export default ErrorAlert;
