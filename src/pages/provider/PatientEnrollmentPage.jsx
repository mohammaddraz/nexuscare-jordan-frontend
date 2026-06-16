import { useState, useEffect } from 'react';
import { Table, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { Check, X, FileText } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { providerService } from '../../services/providerService';
import './PatientEnrollmentPage.css';

/**
 * PatientEnrollmentPage — Audit, approve, or reject consumer PCP requests.
 */
function PatientEnrollmentPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrollments');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const [data, claimsData] = await Promise.all([
        providerService.getPendingAssignments(),
        providerService.getClaims()
      ]);
      
      const mapped = data.map(e => ({
        id: e.id,
        dateRequested: new Date(e.date_requested).toLocaleDateString(),
        patientName: e.patient_name,
        nationalId: e.national_id,
        planType: e.plan_type,
      }));
      setEnrollments(mapped);
      setClaims(claimsData.filter(c => c.status === 'Pending')); // Only show pending for verification
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClaim = async (id, status) => {
    try {
      await providerService.verifyClaim(id, status);
      setClaims(claims.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to process claim verification');
    }
  };

  const [selectedAction, setSelectedAction] = useState(null); // { type: 'Approve' | 'Reject', enrollment }
  const [showConfirm, setShowConfirm] = useState(false);

  const handleActionClick = (type, enrollment) => {
    setSelectedAction({ type, enrollment });
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!selectedAction) return;
    
    try {
      await providerService.updateAssignmentStatus(selectedAction.enrollment.id, selectedAction.type);
      
      // Remove from list
      setEnrollments(enrollments.filter(e => e.id !== selectedAction.enrollment.id));
      setShowConfirm(false);
      setSelectedAction(null);
    } catch (err) {
      console.error(err);
      alert('Failed to process action');
    }
  };

  return (
    <PageWrapper
      title="Patient Enrollment Gateway"
      subtitle="Audit, approve, or reject new consumer enrollment applications requesting assignment to your facility."
    >
      <Tabs
        id="provider-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 modern-tabs"
      >
        <Tab eventKey="enrollments" title={<>Patient Enrollments <Badge bg="danger" pill className="ms-2">{enrollments.length}</Badge></>}>
          <div className="card glass-panel animate-fadeIn">
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0">Pending Applications Queue</h6>
            </div>
            <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase page-table-header">Req ID</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Date Requested</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Patient Name</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">National ID</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Insurance Plan</th>
                  <th className="py-3 text-muted text-uppercase text-end px-4 page-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id}>
                    <td className="px-4 fw-bold font-mono text-muted enrollment-id">{enr.id}</td>
                    <td className="page-table-cell">{enr.dateRequested}</td>
                    <td className="fw-bold enrollment-patient">{enr.patientName}</td>
                    <td className="font-mono page-table-cell">{enr.nationalId}</td>
                    <td>
                      <span className="badge bg-secondary rounded-pill enrollment-badge">
                        {enr.planType}
                      </span>
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center p-1 enrollment-action-btn"
                          onClick={() => handleActionClick('Rejected', enr)}
                          title="Reject"
                        >
                          <X size={16} />
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center p-1 enrollment-action-btn"
                          onClick={() => handleActionClick('Approved', enr)}
                          title="Approve"
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && enrollments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <FileText size={48} className="mx-auto mb-3 opacity-50" />
                      <p>The enrollment queue is empty. You're all caught up!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
        </Tab>
        <Tab eventKey="claims" title={<>Verify Claims <Badge bg="warning" text="dark" pill className="ms-2">{claims.length}</Badge></>}>
          <div className="card glass-panel animate-fadeIn">
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0">Claims Pending Verification</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-muted text-uppercase page-table-header">Claim ID</th>
                      <th className="py-3 text-muted text-uppercase page-table-header">Date</th>
                      <th className="py-3 text-muted text-uppercase page-table-header">Patient Name</th>
                      <th className="py-3 text-muted text-uppercase page-table-header">Amount (JOD)</th>
                      <th className="py-3 text-muted text-uppercase text-end px-4 page-table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim.id}>
                        <td className="px-4 fw-bold font-mono text-muted enrollment-id">{claim.id.substring(0,8)}...</td>
                        <td className="page-table-cell">{new Date(claim.claim_date).toLocaleDateString()}</td>
                        <td className="fw-bold enrollment-patient">{claim.patient_name}</td>
                        <td className="page-table-cell">{claim.amount}</td>
                        <td className="text-end px-4">
                          <div className="d-flex justify-content-end gap-2">
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleVerifyClaim(claim.id, 'Rejected')}
                              title="Reject Fraudulent Claim"
                            >
                              Reject
                            </Button>
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => handleVerifyClaim(claim.id, 'In Review')}
                              title="Verify Service"
                            >
                              Verify
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && claims.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          <FileText size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No claims require verification at this time.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        title={`${selectedAction?.type} Enrollment`}
        message={`Are you sure you want to ${selectedAction?.type.toLowerCase()} the PCP assignment request for ${selectedAction?.enrollment.patientName}?`}
        confirmLabel={selectedAction?.type}
        variant={selectedAction?.type === 'Rejected' ? 'danger' : 'success'}
      />
    </PageWrapper>
  );
}

export default PatientEnrollmentPage;
