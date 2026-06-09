import { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Check, X, FileText } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { mockPendingEnrollments } from '../../data/providerData';

/**
 * PatientEnrollmentPage — Audit, approve, or reject consumer PCP requests.
 */
function PatientEnrollmentPage() {
  const [enrollments, setEnrollments] = useState(mockPendingEnrollments);
  const [selectedAction, setSelectedAction] = useState(null); // { type: 'Approve' | 'Reject', enrollment }
  const [showConfirm, setShowConfirm] = useState(false);

  const handleActionClick = (type, enrollment) => {
    setSelectedAction({ type, enrollment });
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedAction) return;
    
    // Remove from pending list
    setEnrollments(enrollments.filter(e => e.id !== selectedAction.enrollment.id));
    
    // In real app, make API call here
    const actionText = selectedAction.type === 'Approve' ? 'approved' : 'rejected';
    alert(`Enrollment for ${selectedAction.enrollment.patientName} has been ${actionText}.`);
  };

  return (
    <PageWrapper
      title="Patient Enrollment Gateway"
      subtitle="Audit, approve, or reject new consumer enrollment applications requesting assignment to your facility."
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0">Pending Applications Queue</h6>
          <Badge bg="danger" pill>{enrollments.length} Pending</Badge>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Req ID</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Date Requested</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Patient Name</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>National ID</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Insurance Plan</th>
                  <th className="py-3 text-muted text-uppercase text-end px-4" style={{ fontSize: '0.65rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enr) => (
                  <tr key={enr.id}>
                    <td className="px-4 fw-bold font-mono text-muted" style={{ fontSize: '0.75rem' }}>{enr.id}</td>
                    <td style={{ fontSize: '0.8rem' }}>{enr.dateRequested}</td>
                    <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{enr.patientName}</td>
                    <td className="font-mono" style={{ fontSize: '0.8rem' }}>{enr.nationalId}</td>
                    <td>
                      <span className="badge bg-secondary rounded-pill" style={{ fontSize: '0.65rem' }}>
                        {enr.planType}
                      </span>
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center p-1"
                          style={{ width: 28, height: 28 }}
                          onClick={() => handleActionClick('Reject', enr)}
                          title="Reject"
                        >
                          <X size={16} />
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center p-1"
                          style={{ width: 28, height: 28 }}
                          onClick={() => handleActionClick('Approve', enr)}
                          title="Approve"
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
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

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAction}
        title={`${selectedAction?.type} Enrollment`}
        message={`Are you sure you want to ${selectedAction?.type.toLowerCase()} the PCP assignment request for ${selectedAction?.enrollment.patientName}?`}
        confirmLabel={selectedAction?.type}
        variant={selectedAction?.type === 'Reject' ? 'danger' : 'success'}
      />
    </PageWrapper>
  );
}

export default PatientEnrollmentPage;
