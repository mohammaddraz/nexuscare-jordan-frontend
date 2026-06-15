import { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Check, X, Shield, FileText, ExternalLink } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { adminService } from '../../services/adminService';
import './VerificationGatewayPage.css';

/**
 * VerificationGatewayPage — Admin review of incoming physician licensure certifications.
 */
function VerificationGatewayPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null); // { type: 'Approve' | 'Reject', cert }
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPendingCertifications();
      
      const mapped = data.map(c => ({
        id: c.id,
        doctorName: c.provider_name,
        specialty: c.specialty,
        clinicName: c.clinic,
        licenseNumber: c.license_number,
        status: c.status
      }));
      setCertifications(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (type, cert) => {
    setSelectedAction({ type, cert });
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!selectedAction) return;
    
    try {
      await adminService.updateCertificationStatus(selectedAction.cert.id, selectedAction.type === 'Approve' ? 'Approved' : 'Rejected');
      setCertifications(certifications.filter(c => c.id !== selectedAction.cert.id));
      
      const actionText = selectedAction.type === 'Approve' ? 'approved and added to the network' : 'rejected';
      alert(`Licensure for ${selectedAction.cert.doctorName} has been ${actionText}.`);
      
      setShowConfirm(false);
      setSelectedAction(null);
    } catch (err) {
      console.error(err);
      alert('Failed to process certification');
    }
  };

  return (
    <PageWrapper
      title="Professional Verification Gateway"
      subtitle="Review and verify incoming licensure certifications from doctors joining the NexusCare network."
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Shield size={18} color="var(--color-brand-secondary)" />
            <h6 className="fw-bold mb-0">Pending Licensure Certifications</h6>
          </div>
          <Badge bg="warning" text="dark" pill>{certifications.length} Requires Review</Badge>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom border-top">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase page-table-header">Submission ID</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Physician Name & Specialty</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Clinic Affiliation</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">License Number</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Status</th>
                  <th className="py-3 text-muted text-uppercase text-end px-4 page-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-4 fw-bold font-mono text-muted verification-gateway-id">
                      <div className="d-flex align-items-center gap-2">
                        {cert.id}
                        <div className="bg-light rounded p-1 verification-gateway-doc-icon" title="View Uploaded Document">
                          <ExternalLink size={14} color="var(--color-brand-primary)" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold verification-gateway-name">{cert.doctorName}</div>
                      <div className="text-muted verification-gateway-specialty">{cert.specialty}</div>
                    </td>
                    <td className="verification-gateway-clinic">{cert.clinicName}</td>
                    <td className="font-mono verification-gateway-clinic">{cert.licenseNumber}</td>
                    <td>
                      <StatusBadge 
                        status={cert.status === 'Flagged' ? 'Rejected' : 'Pending'} 
                        size="sm" 
                        label={cert.status} 
                      />
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="d-flex align-items-center gap-1"
                          onClick={() => handleActionClick('Reject', cert)}
                        >
                          <X size={14} /> <span className="d-none d-md-inline">Reject</span>
                        </Button>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="d-flex align-items-center gap-1"
                          onClick={() => handleActionClick('Approve', cert)}
                        >
                          <Check size={14} /> <span className="d-none d-md-inline">Verify</span>
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
                {!loading && certifications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <Shield size={48} className="mx-auto mb-3 opacity-50" />
                      <p>All certifications have been processed. The network is secure.</p>
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
        title={`${selectedAction?.type} Certification`}
        message={`Are you sure you want to ${selectedAction?.type.toLowerCase()} the licensure certification for ${selectedAction?.cert.doctorName}? This action will trigger an automated email notification to the applicant.`}
        confirmLabel={selectedAction?.type === 'Approve' ? 'Verify & Approve' : 'Reject Application'}
        variant={selectedAction?.type === 'Reject' ? 'danger' : 'success'}
      />
    </PageWrapper>
  );
}

export default VerificationGatewayPage;
