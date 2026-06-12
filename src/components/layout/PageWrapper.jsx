import { Container } from 'react-bootstrap';

/**
 * PageWrapper — Consistent page container with title and optional subtitle
 * Provides uniform padding, max-width, and animated entrance
 * 
 * DRY: Reused by every page component instead of duplicating layout code
 * 
 * @param {string} title - Page heading
 * @param {string} subtitle - Optional description below heading
 * @param {React.ReactNode} actions - Optional action buttons on the right
 * @param {React.ReactNode} children - Page content
 */
function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <Container fluid className="px-4 py-4 animate-fadeIn">
      {/* Page Header */}
      {(title || actions) && (
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
          <div>
            {title && (
              <h1
                className="mb-1"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                className="mb-0"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  maxWidth: 600,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="d-flex gap-2">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      {children}
    </Container>
  );
}

export default PageWrapper;
