import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/common/ErrorAlert';
import {
  HeartHandshake,
  Stethoscope,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
} from 'lucide-react';
import './LoginPage.css';

/**
 * LoginPage — NexusCare-style split-panel login
 * Left: Dark branded banner
 * Right: Quick-login demo profiles + manual email/password form
 */

// Demo profiles for quick sign-in (matches reference project)
const demoProfiles = [
  {
    role: 'CONSUMER',
    id: 'MEM-001',
    email: 'ahmed.alamiri@gmail.com',
    password: 'password123',
    name: 'Ahmed Al-Amiri',
    subtitle: 'Primary Holder • Platinum Care',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    initials: 'AA',
  },
  {
    role: 'PROVIDER',
    id: 'PROV-001',
    email: 'reem.khalidi@alkhalidi.jo',
    password: 'password123',
    name: 'Dr. Reem Al-Khalidi',
    subtitle: 'Cardiology Specialist • Jordan',
    avatarUrl: null,
    initials: 'RK',
  },
  {
    role: 'ADMIN',
    id: 'ADM-001',
    email: 'layla.mahmoud@moh.gov.jo',
    password: 'password123',
    name: 'Layla Mahmoud',
    subtitle: 'MOH Administrator Portal',
    avatarUrl: null,
    initials: 'LM',
  },
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5 position-relative overflow-hidden login-page-bg"
    >
      {/* Background decorations */}
      <div className="position-absolute rounded-circle login-page-bg-circle-top" />
      <div className="position-absolute rounded-circle login-page-bg-circle-bottom" />

      {/* Login Card */}
      <div
        className="position-relative bg-white border overflow-hidden animate-scaleIn login-page-card"
      >
        <Row className="g-0 h-100">
          {/* Left Banner */}
          <Col md={5} className="d-none d-md-flex flex-column justify-content-between p-4 position-relative text-white login-page-banner">
            {/* Gradient overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 login-page-banner-overlay" />

            {/* Brand */}
            <div className="position-relative login-page-banner-content">
              <div className="d-flex align-items-center gap-2 mb-5">
                <div className="d-flex align-items-center justify-content-center rounded-3 login-page-brand-icon">
                  <HeartHandshake size={20} color="#34d399" />
                </div>
                <div>
                  <span className="d-block fw-bold login-page-brand-name">NexusCare</span>
                  <span className="login-page-brand-tag">Jordan</span>
                </div>
              </div>

              <div className="mt-5">
                <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill mb-3 login-page-hero-badge">
                  <Sparkles size={12} /> MOH Registration Gate
                </span>
                <h2 className="fw-bold mb-3 login-page-hero-title">
                  Secure Audits & Unified Services
                </h2>
                <p className="login-page-hero-desc">
                  Enrolling clinics and family pools under the Ministry of Health guidelines. Enter the portal below.
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="position-relative pt-4 mt-4 login-page-features">
              {[
                { icon: ShieldCheck, label: 'Admin Directory Verification' },
                { icon: Stethoscope, label: 'Physician Provider Network' },
                { icon: Users, label: 'Independent Plan Family Hub' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center justify-content-center rounded login-page-feature-icon">
                    <Icon size={14} color="#34d399" />
                  </div>
                  <span className="login-page-feature-label">{label}</span>
                </div>
              ))}
            </div>
          </Col>

          {/* Right Form Panel */}
          <Col md={7} className="p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="mb-4">
                <h2 className="login-page-form-title">
                  Platform Credentials
                </h2>
                <p className="login-page-form-subtitle">
                  Select an approved identity profile for direct testing access or log in.
                </p>
              </div>

              {error && <ErrorAlert message={error} onClose={clearError} />}

              {/* Quick Login Profiles */}
              <div className="mb-4">
                <span className="login-page-section-label">
                  Approved Demo Profiles
                </span>

                <div className="d-flex flex-column gap-2 mt-2">
                  {demoProfiles.map((profile) => (
                    <button
                      key={profile.role}
                      type="button"
                      onClick={() => handleDemoLogin(profile.email, profile.password)}
                      className="w-100 p-3 rounded-4 border bg-white text-start d-flex align-items-center justify-content-between login-page-profile-btn"
                    >
                      <div className="d-flex align-items-center gap-3">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="rounded-circle border login-page-profile-avatar"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center login-page-profile-initials"
                            style={{
                              backgroundColor: profile.role === 'PROVIDER' ? 'var(--color-brand-primary)' : '#f1f5f9',
                              color: profile.role === 'PROVIDER' ? '#34d399' : 'var(--color-brand-secondary)',
                              border: `1px solid ${profile.role === 'PROVIDER' ? '#334155' : 'var(--color-border-default)'}`,
                            }}
                          >
                            {profile.initials}
                          </div>
                        )}
                        <div>
                          <p className="mb-0 fw-bold login-page-profile-name">
                            {profile.name}
                          </p>
                          <p className="mb-0 login-page-profile-subtitle">
                            {profile.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-3 login-page-profile-action">
                        Sign In
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 login-page-divider-line" />
                <span className="px-3 login-page-divider-text">
                  Or Manual Login
                </span>
                <div className="flex-grow-1 login-page-divider-line" />
              </div>

              {/* Manual Login Form */}
              <Form onSubmit={handleManualLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="position-relative">
                    <Mail
                      size={16}
                      className="position-absolute login-page-input-icon"
                    />
                    <Form.Control
                      type="email"
                      placeholder="e.g. physician@alkhalidimedical.jo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-page-input-with-icon"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Lock
                      size={16}
                      className="position-absolute login-page-input-icon"
                    />
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-page-input-with-icon"
                    />
                  </div>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                    Log In <ArrowRight size={14} />
                  </Button>
                </div>

                <p className="mt-3 text-center login-page-footer-text">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="login-page-footer-link">Apply Now</Link>
                </p>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LoginPage;
