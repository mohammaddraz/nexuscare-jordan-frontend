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
import './Navbar.css';

/**
 * Navbar — Main navigation header (SehaGrid style)
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
    { path: '/admin/consumer-approvals', label: 'Consumer Approvals' },
    { path: '/admin/coverage-requests', label: 'Coverage Requests' },
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
      className="glass-header sidebar-navbar px-3 py-2 navbar-wrapper"
    >
      <Container fluid className="d-flex flex-lg-column h-100 p-0">
        {/* Brand Logo */}
        <BsNavbar.Brand
          onClick={() => navigate(links[0]?.path || '/')}
          className="d-flex align-items-center gap-2 animate-fadeIn navbar-brand-link"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3 navbar-brand-logo"
          >
            <HeartHandshake size={20} color="#34d399" />
          </div>
          <div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="navbar-brand-name">
                SehaGrid
              </span>
              <span
                className="px-2 py-0 rounded navbar-brand-tag"
              >
                Jordan
              </span>
            </div>
            <p className="mb-0 navbar-brand-subtitle">
              MOH Coverage Auditing Platform
            </p>
          </div>
        </BsNavbar.Brand>

        {/* Active Role Indicator */}
        <div
          className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-3 mx-3 navbar-role-indicator"
        >
          <span
            className="animate-pulse rounded-circle navbar-role-dot"
          />
          <span>
            Active: <strong className="navbar-role-label">{config.label}</strong>
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
                  className={`mx-1 px-3 py-2 rounded-3 navbar-nav-link ${isActive ? 'navbar-nav-link--active' : 'navbar-nav-link--inactive'}`}
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
                className="d-flex align-items-center gap-2 rounded-3 border navbar-user-toggle"
                id="user-dropdown"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="rounded-circle navbar-user-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center navbar-user-initials"
                  >
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <span className="d-none d-lg-inline">{currentUser.name}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header className="navbar-dropdown-header">
                  {config.label} Portal
                </Dropdown.Header>
                <Dropdown.Item className="navbar-dropdown-item">{currentUser.email}</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => navigate('/profile')} 
                  className="navbar-dropdown-item--action"
                >
                  My Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger navbar-dropdown-item--action"
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
