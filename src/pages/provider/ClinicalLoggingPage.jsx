import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { Activity, Plus, FileText, UploadCloud } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { providerService } from '../../services/providerService';

/**
 * ClinicalLoggingPage — Log real-time visits, record clinical ICD diagnostics.
 */
function ClinicalLoggingPage() {
  const [logs, setLogs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [icd, setIcd] = useState('');
  const [billing, setBilling] = useState('99213');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await providerService.getMyPatients();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) return alert('Select a patient');

    try {
      const reqData = {
        patient_id: patientId,
        diagnosis,
        icd_code: icd,
        prescription: billing,
        notes
      };
      await providerService.addMedicalRecord(reqData);

      const patientObj = patients.find(p => p.id === patientId);
      
      const newLog = {
        id: `LOG-NEW`,
        patientName: patientObj ? patientObj.name : 'Unknown',
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        icdCode: icd,
        billingCode: billing,
        claimStatus: 'Pending',
      };
      
      setLogs([newLog, ...logs]);
      setShowLogModal(false);
      // Reset
      setPatientId(''); setDiagnosis(''); setIcd(''); setNotes('');
      alert('Medical record logged successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save record');
    }
  };

  return (
    <PageWrapper
      title="Clinical Patient Logging"
      subtitle="Log visits, record clinical ICD diagnostics, assign local procedural billing codes, and file claims."
      actions={
        <Button variant="primary" onClick={() => setShowLogModal(true)} className="d-flex align-items-center gap-2">
          <Plus size={16} /> New Clinical Log
        </Button>
      }
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0">Recent Visit Logs</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Log ID</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Date</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Patient Name</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Diagnosis & ICD-10</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Billing Code</th>
                  <th className="py-3 text-muted text-uppercase px-4" style={{ fontSize: '0.65rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 fw-bold font-mono text-muted" style={{ fontSize: '0.75rem' }}>{log.id}</td>
                    <td style={{ fontSize: '0.8rem' }}>{log.date}</td>
                    <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{log.patientName}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{log.diagnosis}</div>
                      <div className="text-muted font-mono" style={{ fontSize: '0.7rem' }}>{log.icdCode}</div>
                    </td>
                    <td className="font-mono text-muted" style={{ fontSize: '0.75rem' }}>{log.billingCode}</td>
                    <td className="px-4"><StatusBadge status={log.claimStatus} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* New Log Modal */}
      <Modal show={showLogModal} onHide={() => setShowLogModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Activity size={20} color="var(--color-brand-secondary)" />
            Log Patient Visit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleLogSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Select required value={patientId} onChange={e => setPatientId(e.target.value)}>
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.national_id}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Billing Procedural Code</Form.Label>
                  <Form.Select value={billing} onChange={e => setBilling(e.target.value)}>
                    <option value="99213">99213 - Level 3 Established Patient</option>
                    <option value="99214">99214 - Level 4 Established Patient</option>
                    <option value="99203">99203 - Level 3 New Patient</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="p-3 bg-light border rounded-3 mb-4">
              <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem' }}>Clinical Diagnostics</h6>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Primary Diagnosis</Form.Label>
                    <Form.Control required placeholder="e.g. Essential (primary) hypertension" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>ICD-10 Code</Form.Label>
                    <Form.Control required placeholder="e.g. I10" value={icd} onChange={e => setIcd(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Clinical Notes & Treatment Plan</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter treatment notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              </Form.Group>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <Form.Check 
                type="switch"
                id="auto-claim"
                label="Auto-file direct insurance claim (Recommended)"
                defaultChecked
                className="fw-bold"
                style={{ fontSize: '0.85rem', color: 'var(--color-brand-secondary)' }}
              />
              <div className="d-flex gap-2">
                <Button variant="light" onClick={() => setShowLogModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" className="d-flex align-items-center gap-2">
                  <UploadCloud size={16} /> Save & File Claim
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </PageWrapper>
  );
}

export default ClinicalLoggingPage;
