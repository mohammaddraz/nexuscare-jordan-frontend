import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog — Reusable confirmation modal (DRY)
 * Used for destructive actions: delete provider, reject registration, etc.
 * 
 * @param {boolean} show - Whether modal is visible
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm action handler
 * @param {string} title - Dialog title
 * @param {string} message - Confirmation message
 * @param {string} confirmLabel - Confirm button text
 * @param {string} variant - Confirm button variant: 'danger' | 'primary' | 'secondary'
 */
function ConfirmDialog({
  show,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  variant = 'danger',
}) {
  return (
    <Modal show={show} onHide={onClose} centered size="sm">
      <Modal.Body className="text-center p-4">
        <div
          className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
          style={{
            width: 56,
            height: 56,
            backgroundColor: variant === 'danger' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 106, 97, 0.08)',
          }}
        >
          <AlertTriangle
            size={28}
            color={variant === 'danger' ? 'var(--color-danger)' : 'var(--color-brand-secondary)'}
          />
        </div>

        <h5 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h5>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {message}
        </p>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="light"
            size="sm"
            onClick={onClose}
            style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={() => { onConfirm(); onClose(); }}
            style={{ fontWeight: 600, fontSize: '0.8rem', minWidth: 80 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDialog;
