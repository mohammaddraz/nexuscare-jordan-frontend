import { Container } from 'react-bootstrap';
import { HeartHandshake } from 'lucide-react';
import './Footer.css';

/**
 * Footer — Consistent footer across all pages
 */
function Footer() {
  return (
    <footer className="py-4 mt-auto footer-wrapper">
      <Container fluid className="px-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          {/* Brand */}
          <div className="d-flex align-items-center gap-2">
            <HeartHandshake size={16} color="var(--color-brand-secondary)" />
            <span className="footer-brand-name">
              SehaGrid Jordan
            </span>
            <span className="footer-brand-subtitle">
              — MOH Coverage Auditing Platform
            </span>
          </div>

          {/* Copyright */}
          <p className="mb-0 footer-copyright">
            © {new Date().getFullYear()} SehaGrid Jordan. Ministry of Health Certified.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
