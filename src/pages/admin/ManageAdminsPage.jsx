import { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Modal, Row, Col } from 'react-bootstrap';
import { Search, Shield, Edit3, Trash2, UserPlus, Clock } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { adminService } from '../../services/adminService';

/**
 * ManageAdminsPage — Super Admin view to add, edit, and remove system administrators.
 */
function ManageAdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdmins();
      
      const mapped = data.map(a => ({
        id: a.user_id,
        name: a.name,
        email: a.email,
        role: a.admin_role,
        status: a.status,
        lastLogin: a.last_login
      }));
      setAdmins(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredAdmins = admins.filter(a => 
    a.name.toLowerCase().includes(searchTerm) || 
    a.email.toLowerCase().includes(searchTerm) ||
    a.role.toLowerCase().includes(searchTerm)
  );

  const handleAddClick = () => {
    setEditingAdmin({
      isNew: true,
      name: '',
      email: '',
      role: 'SYSTEM_ADMIN',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleEditClick = (admin) => {
    setEditingAdmin({ ...admin });
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to revoke access for this administrator?')) {
      try {
        await adminService.deleteAdmin(id);
        fetchAdmins();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete administrator');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin.isNew) {
        // Add
        await adminService.addAdmin({
          name: editingAdmin.name,
          role: editingAdmin.role,
          email: editingAdmin.email,
          status: editingAdmin.status
        });
      } else {
        // Edit
        await adminService.updateAdmin(editingAdmin.id, {
          name: editingAdmin.name,
          role: editingAdmin.role,
          email: editingAdmin.email,
          status: editingAdmin.status
        });
      }
      fetchAdmins();
      setShowModal(false);
      setEditingAdmin(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save administrator');
    }
  };

  return (
    <PageWrapper
      title="Manage Administrators"
      subtitle="Control platform access by adding, modifying, or removing administrative personnel."
      actions={
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={handleAddClick}>
          <UserPlus size={16} /> Add Administrator
        </Button>
      }
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <h6 className="fw-bold mb-0">System Administrators ({filteredAdmins.length})</h6>
          
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <InputGroup>
              <InputGroup.Text className="bg-white"><Search size={16} color="var(--color-text-muted)" /></InputGroup.Text>
              <Form.Control 
                placeholder="Search name, email, or role..." 
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom border-top">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Administrator</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>System Role</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Account Status</th>
                  <th className="py-3 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Last Login</th>
                  <th className="py-3 text-muted text-uppercase text-end px-4" style={{ fontSize: '0.65rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-4">
                      <div className="fw-bold" style={{ fontSize: '0.85rem', color: 'var(--color-brand-primary)' }}>{admin.name}</div>
                      <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                        {admin.email}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        <Shield size={14} className="text-primary" />
                        {admin.role.replace('_', ' ')}
                      </div>
                    </td>
                    <td>
                      <StatusBadge 
                        status={admin.status === 'Active' ? 'Active' : 'Pending'} 
                        size="sm" 
                        label={admin.status} 
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                        <Clock size={12} />
                        {admin.lastLogin && admin.lastLogin !== 'Never' ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                      </div>
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center border"
                          onClick={() => handleEditClick(admin)}
                        >
                          <Edit3 size={14} className="text-primary" />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center border border-danger text-danger bg-danger bg-opacity-10"
                          onClick={() => handleDeleteClick(admin.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading && filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <Shield size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No administrators found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit Admin Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {editingAdmin && (
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                <Shield size={18} color="var(--color-brand-primary)" />
                {admins.some(a => a.id === editingAdmin.id) ? 'Edit Administrator' : 'Add New Administrator'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.8rem' }}>Full Name</Form.Label>
                    <Form.Control 
                      required 
                      value={editingAdmin.name} 
                      onChange={e => setEditingAdmin({...editingAdmin, name: e.target.value})} 
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.8rem' }}>Official MOH Email</Form.Label>
                    <Form.Control 
                      type="email"
                      required 
                      value={editingAdmin.email} 
                      onChange={e => setEditingAdmin({...editingAdmin, email: e.target.value})} 
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.8rem' }}>System Role</Form.Label>
                    <Form.Select 
                      value={editingAdmin.role} 
                      onChange={e => setEditingAdmin({...editingAdmin, role: e.target.value})}
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="SYSTEM_ADMIN">System Admin</option>
                      <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                      <option value="NETWORK_MANAGER">Network Manager</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted" style={{ fontSize: '0.8rem' }}>Account Status</Form.Label>
                    <Form.Select 
                      value={editingAdmin.status} 
                      onChange={e => setEditingAdmin({...editingAdmin, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive / Suspended</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Administrator</Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </PageWrapper>
  );
}

export default ManageAdminsPage;
