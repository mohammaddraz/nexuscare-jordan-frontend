import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Nav, Modal, Form } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import { CheckCircle, XCircle, Clock, AlertTriangle, Users, Edit3, FileText } from 'lucide-react';

const ConsumerApprovalPage = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  
  const [pendingConsumers, setPendingConsumers] = useState([]);
  const [allConsumers, setAllConsumers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConsumer, setEditingConsumer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingData, allData, compData, claimsData] = await Promise.all([
        adminService.getPendingConsumers(),
        adminService.getAllConsumers(),
        adminService.getInsuranceCompanies(),
        adminService.getClaims()
      ]);
      
      const mapConsumer = (c) => ({
        id: c.id,
        accountName: c.name,
        nationalId: c.national_id,
        planType: c.plan_type,
        status: c.approval_status,
        insuranceCompanyId: c.insurance_company_id,
        insuranceCompanyName: c.insurance_company_name,
        networkTier: c.network_tier
      });

      setPendingConsumers(pendingData.map(mapConsumer));
      setAllConsumers(allData.map(mapConsumer));
      setCompanies(compData);
      setClaims(claimsData.filter(c => c.status === 'In Review'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.updateConsumerStatus(id, 'Approved');
      alert(`Registration ${id} approved successfully.`);
      fetchData(); // refresh lists
    } catch (err) {
      console.error(err);
      alert('Failed to approve registration');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection (e.g., ID Mismatch):');
    if (reason) {
      try {
        await adminService.updateConsumerStatus(id, 'Rejected');
        alert(`Registration ${id} rejected. Reason: ${reason}`);
        fetchData(); // refresh lists
      } catch (err) {
        console.error(err);
        alert('Failed to reject registration');
      }
    }
  };

  const openEditModal = (consumer) => {
    setEditingConsumer({ ...consumer });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateConsumerDetails(editingConsumer.id, {
        approval_status: editingConsumer.status,
        insurance_company_id: editingConsumer.insuranceCompanyId,
        network_tier: editingConsumer.networkTier,
        plan_type: editingConsumer.planType
      });
      setShowEditModal(false);
      fetchData(); // refresh
    } catch (err) {
      alert("Failed to update consumer: " + (err.response?.data?.message || err.message));
    }
  };

  const handleProcessClaim = async (id, status) => {
    try {
      await adminService.processClaim(id, status);
      setClaims(claims.filter(c => c.id !== id));
      alert(`Claim marked as ${status}`);
    } catch (err) {
      console.error(err);
      alert('Failed to process claim');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Pending' || status?.includes('Pending')) {
      return <Badge bg="warning" text="dark"><Clock size={14} className="me-1" /> {status}</Badge>;
    } else if (status === 'Flagged') {
      return <Badge bg="danger"><AlertTriangle size={14} className="me-1" /> {status}</Badge>;
    } else if (status === 'Approved') {
      return <Badge bg="success"><CheckCircle size={14} className="me-1" /> {status}</Badge>;
    }
    return <Badge bg="secondary">{status}</Badge>;
  };

  return (
    <Container fluid className="py-4 fade-in">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold text-primary mb-1">Consumer Approvals</h2>
          <p className="text-muted">Review pending registrations and manage the consumer directory.</p>
          
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'PENDING'} 
                onClick={() => setActiveTab('PENDING')}
                className="fw-bold d-flex align-items-center gap-2"
              >
                <Clock size={16} /> Pending Approvals 
                <Badge bg="danger" pill>{pendingConsumers.length}</Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'ALL'} 
                onClick={() => setActiveTab('ALL')}
                className="fw-bold d-flex align-items-center gap-2"
              >
                <Users size={16} /> All Consumers Directory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'CLAIMS'} 
                onClick={() => setActiveTab('CLAIMS')}
                className="fw-bold d-flex align-items-center gap-2"
              >
                <FileText size={16} /> Claim Payouts <Badge bg="warning" text="dark" pill>{claims.length}</Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : activeTab === 'PENDING' ? (
                // --- PENDING TAB ---
                pendingConsumers.length === 0 ? (
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
                        <th>Plan Type</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingConsumers.map((consumer) => (
                        <tr key={consumer.id}>
                          <td className="fw-medium font-mono" style={{ fontSize: '0.8rem' }}>{consumer.id.substring(0,8)}...</td>
                          <td className="fw-bold">{consumer.accountName}</td>
                          <td className="text-muted">{consumer.nationalId}</td>
                          <td>{consumer.planType}</td>
                          <td>{getStatusBadge(consumer.status)}</td>
                          <td className="text-end">
                            <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleApprove(consumer.id)}>
                              <CheckCircle size={14} className="me-1" /> Approve
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleReject(consumer.id)}>
                              <XCircle size={14} className="me-1" /> Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )
              ) : (
                // --- ALL CONSUMERS TAB ---
                <Table responsive hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Consumer Name</th>
                      <th>National ID</th>
                      <th>Insurance Network</th>
                      <th>Tier</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allConsumers.map((consumer) => (
                      <tr key={consumer.id}>
                        <td className="fw-bold">{consumer.accountName}</td>
                        <td className="text-muted">{consumer.nationalId}</td>
                        <td>{consumer.insuranceCompanyName || <span className="text-muted fst-italic">Unassigned</span>}</td>
                        <td>{consumer.networkTier || <span className="text-muted fst-italic">None</span>}</td>
                        <td>{getStatusBadge(consumer.status)}</td>
                        <td className="text-end">
                          <Button variant="light" size="sm" className="border" onClick={() => openEditModal(consumer)}>
                            <Edit3 size={14} className="me-1" /> Edit
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

      {activeTab === 'CLAIMS' && <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">Claim ID</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Patient</th>
                    <th className="py-3">Provider</th>
                    <th className="py-3">Amount (JOD)</th>
                    <th className="py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">No claims pending payout approval.</td></tr>
                  ) : (
                    claims.map(claim => (
                      <tr key={claim.id}>
                        <td className="px-4 font-mono text-muted" style={{ fontSize: '0.85rem' }}>{claim.id.substring(0,8)}...</td>
                        <td>{new Date(claim.claim_date).toLocaleDateString()}</td>
                        <td className="fw-bold">{claim.patient_name}</td>
                        <td>{claim.provider_name}</td>
                        <td className="fw-bold">{claim.amount}</td>
                        <td className="text-end px-4">
                          <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleProcessClaim(claim.id, 'Rejected')}>
                            Deny
                          </Button>
                          <Button variant="success" size="sm" onClick={() => handleProcessClaim(claim.id, 'Paid')}>
                            Approve Payout
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>}

      {/* Edit Consumer Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Form onSubmit={handleSaveEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Manage Consumer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingConsumer && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={editingConsumer.status} 
                    onChange={(e) => setEditingConsumer({...editingConsumer, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Insurance Company</Form.Label>
                  <Form.Select 
                    value={editingConsumer.insuranceCompanyId || ''} 
                    onChange={(e) => setEditingConsumer({...editingConsumer, insuranceCompanyId: e.target.value})}
                  >
                    <option value="">-- Unassigned --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Network Tier</Form.Label>
                  <Form.Select 
                    value={editingConsumer.networkTier || 'Basic'} 
                    onChange={(e) => setEditingConsumer({...editingConsumer, networkTier: e.target.value})}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Type</Form.Label>
                  <Form.Select 
                    value={editingConsumer.planType || 'Individual'} 
                    onChange={(e) => setEditingConsumer({...editingConsumer, planType: e.target.value})}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                    <option value="Corporate">Corporate</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ConsumerApprovalPage;
