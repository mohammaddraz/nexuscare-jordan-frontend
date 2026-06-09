import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { mockPendingConsumers } from '../../data/adminData';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
const ConsumerApprovalPage = () => {
  const [consumers, setConsumers] = useState(mockPendingConsumers);

  const handleApprove = (id) => {
    setConsumers(consumers.filter(c => c.id !== id));
    // In real app, call API to update status
    alert(`Registration ${id} approved successfully.`);
  };

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection (e.g., ID Mismatch):');
    if (reason) {
      setConsumers(consumers.filter(c => c.id !== id));
      // In real app, call API to reject status and notify user
      alert(`Registration ${id} rejected. Reason: ${reason}`);
    }
  };

  const getStatusBadge = (status) => {
    if (status.includes('Pending')) {
      return <Badge bg="warning" text="dark"><Clock size={14} className="me-1" /> {status}</Badge>;
    } else if (status.includes('Flagged')) {
      return <Badge bg="danger"><AlertTriangle size={14} className="me-1" /> {status}</Badge>;
    }
    return <Badge bg="secondary">{status}</Badge>;
  };

  return (
    <Container fluid className="py-4 fade-in">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-primary mb-1">Consumer Approvals</h2>
          <p className="text-muted">Review and verify new family registrations before granting system access.</p>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">Pending Registrations ({consumers.length})</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {consumers.length === 0 ? (
                <div className="text-center py-5">
                  <CheckCircle size={48} className="text-success mb-3" />
                  <h5 className="text-muted">All caught up!</h5>
                  <p className="text-muted mb-0">There are no pending consumer registrations at this time.</p>
                </div>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Registration ID</th>
                      <th>Primary Account Holder</th>
                      <th>National ID</th>
                      <th>Family Size</th>
                      <th>Plan Type</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumers.map((consumer) => (
                      <tr key={consumer.id}>
                        <td className="fw-medium">{consumer.id}</td>
                        <td className="fw-bold">{consumer.accountName}</td>
                        <td className="text-muted">{consumer.nationalId}</td>
                        <td>{consumer.familySize} Members</td>
                        <td>{consumer.planType}</td>
                        <td>{new Date(consumer.dateSignedUp).toLocaleDateString()}</td>
                        <td>{getStatusBadge(consumer.status)}</td>
                        <td className="text-end">
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleApprove(consumer.id)}
                            title="Approve Registration"
                          >
                            <CheckCircle size={14} className="me-1" /> Approve
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleReject(consumer.id)}
                            title="Reject/Request Info"
                          >
                            <XCircle size={14} className="me-1" /> Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsumerApprovalPage;
