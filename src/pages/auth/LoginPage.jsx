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
      className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5 position-relative overflow-hidden"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Background decorations */}
      <div
        className="position-absolute rounded-circle"
        style={{
          top: '-10rem', right: '-10rem',
          width: '24rem', height: '24rem',
          backgroundColor: 'var(--color-emerald-100)',
          filter: 'blur(80px)', opacity: 0.5,
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          bottom: '-10rem', left: '-10rem',
          width: '24rem', height: '24rem',
          backgroundColor: '#e2e8f0',
          filter: 'blur(80px)', opacity: 0.5,
        }}
      />

      {/* Login Card */}
      <div
        className="position-relative bg-white border overflow-hidden animate-scaleIn"
        style={{
          maxWidth: 900,
          width: '100%',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          borderColor: 'var(--color-border-default)',
          minHeight: 560,
        }}
      >
        <Row className="g-0 h-100">
          {/* Left Banner */}
          <Col md={5} className="d-none d-md-flex flex-column justify-content-between p-4 position-relative text-white"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          >
            {/* Gradient overlay */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(19, 27, 46, 0.9) 50%, var(--color-brand-primary) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Brand */}
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-2 mb-5">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: 36, height: 36,
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <HeartHandshake size={20} color="#34d399" />
                </div>
                <div>
                  <span className="d-block fw-bold" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>NexusCare</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#34d399' }}>Jordan</span>
                </div>
              </div>

              <div className="mt-5">
                <span
                  className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill mb-3"
                  style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                  }}
                >
                  <Sparkles size={12} /> MOH Registration Gate
                </span>
                <h2 className="fw-bold mb-3" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Secure Audits & Unified Services
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: 280 }}>
                  Enrolling clinics and family pools under the Ministry of Health guidelines. Enter the portal below.
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="position-relative pt-4 mt-4" style={{ zIndex: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { icon: ShieldCheck, label: 'Admin Directory Verification' },
                { icon: Stethoscope, label: 'Physician Provider Network' },
                { icon: Users, label: 'Independent Plan Family Hub' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{ width: 24, height: 24, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <Icon size={14} color="#34d399" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{label}</span>
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  Platform Credentials
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Select an approved identity profile for direct testing access or log in.
                </p>
              </div>

              {error && <ErrorAlert message={error} onClose={clearError} />}

              {/* Quick Login Profiles */}
              <div className="mb-4">
                <span style={{
                  fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'var(--color-brand-secondary)',
                }}>
                  Approved Demo Profiles
                </span>

                <div className="d-flex flex-column gap-2 mt-2">
                  {demoProfiles.map((profile) => (
                    <button
                      key={profile.role}
                      type="button"
                      onClick={() => handleDemoLogin(profile.email, profile.password)}
                      className="w-100 p-3 rounded-4 border bg-white text-start d-flex align-items-center justify-content-between"
                      style={{
                        cursor: 'pointer', transition: 'all var(--transition-default)',
                        borderColor: 'var(--color-border-default)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="rounded-circle border"
                            style={{ width: 40, height: 40, objectFit: 'cover', borderColor: 'var(--color-border-default)' }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: 40, height: 40,
                              backgroundColor: profile.role === 'PROVIDER' ? 'var(--color-brand-primary)' : '#f1f5f9',
                              color: profile.role === 'PROVIDER' ? '#34d399' : 'var(--color-brand-secondary)',
                              fontWeight: 800, fontSize: '0.8rem',
                              border: `1px solid ${profile.role === 'PROVIDER' ? '#334155' : 'var(--color-border-default)'}`,
                            }}
                          >
                            {profile.initials}
                          </div>
                        )}
                        <div>
                          <p className="mb-0 fw-bold" style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                            {profile.name}
                          </p>
                          <p className="mb-0" style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
                            {profile.subtitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 rounded-3"
                        style={{
                          fontSize: '0.625rem', fontWeight: 700,
                          backgroundColor: '#f1f5f9', color: '#475569',
                        }}
                      >
                        Sign In
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1" style={{ height: 1, backgroundColor: 'var(--color-border-default)' }} />
                <span className="px-3" style={{
                  fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: 'var(--color-text-muted)',
                }}>
                  Or Manual Login
                </span>
                <div className="flex-grow-1" style={{ height: 1, backgroundColor: 'var(--color-border-default)' }} />
              </div>

              {/* Manual Login Form */}
              <Form onSubmit={handleManualLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="position-relative">
                    <Mail
                      size={16}
                      className="position-absolute"
                      style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                    />
                    <Form.Control
                      type="email"
                      placeholder="e.g. physician@alkhalidimedical.jo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Lock
                      size={16}
                      className="position-absolute"
                      style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                    />
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: 38 }}
                    />
                  </div>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" className="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                    Log In <ArrowRight size={14} />
                  </Button>
                </div>

                <p className="mt-3 text-center" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Don&apos;t have an account?{' '}
                  <Link to="/register" style={{ fontWeight: 700 }}>Apply Now</Link>
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
