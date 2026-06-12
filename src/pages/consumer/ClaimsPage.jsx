import { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { consumerService } from '../../services/consumerService';

/**
 * ClaimsPage — Self-Service Claims Processing
 */
function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newClaimSubmitted, setNewClaimSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [family, providerList] = await Promise.all([
        consumerService.getFamily(),
        consumerService.getProviders()
      ]);
      setDependents(family);
      setProviders(providerList);
      if (family.length > 0) setClaimDep(family[0].id);
      if (providerList.length > 0) setClaimProvider(providerList[0].user_id);

      let allClaims = [];
      for (const member of family) {
        try {
          const res = await consumerService.getClaims(member.id);
          const mapped = res.map(c => ({
            id: c.id,
            dependentName: member.name,
            date: new Date(c.claim_date).toLocaleDateString(),
            providerName: c.provider_name || 'Network Provider',
            amount: c.amount,
            status: c.status
          }));
          allClaims = [...allClaims, ...mapped];
        } catch (e) {
          console.error(`Failed to fetch claims for ${member.name}`);
        }
      }
      setClaims(allClaims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // New claim form state
  const [claimDep, setClaimDep] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [claimProvider, setClaimProvider] = useState('');
  const [claimAmount, setClaimAmount] = useState('');

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimDep || !claimProvider || !claimDate || !claimAmount) return;

    try {
      await consumerService.submitClaim({
        patient_id: claimDep,
        provider_id: claimProvider,
        claim_date: claimDate,
        amount: parseFloat(claimAmount).toFixed(2),
      });
      setNewClaimSubmitted(true);
      fetchData(); // Refresh ledger
    } catch (err) {
      console.error(err);
      alert('Failed to submit claim. Please try again.');
    }
  };

  const resetModal = () => {
    setNewClaimSubmitted(false);
    setShowSubmitModal(false);
    setClaimDate(''); setClaimProvider(''); setClaimAmount('');
  };

  return (
    <PageWrapper
      title="Claims Management"
      subtitle="Submit outpatient reimbursement claims directly to the ledger with automated deductible calculations."
      actions={
        <Button variant="primary" onClick={() => setShowSubmitModal(true)} className="d-flex align-items-center gap-2">
          <UploadCloud size={16} /> Submit New Claim
        </Button>
      }
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0">Claims History Ledger</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Claim ID</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Date</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Dependent</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Provider</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Amount (JOD)</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">Loading...</td>
                  </tr>
                )}
                {!loading && claims.map(claim => (
                  <tr key={claim.id}>
                    <td className="px-4 fw-bold font-mono" style={{ fontSize: '0.8rem' }}>{claim.id}</td>
                    <td style={{ fontSize: '0.8rem' }}>{claim.date}</td>
                    <td style={{ fontSize: '0.8rem' }}>{claim.dependentName}</td>
                    <td style={{ fontSize: '0.8rem' }}>{claim.providerName}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{claim.amount}</td>
                    <td><StatusBadge status={claim.status} size="sm" /></td>
                  </tr>
                ))}
                {!loading && claims.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No claims found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal show={showSubmitModal} onHide={resetModal} centered size="lg">
        {!newClaimSubmitted ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Submit Reimbursement Claim</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form onSubmit={handleSubmitClaim}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Patient (Dependent)</Form.Label>
                      <Form.Select value={claimDep} onChange={e => setClaimDep(e.target.value)}>
                        {dependents.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Service</Form.Label>
                      <Form.Control type="date" required value={claimDate} onChange={e => setClaimDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Healthcare Provider / Clinic</Form.Label>
                      <Form.Select required value={claimProvider} onChange={e => setClaimProvider(e.target.value)}>
                        <option value="">Select a provider...</option>
                        {providers.map(p => (
                          <option key={p.user_id} value={p.user_id}>{p.name} - {p.clinic}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Total Amount Paid (JOD)</Form.Label>
                      <Form.Control type="number" step="0.01" required placeholder="50.00" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="p-4 bg-light border border-dashed rounded-3 text-center mb-4 cursor-pointer hover-lift">
                  <FileText size={32} color="var(--color-text-muted)" className="mb-2" />
                  <p className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Upload Original Invoice & Medical Report</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>Click to browse or drag and drop files here</p>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="light" onClick={resetModal}>Cancel</Button>
                  <Button variant="primary" type="submit">Submit Claim</Button>
                </div>
              </Form>
            </Modal.Body>
          </>
        ) : (
          <Modal.Body className="p-5 text-center">
            <CheckCircle size={64} color="var(--color-success)" className="mx-auto mb-3 animate-scaleIn" />
            <h4 className="fw-bold mb-2">Claim Submitted Successfully</h4>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Your claim has been added to the ledger and is currently pending review.</p>
            <Button variant="primary" className="mt-3" onClick={resetModal}>Return to Ledger</Button>
          </Modal.Body>
        )}
      </Modal>
    </PageWrapper>
  );
}

export default ClaimsPage;
