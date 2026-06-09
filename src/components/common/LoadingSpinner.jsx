import { Spinner } from 'react-bootstrap';

/**
 * LoadingSpinner — Consistent loading indicator (DRY)
 * 
 * @param {string} message - Optional loading message
 * @param {boolean} fullPage - Whether to center in full viewport
 */
function LoadingSpinner({ message = 'Loading...', fullPage = false }) {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-5">
      <Spinner
        animation="border"
        role="status"
        style={{ color: 'var(--color-brand-secondary)', width: 40, height: 40 }}
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;
