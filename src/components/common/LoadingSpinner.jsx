import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

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
        className="loading-spinner-icon"
      >
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <p className="loading-spinner-message">
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
