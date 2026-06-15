import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  HeartHandshake, Users, Stethoscope, Camera, FileText, Sparkles, ArrowLeft, AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';
import './RegisterPage.css';

/**
 * RegisterPage — Multi-tab registration form
 * Tab 1: Apply as Family (Consumer)
 * Tab 2: Apply as Clinic (Provider)
 * Mirrors the NexusCare reference project's registration flow
 */
function RegisterPage() {
  const [activeTab, setActiveTab] = useState('CONSUMER');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Consumer form state
  const [consName, setConsName] = useState('');
  const [consEmail, setConsEmail] = useState('');
  const [consPassword, setConsPassword] = useState('');
  const [consPhone, setConsPhone] = useState('');
  const [consPlan, setConsPlan] = useState('Platinum Care JOR');
  const [consRelation, setConsRelation] = useState('Primary');

  // Provider form state
  const [provName, setProvName] = useState('');
  const [provSpecialty, setProvSpecialty] = useState('Cardiology');
  const [provLicense, setProvLicense] = useState('');
  const [provClinic, setProvClinic] = useState('');
  const [provCity, setProvCity] = useState('Amman');
  const [provEmail, setProvEmail] = useState('');
  const [provPassword, setProvPassword] = useState('');
  const [provPhone, setProvPhone] = useState('');

  const handleConsumerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.registerConsumer({
        name: consName,
        email: consEmail,
        password: consPassword,
        phone: consPhone,
        plan_type: consPlan,
        relation: consRelation
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register consumer');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await authService.registerProvider({
        name: provName,
        email: provEmail,
        password: provPassword,
        phone: provPhone,
        specialty: provSpecialty,
        license_number: provLicense,
        clinic: provClinic,
        city: provCity
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register provider');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 register-page-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-5 bg-white rounded-4 border register-page-success-card"
        >
          <div
            className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center animate-pulse register-page-success-icon"
          >
            <FileText size={32} color="#d97706" />
          </div>
          <h3 className="fw-bold mb-2 register-page-success-title">Application Submitted!</h3>
          <p className="register-page-success-text">
            Your registration is pending administrative review. You will be notified once approved.
          </p>
          <Button variant="primary" className="mt-3" onClick={() => navigate('/login')}>
            <ArrowLeft size={14} className="me-2" /> Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5 register-page-bg">
      <div
        className="bg-white border overflow-hidden animate-scaleIn register-page-card"
      >
        {/* Header */}
        <div className="p-4 pb-0">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center justify-content-center rounded-3 register-page-brand-icon">
              <HeartHandshake size={20} color="#34d399" />
            </div>
            <div>
              <span className="fw-bold register-page-brand-name">NexusCare</span>
              <span className="ms-1 px-2 py-0 rounded register-page-brand-tag">Jordan</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <Nav variant="tabs" className="border-bottom-0 mb-0">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'CONSUMER'}
                onClick={() => setActiveTab('CONSUMER')}
                className={`d-flex align-items-center gap-2 register-page-tab-link ${activeTab === 'CONSUMER' ? 'register-page-tab-link--active' : 'register-page-tab-link--inactive'}`}
              >
                <Users size={14} /> Apply as Family
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'PROVIDER'}
                onClick={() => setActiveTab('PROVIDER')}
                className={`d-flex align-items-center gap-2 register-page-tab-link ${activeTab === 'PROVIDER' ? 'register-page-tab-link--active' : 'register-page-tab-link--inactive'}`}
              >
                <Stethoscope size={14} /> Apply as Clinic
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Form Body */}
        <div className="p-4">
          {activeTab === 'CONSUMER' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleConsumerSubmit}>
              <h4 className="fw-bold mb-1 register-page-form-title">Apply for Family Health Pool</h4>
              <p className="mb-3 register-page-form-subtitle">
                Submit verification details to request coverage access.
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Applicant Full Name</Form.Label>
                <Form.Control required placeholder="e.g. Rania Al-Hadidi" value={consName} onChange={(e) => setConsName(e.target.value)} />
              </Form.Group>

              <Row className="mb-3">
                <Col md={12}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 register-page-error">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" required placeholder="rania@gmail.com" value={consEmail} onChange={(e) => setConsEmail(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required placeholder="••••••••" value={consPassword} onChange={(e) => setConsPassword(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Phone Contact</Form.Label>
                    <Form.Control type="tel" required placeholder="+962 7 8554 9901" value={consPhone} onChange={(e) => setConsPhone(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Family Role</Form.Label>
                    <Form.Select value={consRelation} onChange={(e) => setConsRelation(e.target.value)}>
                      <option value="Primary">Primary Pool Holder</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child Dependent</option>
                      <option value="Other">Other Dependent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Healthcare Coverage</Form.Label>
                    <Form.Select value={consPlan} onChange={(e) => setConsPlan(e.target.value)}>
                      <option value="Platinum Care JOR">Platinum Care JOR (MOH Standard)</option>
                      <option value="Gold Shield JOR">Gold Shield JOR (MOH Premium)</option>
                      <option value="Silver Basic JOR">Silver Basic JOR (MOH Secondary)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Document Upload Mock */}
              <div className="p-3 rounded-3 border border-dashed mb-3 register-page-upload-box">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center register-page-upload-icon">
                    <Camera size={20} color="var(--color-brand-secondary)" />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold register-page-upload-name">National_ID_Scan.png</p>
                    <p className="mb-0 register-page-upload-status">Ready for review</p>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={loading} className="w-100 d-flex align-items-center justify-content-center gap-2">
                <FileText size={16} color="#34d399" /> {loading ? 'Submitting...' : 'Submit Family Coverage Request'}
              </Button>
            </motion.form>
          )}

          {activeTab === 'PROVIDER' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleProviderSubmit}>
              <h4 className="fw-bold mb-1 register-page-form-title">Clinic Directory Application</h4>
              <p className="mb-3 register-page-form-subtitle">
                Submit clinical credentials and practice location records for JMA verification.
              </p>

              <Form.Group className="mb-3">
                <Form.Label>Physician Name</Form.Label>
                <Form.Control required placeholder="e.g. Dr. Tariq Al-Kasih" value={provName} onChange={(e) => setProvName(e.target.value)} />
              </Form.Group>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Specialty</Form.Label>
                    <Form.Select value={provSpecialty} onChange={(e) => setProvSpecialty(e.target.value)}>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Surgery">General Surgery</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>JMA License Number</Form.Label>
                    <Form.Control required placeholder="JMA-73231" value={provLicense} onChange={(e) => setProvLicense(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Hospital / Clinic</Form.Label>
                    <Form.Control required placeholder="Al-Kasih Neurology Clinic" value={provClinic} onChange={(e) => setProvClinic(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Select value={provCity} onChange={(e) => setProvCity(e.target.value)}>
                      <option value="Amman">Amman</option>
                      <option value="Irbid">Irbid</option>
                      <option value="Zarqa">Zarqa</option>
                      <option value="Aqaba">Aqaba</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 register-page-error">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Professional Email</Form.Label>
                    <Form.Control type="email" required placeholder="dr.tariq@clinic.jo" value={provEmail} onChange={(e) => setProvEmail(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required placeholder="••••••••" value={provPassword} onChange={(e) => setProvPassword(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Practice Telephone</Form.Label>
                    <Form.Control type="tel" required placeholder="+962 7 9882 1104" value={provPhone} onChange={(e) => setProvPhone(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="primary" disabled={loading} className="w-100 d-flex align-items-center justify-content-center gap-2">
                <Stethoscope size={16} color="#34d399" /> {loading ? 'Submitting...' : 'Submit Physician Credentials'}
              </Button>
            </motion.form>
          )}

          <p className="mt-3 text-center register-page-footer-text">
            Already registered? <Link to="/login" className="register-page-footer-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
