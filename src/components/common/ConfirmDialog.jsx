import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

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
          className={`d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle confirm-dialog-icon-wrapper ${variant === 'danger' ? 'confirm-dialog-icon-wrapper--danger' : 'confirm-dialog-icon-wrapper--default'}`}
        >
          <AlertTriangle
            size={28}
            color={variant === 'danger' ? 'var(--color-danger)' : 'var(--color-brand-secondary)'}
          />
        </div>

        <h5 className="confirm-dialog-title">{title}</h5>
        <p className="confirm-dialog-message">
          {message}
        </p>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="light"
            size="sm"
            onClick={onClose}
            className="confirm-dialog-btn"
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={() => { onConfirm(); onClose(); }}
            className="confirm-dialog-btn"
          >
            {confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDialog;
