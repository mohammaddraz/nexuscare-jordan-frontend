import { Navbar as BsNavbar, Container, Nav, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HeartHandshake,
  Users,
  Stethoscope,
  ShieldCheck,
  LogOut,
  Activity,
} from 'lucide-react';

/**
 * Navbar — Main navigation header (NexusCare style)
 * Shows role-specific navigation links + portal switcher (for demo)
 * Glassmorphism header effect from the reference project
 */

// Navigation links per role
const navLinks = {
  CONSUMER: [
    { path: '/consumer/family-hub', label: 'Family Hub', icon: Users },
    { path: '/consumer/coverage-config', label: 'Coverage' },
    { path: '/consumer/provider-assignment', label: 'Find Provider' },
    { path: '/consumer/medical-records', label: 'Records' },
    { path: '/consumer/claims', label: 'Claims' },
  ],
  PROVIDER: [
    { path: '/provider/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/provider/patient-enrollment', label: 'Enrollment' },
    { path: '/provider/clinical-logging', label: 'Patient Logging' },
    { path: '/provider/coverage-verification', label: 'Verify Coverage' },
  ],
  ADMIN: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/admin/verification-gateway', label: 'Verify Doctors' },
    { path: '/admin/network-directory', label: 'Provider Directory' },
    { path: '/admin/manage-admins', label: 'Manage Admins' },
  ],
};

// Role display config
const roleConfig = {
  CONSUMER: { label: 'Consumer Family', icon: Users, color: '#10b981' },
  PROVIDER: { label: 'Medical Center', icon: Stethoscope, color: '#006a61' },
  ADMIN: { label: 'MOH Admin', icon: ShieldCheck, color: '#131b2e' },
};

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const role = currentUser.role;
  const links = navLinks[role] || [];
  const config = roleConfig[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar
      expand="lg"
      className="glass-header sidebar-navbar px-3 py-2"
      style={{ zIndex: 50 }}
    >
      <Container fluid className="d-flex flex-lg-column h-100 p-0">
        {/* Brand Logo */}
        <BsNavbar.Brand
          onClick={() => navigate(links[0]?.path || '/')}
          style={{ cursor: 'pointer' }}
          className="d-flex align-items-center gap-2 animate-fadeIn"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 38,
              height: 38,
              backgroundColor: 'var(--color-brand-primary)',
              boxShadow: '0 2px 8px rgba(19, 27, 46, 0.15)',
            }}
          >
            <HeartHandshake size={20} color="#34d399" />
          </div>
          <div>
            <div className="d-flex align-items-baseline gap-1">
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-brand-primary)', letterSpacing: '-0.02em' }}>
                NexusCare
              </span>
              <span
                className="px-2 py-0 rounded"
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-brand-secondary)',
                  backgroundColor: 'var(--color-emerald-50)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                }}
              >
                Jordan
              </span>
            </div>
            <p className="mb-0" style={{ fontSize: '0.6rem', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
              MOH Coverage Auditing Platform
            </p>
          </div>
        </BsNavbar.Brand>

        {/* Active Role Indicator */}
        <div
          className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-3 mx-3"
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--color-border-default)',
          }}
        >
          <span
            className="animate-pulse rounded-circle"
            style={{ width: 8, height: 8, display: 'inline-block', backgroundColor: 'var(--color-success)' }}
          />
          <span>
            Active: <strong style={{ color: 'var(--color-text-primary)' }}>{config.label}</strong>
          </span>
        </div>

        <BsNavbar.Toggle aria-controls="main-nav" />

        <BsNavbar.Collapse id="main-nav" className="w-100 d-lg-flex flex-lg-column align-items-lg-start flex-grow-1">
          {/* Navigation Links */}
          <Nav className="me-auto w-100 mt-lg-4 flex-lg-column">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Nav.Link
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="mx-1 px-3 py-2 rounded-3"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? '#fff' : 'transparent',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    border: isActive ? '1px solid var(--color-border-default)' : '1px solid transparent',
                    transition: 'all var(--transition-default)',
                  }}
                >
                  {link.label}
                </Nav.Link>
              );
            })}
          </Nav>

          {/* User Menu */}
          <div className="sidebar-user-container">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="d-flex align-items-center gap-2 rounded-3 border"
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
                id="user-dropdown"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="rounded-circle"
                    style={{ width: 24, height: 24, objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: 'var(--color-brand-primary)',
                      color: '#34d399',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                    }}
                  >
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <span className="d-none d-lg-inline">{currentUser.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {config.label} Portal
                </Dropdown.Header>
                <Dropdown.Item style={{ fontSize: '0.8rem' }}>{currentUser.email}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => navigate('/profile')} 
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                >
                  My Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger"
                  style={{ fontSize: '0.8rem', fontWeight: 600 }}
                >
                  <LogOut size={14} />
                  Lock Gate
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
