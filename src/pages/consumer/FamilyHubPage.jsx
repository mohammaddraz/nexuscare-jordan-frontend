import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Table } from 'react-bootstrap';
import { Plus, User, FileText, CheckCircle2, Clock, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { consumerService } from '../../services/consumerService';
import './FamilyHubPage.css';

/**
 * FamilyHubPage — Active Profile Switcher
 * Displays all family dependents and allows adding new ones.
 */
function FamilyHubPage() {
  const navigate = useNavigate();
  const [dependents, setDependents] = useState([]);
  const [activeDependentId, setActiveDependentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // History state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      setLoading(true);
      const data = await consumerService.getFamily();
      const mapped = data.map(d => ({
        id: d.id,
        name: d.name,
        relation: d.relation,
        dob: d.dob,
        nationalId: d.national_id,
        planType: d.plan_type,
        pcpName: d.pcp_name,
        pcpStatus: d.pcp_status,
        coverageLimit: d.coverage_limit,
        usedCoverage: d.used_coverage
      }));
      setDependents(mapped);
      if (mapped.length > 0) setActiveDependentId(mapped[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const [showAddModal, setShowAddModal] = useState(false);

  // New Dependent Form State
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Child');
  const [newDob, setNewDob] = useState('');
  const [newNationalId, setNewNationalId] = useState('');

  const activeDependent = dependents.find(d => d.id === activeDependentId);

  const handleAddDependent = async (e) => {
    e.preventDefault();
    try {
      await consumerService.addFamilyMember({
        name: newName,
        relation: newRelation,
        dob: newDob,
        nationalId: newNationalId
      });
      setShowAddModal(false);
      setNewName(''); setNewDob(''); setNewNationalId('');
      fetchFamily();
    } catch (err) {
      console.error(err);
      alert('Failed to add family member. Please check details and try again.');
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setShowHistoryModal(true);
      const data = await consumerService.getPCPHistory();
      setHistoryData(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <PageWrapper
      title="Family Hub"
      subtitle="Manage your registered dependents and track their active healthcare coverage."
      actions={
        <div className="d-flex gap-2">
          <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={fetchHistory}>
            <History size={16} /> Request History
          </Button>
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Member
          </Button>
        </div>
      }
    >
      <Row className="g-4">
        {/* Left Column: Profile Switcher List */}
        <Col md={4}>
          <div className="card glass-panel h-100">
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">Active Profiles</h6>
              <StatusBadge status="Active" size="sm" />
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded-bottom">
                {loading && <div className="p-4 text-center text-muted">Loading...</div>}
                {!loading && dependents.map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => setActiveDependentId(dep.id)}
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3 hover-lift ${activeDependentId === dep.id ? 'bg-light family-hub-list-item--active' : 'family-hub-list-item--inactive'}`}
                  >
                    {dep.avatarUrl ? (
                      <img src={dep.avatarUrl} alt={dep.name} className="rounded-circle family-hub-avatar" />
                    ) : (
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 family-hub-icon-box">
                        <User size={24} color="var(--color-brand-secondary)" />
                      </div>
                    )}
                    <div className="flex-grow-1 text-start">
                      <h6 className="mb-1 fw-bold family-hub-member-name">{dep.name}</h6>
                      <p className="mb-0 text-muted family-hub-member-subtitle">
                        {dep.relation} • {dep.planType}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column: Active Profile Details */}
        <Col md={8}>
          {activeDependent ? (
            <div className="card glass-panel animate-fadeIn" key={activeDependentId}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-start justify-content-between mb-4 pb-4 border-bottom">
                  <div className="d-flex align-items-center gap-4">
                    {activeDependent.avatarUrl ? (
                      <img src={activeDependent.avatarUrl} alt={activeDependent.name} className="rounded-circle shadow-sm family-hub-avatar-lg" />
                    ) : (
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 shadow-sm family-hub-icon-box-lg">
                        <User size={40} color="var(--color-brand-secondary)" />
                      </div>
                    )}
                    <div>
                      <h4 className="fw-bold mb-1 family-hub-detail-name">{activeDependent.name}</h4>
                      <p className="mb-2 text-muted family-hub-detail-text">National ID: <strong className="font-mono">{activeDependent.nationalId}</strong></p>
                      <span className="badge bg-secondary rounded-pill fw-bold family-hub-badge">
                        {activeDependent.planType}
                      </span>
                    </div>
                  </div>
                </div>

                <Row className="g-4 mb-4">
                  <Col sm={6}>
                    <div className="p-3 rounded-3 border family-hub-info-box">
                      <p className="mb-1 text-uppercase fw-bold text-muted family-hub-info-label">
                        Primary Care Provider
                      </p>
                      {activeDependent.pcpName ? (
                        <div className="d-flex align-items-center gap-2">
                          {activeDependent.pcpStatus === 'Approved' ? <CheckCircle2 size={16} color="var(--color-success)" /> : <Clock size={16} color="var(--color-warning)" />}
                          <span className="fw-bold family-hub-info-value">{activeDependent.pcpName}</span>
                        </div>
                      ) : (
                        <span className="text-muted family-hub-info-no-pcp">No PCP assigned</span>
                      )}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="p-3 rounded-3 border family-hub-info-box">
                      <p className="mb-1 text-uppercase fw-bold text-muted family-hub-info-label">
                        Coverage Utilization
                      </p>
                      <div className="d-flex align-items-end justify-content-between mb-1">
                        <span className="fw-bold family-hub-info-value">JOD {activeDependent.usedCoverage}</span>
                        <span className="text-muted family-hub-info-sublabel">/ {activeDependent.coverageLimit}</span>
                      </div>
                      <div className="progress family-hub-progress">
                        <div className="progress-bar bg-success" style={{ width: `${(activeDependent.usedCoverage / activeDependent.coverageLimit) * 100}%` }} />
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate('/consumer/medical-records')} className="d-flex align-items-center gap-2">
                    <FileText size={14} /> View Medical Records
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card glass-panel h-100 d-flex align-items-center justify-content-center text-muted py-5">
              Select a family member
            </div>
          )}
        </Col>
      </Row>

      {/* Add Dependent Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Family Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddDependent}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control required placeholder="e.g. Sara Al-Amiri" value={newName} onChange={e => setNewName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Relationship</Form.Label>
              <Form.Select value={newRelation} onChange={e => setNewRelation(e.target.value)}>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
              </Form.Select>
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" required value={newDob} onChange={e => setNewDob(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>National ID</Form.Label>
                  <Form.Control required placeholder="10 digits" value={newNationalId} onChange={e => setNewNationalId(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Submit Request</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>PCP Assignment History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-muted text-uppercase page-table-header">Date Requested</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Family Member</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Provider</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
              ) : historyData.length > 0 ? (
                historyData.map(req => (
                  <tr key={req.id}>
                    <td className="px-4 page-table-cell">{new Date(req.date_requested).toLocaleDateString()}</td>
                    <td className="page-table-cell--bold">{req.patient_name}</td>
                    <td className="page-table-cell">{req.provider_name}</td>
                    <td><StatusBadge status={req.status} size="sm" /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-5 text-muted">No request history found.</td></tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowHistoryModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
}

export default FamilyHubPage;
