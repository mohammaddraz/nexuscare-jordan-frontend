import { Container } from 'react-bootstrap';
import { HeartHandshake } from 'lucide-react';

/**
 * Footer — Consistent footer across all pages
 */
function Footer() {
  return (
    <footer
      className="py-4 mt-auto"
      style={{
        borderTop: '1px solid var(--color-border-default)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <Container fluid className="px-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          {/* Brand */}
          <div className="d-flex align-items-center gap-2">
            <HeartHandshake size={16} color="var(--color-brand-secondary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              NexusCare Jordan
            </span>
            <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
              — MOH Coverage Auditing Platform
            </span>
          </div>

          {/* Copyright */}
          <p className="mb-0" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} NexusCare Jordan. Ministry of Health Certified.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
