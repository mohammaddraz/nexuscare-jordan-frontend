import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Badge, Modal, Table, Spinner, Alert } from 'react-bootstrap';
import { ShieldCheck, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { consumerService } from '../../services/consumerService';
import './CoverageConfigPage.css';

/**
 * CoverageConfigPage — Independent Coverage Configuration
 * Allows customizing insurance contracts for each family member independently.
 * Now connected to the backend API for real coverage modification requests.
 */
function CoverageConfigPage() {
  const [family, setFamily] = useState([]);
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [selectedPlan, setSelectedPlan] = useState('');
  const [deductible, setDeductible] = useState('standard');
  const [riderDental, setRiderDental] = useState(false);
  const [riderVision, setRiderVision] = useState(false);
  const [riderMaternity, setRiderMaternity] = useState(false);

  // History modal
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Coverage requests cache (used to pre-populate riders)
  const [coverageCache, setCoverageCache] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [familyData, coverageData] = await Promise.all([
        consumerService.getFamily(),
        consumerService.getCoverageRequests(),
      ]);
      setFamily(familyData);
      setCoverageCache(coverageData);
      if (familyData.length > 0) {
        setActiveMemberId(familyData[0].id);
        applyMemberState(familyData[0], coverageData);
      }
    } catch (err) {
      setError('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  // Find the latest approved or pending request for a member and set form state
  const applyMemberState = (member, cache) => {
    const latest = (cache || coverageCache)
      .filter(r => r.patient_id === member.id)
      .sort((a, b) => new Date(b.date_requested) - new Date(a.date_requested))[0];

    setSelectedPlan(latest ? latest.requested_plan : member.plan_type);
    setDeductible(latest ? latest.deductible_preference : 'standard');
    setRiderDental(latest ? latest.rider_dental : false);
    setRiderVision(latest ? latest.rider_vision : false);
    setRiderMaternity(latest ? latest.rider_maternity : false);
  };

  const activeMember = family.find(m => m.id === activeMemberId);

  const handleSelectMember = (member) => {
    setActiveMemberId(member.id);
    applyMemberState(member);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeMember) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await consumerService.submitCoverageRequest({
        patient_id: activeMember.id,
        current_plan: activeMember.plan_type,
        requested_plan: selectedPlan,
        deductible_preference: deductible,
        rider_dental: riderDental,
        rider_vision: riderVision,
        rider_maternity: riderMaternity,
      });

      setSuccess(`Coverage modification request submitted for ${activeMember.name}. It will be reviewed by MOH administration.`);
      
      // Refresh the data so the UI reflects the newly submitted riders instantly
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to submit coverage request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowHistory = async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const data = await consumerService.getCoverageRequests();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning" text="dark"><Clock size={12} className="me-1" />Pending</Badge>;
      case 'Approved':
        return <Badge bg="success"><CheckCircle size={12} className="me-1" />Approved</Badge>;
      case 'Rejected':
        return <Badge bg="danger"><XCircle size={12} className="me-1" />Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Coverage Configuration" subtitle="Loading...">
        <div className="text-center py-5"><Spinner animation="border" /></div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Coverage Configuration"
      subtitle="Customize specific insurance contracts for each family member independently."
    >
      {/* History Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-primary" size="sm" onClick={handleShowHistory}>
          <History size={16} className="me-1" />
          Request History
        </Button>
      </div>

      <Row className="g-4">
        {/* Left Column: Member Selector */}
        <Col md={4}>
          <div className="card glass-panel h-100">
            <div className="card-header bg-transparent border-bottom px-4 py-3">
              <h6 className="mb-0 fw-bold">Select Member</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded-bottom">
                {family.map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => handleSelectMember(dep)}
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3 ${activeMemberId === dep.id ? 'bg-light page-list-item--active' : 'page-list-item--inactive'}`}
                  >
                    <div className="flex-grow-1 text-start">
                      <h6 className="mb-1 fw-bold coverage-config-member-name">{dep.name}</h6>
                      <p className="mb-1 text-muted coverage-config-member-plan">Current: {dep.plan_type}</p>
                      <div className="d-flex align-items-center gap-1">
                        <Badge bg={dep.network_tier === 'Premium' ? 'primary' : dep.network_tier === 'Standard' ? 'success' : 'secondary'} className="coverage-config-badge">
                          {dep.insurance_company_name || 'No Insurance'} {dep.network_tier}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column: Configuration Form */}
        <Col md={8}>
          {activeMember && (
            <div className="card glass-panel animate-fadeIn" key={activeMemberId}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 page-icon-box-48">
                    <ShieldCheck size={24} color="var(--color-brand-secondary)" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Configure Plan for {activeMember.name}</h5>
                    <p className="mb-1 text-muted coverage-config-subtitle">Changes require MOH administrative approval.</p>
                    <Badge bg="light" text="dark" className="border">
                      Active Network: {activeMember.insurance_company_name} ({activeMember.network_tier} Tier)
                    </Badge>
                  </div>
                </div>

                {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Plan Type</Form.Label>
                        <Form.Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                          <option value="Individual">Individual</option>
                          <option value="Family">Family</option>
                          <option value="Corporate">Corporate</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Deductible Preference</Form.Label>
                        <Form.Select value={deductible} onChange={(e) => setDeductible(e.target.value)}>
                          <option value="low">Low Deductible (Higher Premium)</option>
                          <option value="standard">Standard MOH Deductible</option>
                          <option value="high">High Deductible (Lower Premium)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="p-3 border rounded-3 mb-4 coverage-config-riders-box">
                    <h6 className="fw-bold coverage-config-section-title">Additional Riders (Optional)</h6>
                    <Form.Check type="switch" id="dental" label="Dental Coverage (+15 JOD/mo)" className="mb-2 coverage-config-rider-label" checked={riderDental} onChange={(e) => setRiderDental(e.target.checked)} />
                    <Form.Check type="switch" id="vision" label="Vision Coverage (+10 JOD/mo)" className="mb-2 coverage-config-rider-label" checked={riderVision} onChange={(e) => setRiderVision(e.target.checked)} />
                    <Form.Check type="switch" id="maternity" label="Maternity Care (+25 JOD/mo)" className="coverage-config-rider-label" checked={riderMaternity} onChange={(e) => setRiderMaternity(e.target.checked)} />
                  </div>

                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? <><Spinner size="sm" className="me-2" />Submitting...</> : 'Submit Modification Request'}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* History Modal */}
      <Modal show={showHistory} onHide={() => setShowHistory(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Coverage Request History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historyLoading ? (
            <div className="text-center py-4"><Spinner animation="border" /></div>
          ) : history.length === 0 ? (
            <p className="text-muted text-center py-4">No coverage requests found.</p>
          ) : (
            <Table striped hover responsive size="sm">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Current Plan</th>
                  <th>Requested Plan</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((req) => (
                  <tr key={req.id}>
                    <td className="fw-bold">{req.patient_name}</td>
                    <td>{req.current_plan}</td>
                    <td>{req.requested_plan}</td>
                    <td>{new Date(req.date_requested).toLocaleDateString()}</td>
                    <td>{getStatusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </PageWrapper>
  );
}

export default CoverageConfigPage;
