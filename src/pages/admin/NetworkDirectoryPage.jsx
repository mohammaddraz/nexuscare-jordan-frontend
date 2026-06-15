import { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Modal, Row, Col } from 'react-bootstrap';
import { Search, MapPin, Building, Star, Download, Edit3, Save } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { adminService } from '../../services/adminService';
import './NetworkDirectoryPage.css';

/**
 * NetworkDirectoryPage — Admin view of all active providers in the network.
 * Allows administrators to edit provider details.
 */
function NetworkDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch providers from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [provData, compData, netData] = await Promise.all([
          adminService.getProviderDirectory(),
          adminService.getInsuranceCompanies(),
          adminService.getProviderNetworks()
        ]);
        
        // Map backend response fields
        const mappedData = provData.map(p => ({
          ...p,
          id: p.user_id,
          acceptingNew: p.accepting_new,
          networks: netData.filter(n => n.provider_id === p.user_id)
        }));

        setProviders(mappedData);
        setCompanies(compData);
        setNetworks(netData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  
  // Assign Network Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignProvider, setAssignProvider] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedTier, setSelectedTier] = useState('Basic');
  const [assignError, setAssignError] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.specialty.toLowerCase().includes(searchTerm) ||
    p.clinic.toLowerCase().includes(searchTerm) ||
    p.city.toLowerCase().includes(searchTerm)
  );

  const handleEditClick = (provider) => {
    setEditingProvider({ ...provider }); // create a copy for the form
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    // Update the local state to reflect the edited provider
    setProviders(providers.map(p => p.id === editingProvider.id ? editingProvider : p));
    setShowEditModal(false);
    setEditingProvider(null);
  };

  const handleDeleteProvider = (id) => {
    if (window.confirm('Are you sure you want to remove this provider from the network?')) {
      setProviders(providers.filter(p => p.id !== id));
    }
  };

  const openAssignModal = (provider) => {
    setAssignProvider(provider);
    setSelectedCompanyId(companies.length > 0 ? companies[0].id : '');
    setSelectedTier('Basic');
    setAssignError(null);
    setShowAssignModal(true);
  };

  const handleAssignNetwork = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) return setAssignError("Please select a company");
    try {
      setAssignLoading(true);
      setAssignError(null);
      await adminService.assignProviderToNetwork({
        provider_id: assignProvider.id,
        company_id: selectedCompanyId,
        accepted_tier: selectedTier
      });
      
      // Update local state
      const comp = companies.find(c => c.id === selectedCompanyId);
      const newNetwork = {
        provider_id: assignProvider.id,
        company_id: selectedCompanyId,
        accepted_tier: selectedTier,
        companyName: comp ? comp.name : 'Unknown'
      };
      
      setProviders(providers.map(p => {
        if (p.id === assignProvider.id) {
          return { ...p, networks: [...p.networks, newNetwork] };
        }
        return p;
      }));
      
      setShowAssignModal(false);
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Failed to assign network');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveNetwork = async (providerId, companyId) => {
    if (!window.confirm("Remove provider from this network?")) return;
    try {
      await adminService.removeProviderFromNetwork(providerId, companyId);
      setProviders(providers.map(p => {
        if (p.id === providerId) {
          return { ...p, networks: p.networks.filter(n => n.company_id !== companyId) };
        }
        return p;
      }));
    } catch (err) {
      alert("Failed to remove network: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <PageWrapper
      title="Network Directory"
      subtitle="View and manage all verified healthcare providers actively participating in the MOH network."
      actions={
        <Button variant="outline-primary" className="d-flex align-items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      }
    >
      <div className="card glass-panel animate-fadeIn">
        <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <h6 className="fw-bold mb-0">Active Providers ({filteredProviders.length})</h6>
          
          <div className="network-directory-search">
            <InputGroup>
              <InputGroup.Text className="bg-white"><Search size={16} color="var(--color-text-muted)" /></InputGroup.Text>
              <Form.Control 
                placeholder="Search name, clinic, or city..." 
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
        </div>
        
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading network directory...</p>
            </div>
          ) : (
            <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom border-top">
                <tr>
                  <th className="px-4 py-3 text-muted text-uppercase page-table-header">Physician</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Specialty</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Clinic Affiliation</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Location</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Networks</th>
                  <th className="py-3 text-muted text-uppercase page-table-header">Status</th>
                  <th className="py-3 text-muted text-uppercase text-end px-4 page-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-4">
                      <div className="fw-bold network-directory-name">{provider.name}</div>
                      <div className="font-mono text-muted network-directory-id">{provider.id}</div>
                    </td>
                    <td className="network-directory-specialty">{provider.specialty}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2 network-directory-meta">
                        <Building size={14} className="text-muted" />
                        {provider.clinic}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 network-directory-meta">
                        <MapPin size={14} className="text-muted" />
                        {provider.city}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {provider.networks && provider.networks.length > 0 ? (
                          provider.networks.map(n => (
                            <span key={`${n.provider_id}-${n.company_id}`} className="badge bg-light text-dark border d-flex align-items-center gap-1 network-directory-network-badge">
                              {n.companyName} ({n.accepted_tier})
                              <button onClick={() => handleRemoveNetwork(provider.id, n.company_id)} className="btn-close ms-1 network-directory-network-close"></button>
                            </span>
                          ))
                        ) : (
                          <span className="text-muted network-directory-network-none">None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <StatusBadge 
                        status={provider.acceptingNew ? 'Active' : 'Pending'} 
                        size="sm" 
                        label={provider.acceptingNew ? 'Accepting Patients' : 'Full Capacity'} 
                      />
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="d-flex align-items-center gap-1 px-3 py-1 network-directory-btn-assign"
                          onClick={() => openAssignModal(provider)}
                        >
                          <Star size={14} /> Assign
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center border"
                          onClick={() => handleEditClick(provider)}
                          title="Edit Provider"
                        >
                          <Edit3 size={14} className="text-primary me-1" /> <span className="network-directory-btn-text">Edit</span>
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center border border-danger text-danger bg-danger bg-opacity-10"
                          onClick={() => handleDeleteProvider(provider.id)}
                          title="Remove Provider"
                        >
                          <span className="network-directory-btn-text">Remove</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredProviders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <Search size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No providers match your search criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          )}
        </div>
      </div>

      {/* Assign Network Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
        <Form onSubmit={handleAssignNetwork}>
          <Modal.Header closeButton className="border-bottom-0 pb-0">
            <Modal.Title className="network-directory-modal-title">Assign to Network</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {assignError && (
              <div className="alert alert-danger py-2 network-directory-alert">{assignError}</div>
            )}
            <p className="mb-4 text-muted network-directory-desc">
              Select an insurance company and the supported tier to enroll <strong>{assignProvider?.name}</strong>.
            </p>

            <Form.Group className="mb-3">
              <Form.Label className="network-directory-form-label">Insurance Company</Form.Label>
              <Form.Select 
                value={selectedCompanyId} 
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                required
              >
                {companies.length === 0 && <option value="">No companies found</option>}
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="network-directory-form-label">Accepted Network Tier</Form.Label>
              <Form.Select 
                value={selectedTier} 
                onChange={(e) => setSelectedTier(e.target.value)}
              >
                <option value="Basic">Basic (Open to all)</option>
                <option value="Standard">Standard (Requires Standard+ Coverage)</option>
                <option value="Premium">Premium (Requires Premium Coverage)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={assignLoading}>
              {assignLoading ? 'Assigning...' : 'Assign Network'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Provider Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        {editingProvider && (
          <Form onSubmit={handleSaveEdit}>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title className="d-flex align-items-center gap-2 network-directory-edit-title">
                <Edit3 size={20} color="var(--color-brand-primary)" />
                Edit Provider Profile
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="mb-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1 network-directory-name">{editingProvider.name}</h5>
                  <p className="font-mono text-muted mb-0 network-directory-desc">ID: {editingProvider.id}</p>
                </div>
                <div className="d-flex align-items-center gap-2 text-warning fw-bold bg-warning bg-opacity-10 px-3 py-2 rounded">
                  <Star size={18} className="fill-warning" /> {editingProvider.rating} Rating
                </div>
              </div>

              <Row className="mb-3 g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted network-directory-form-label">Physician Name</Form.Label>
                    <Form.Control 
                      required 
                      value={editingProvider.name} 
                      onChange={e => setEditingProvider({...editingProvider, name: e.target.value})} 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted network-directory-form-label">Medical Specialty</Form.Label>
                    <Form.Select 
                      value={editingProvider.specialty} 
                      onChange={e => setEditingProvider({...editingProvider, specialty: e.target.value})}
                    >
                      <option value="General Practice">General Practice</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4 g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted network-directory-form-label">Clinic Affiliation</Form.Label>
                    <Form.Select 
                      required 
                      value={editingProvider.clinic} 
                      onChange={e => setEditingProvider({...editingProvider, clinic: e.target.value})} 
                    >
                      <option value="">Select Clinic/Hospital...</option>
                      <option value="Al-Khalidi Hospital">Al-Khalidi Hospital</option>
                      <option value="Jordan Hospital">Jordan Hospital</option>
                      <option value="Istishari Hospital">Istishari Hospital</option>
                      <option value="Arab Medical Center">Arab Medical Center</option>
                      <option value="Abdali Hospital">Abdali Hospital</option>
                      <option value="Specialty Hospital">Specialty Hospital</option>
                      <option value="King Hussein Cancer Center">King Hussein Cancer Center</option>
                      <option value="Royal Medical Services">Royal Medical Services</option>
                      <option value="Amman Private Clinic">Amman Private Clinic</option>
                      <option value="Irbid Central Clinic">Irbid Central Clinic</option>
                      <option value="Zarqa Specialized Center">Zarqa Specialized Center</option>
                      <option value="Aqaba General Hospital">Aqaba General Hospital</option>
                      <option value="Independent Practice">Independent Practice</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-muted network-directory-form-label">City Location</Form.Label>
                    <Form.Select 
                      value={editingProvider.city} 
                      onChange={e => setEditingProvider({...editingProvider, city: e.target.value})}
                    >
                      <option value="Amman">Amman</option>
                      <option value="Irbid">Irbid</option>
                      <option value="Zarqa">Zarqa</option>
                      <option value="Aqaba">Aqaba</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="p-3 bg-light border rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1 network-directory-edit-status-title">Network Capacity Status</h6>
                  <p className="mb-0 text-muted network-directory-edit-status-desc">Toggle whether this provider is currently accepting new PCP enrollments.</p>
                </div>
                <Form.Check 
                  type="switch"
                  id="accepting-new-switch"
                  checked={editingProvider.acceptingNew}
                  onChange={e => setEditingProvider({...editingProvider, acceptingNew: e.target.checked})}
                  className="network-directory-switch"
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="d-flex align-items-center gap-2">
                <Save size={16} /> Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </PageWrapper>
  );
}

export default NetworkDirectoryPage;
