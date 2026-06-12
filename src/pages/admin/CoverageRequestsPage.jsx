import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import { CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';

/**
 * CoverageRequestsPage — Admin page to review and approve/reject
 * coverage modification requests submitted by consumers.
 */
const CoverageRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCoverageRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (req, status) => {
    setSelectedRequest(req);
    setActionStatus(status);
    setAdminNotes('');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    try {
      setActionLoading(true);
      await adminService.updateCoverageRequest(selectedRequest.id, actionStatus, adminNotes);
      await fetchRequests();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
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

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <PageWrapper
      title="Coverage Modification Requests"
      subtitle="Review and approve or reject insurance plan change requests submitted by consumers."
    >
      <Row className="g-4 mb-4 stagger-children">
        <Col md={4}>
          <div className="card glass-panel p-4 text-center">
            <h3 className="fw-bold mb-1">{requests.length}</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Total Requests</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card glass-panel p-4 text-center">
            <h3 className="fw-bold mb-1 text-warning">{pendingCount}</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Pending Review</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="card glass-panel p-4 text-center">
            <h3 className="fw-bold mb-1 text-success">{requests.filter(r => r.status === 'Approved').length}</h3>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Approved</p>
          </div>
        </Col>
      </Row>

      <div className="card glass-panel">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <ShieldCheck size={20} color="var(--color-brand-secondary)" />
            <h6 className="fw-bold mb-0">All Coverage Requests</h6>
          </div>
          {pendingCount > 0 && <Badge bg="warning" text="dark" pill>{pendingCount} pending</Badge>}
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : requests.length === 0 ? (
            <p className="text-muted text-center py-5">No coverage modification requests found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Patient</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Consumer Email</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Current Plan</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Requested Plan</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Riders</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Date</th>
                    <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Status</th>
                    <th className="py-3 text-muted text-uppercase text-end px-4" style={{ fontSize: '0.65rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td className="px-4 fw-bold" style={{ fontSize: '0.85rem' }}>{req.patient_name}</td>
                      <td style={{ fontSize: '0.85rem' }}>{req.consumer_email}</td>
                      <td style={{ fontSize: '0.85rem' }}>{req.current_plan}</td>
                      <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{req.requested_plan}</td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {req.rider_dental && <Badge bg="info" className="fw-normal" style={{ fontSize: '0.7rem' }}>Dental</Badge>}
                          {req.rider_vision && <Badge bg="info" className="fw-normal" style={{ fontSize: '0.7rem' }}>Vision</Badge>}
                          {req.rider_maternity && <Badge bg="info" className="fw-normal" style={{ fontSize: '0.7rem' }}>Maternity</Badge>}
                          {!req.rider_dental && !req.rider_vision && !req.rider_maternity && <span className="text-muted" style={{ fontSize: '0.75rem' }}>None</span>}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(req.date_requested).toLocaleDateString()}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td className="text-end px-4">
                        {req.status === 'Pending' ? (
                          <div className="d-flex gap-1 justify-content-end">
                            <Button size="sm" variant="outline-success" onClick={() => handleOpenAction(req, 'Approved')}>
                              <CheckCircle size={14} className="me-1" />Approve
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleOpenAction(req, 'Rejected')}>
                              <XCircle size={14} className="me-1" />Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {req.date_reviewed ? `Reviewed ${new Date(req.date_reviewed).toLocaleDateString()}` : '—'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionStatus === 'Approved' ? 'Approve' : 'Reject'} Coverage Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <p>
                You are about to <strong>{actionStatus === 'Approved' ? 'approve' : 'reject'}</strong> the coverage 
                modification request for <strong>{selectedRequest.patient_name}</strong>.
              </p>
              {actionStatus === 'Approved' && (
                <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
                  Their plan will be changed from <strong>{selectedRequest.current_plan}</strong> to <strong>{selectedRequest.requested_plan}</strong>.
                </div>
              )}
              <Form.Group className="mt-3">
                <Form.Label>Admin Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any notes about this decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={actionLoading}>Cancel</Button>
          <Button
            variant={actionStatus === 'Approved' ? 'success' : 'danger'}
            onClick={handleConfirmAction}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" /> : `Confirm ${actionStatus === 'Approved' ? 'Approval' : 'Rejection'}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
};

export default CoverageRequestsPage;
