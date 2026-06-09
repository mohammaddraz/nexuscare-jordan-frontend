import { useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Search, MapPin, Star, UserPlus } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { mockProviders } from '../../data/consumerData';
import ConfirmDialog from '../../components/common/ConfirmDialog';

/**
 * ProviderAssignmentPage — Search clinic directory and request a Primary Care Provider.
 * Note: Google Maps integration will be added here in Phase 7.
 */
function ProviderAssignmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredProviders(
      mockProviders.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.specialty.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
      )
    );
  };

  const handleRequestAssignment = (provider) => {
    setSelectedProvider(provider);
    setShowConfirm(true);
  };

  const confirmAssignment = () => {
    alert(`Assignment request sent to ${selectedProvider.name}. Pending clinic approval.`);
  };

  return (
    <PageWrapper
      title="Clinical Provider Assignment"
      subtitle="Search the clinic directory and request a designated Primary Care Provider (PCP)."
    >
      <Row className="g-4">
        <Col lg={4}>
          <div className="card glass-panel mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Search Filters</h6>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-white"><Search size={16} color="var(--color-text-muted)" /></InputGroup.Text>
                <Form.Control 
                  placeholder="Doctor, Specialty, or City" 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
              
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Select>
                  <option value="All">All Cities</option>
                  <option value="Amman">Amman</option>
                  <option value="Irbid">Irbid</option>
                  <option value="Zarqa">Zarqa</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Select>
                  <option value="All">All Specialties</option>
                  <option value="General">General Practice</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="card glass-panel" style={{ height: 250 }}>
            <div className="card-body p-0 d-flex align-items-center justify-content-center bg-light rounded text-center">
              <div>
                <MapPin size={32} color="var(--color-text-muted)" className="mb-2" />
                <p className="text-muted fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Interactive Map</p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>(Google Maps API coming in Phase 7)</p>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={8}>
          <div className="d-flex flex-column gap-3">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="card glass-panel-hover p-4 animate-fadeInUp">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--color-brand-primary)' }}>{provider.name}</h5>
                    <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      {provider.specialty} • {provider.clinic}
                    </p>
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.75rem' }}>
                      <span className="d-flex align-items-center gap-1 text-muted">
                        <MapPin size={14} /> {provider.city}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-warning fw-bold">
                        <Star size={14} className="fill-warning" /> {provider.rating}
                      </span>
                      {provider.acceptingNew ? (
                        <span className="text-success fw-bold d-flex align-items-center gap-1">
                          <span className="rounded-circle bg-success" style={{width: 6, height: 6}}></span> Accepting New Patients
                        </span>
                      ) : (
                        <span className="text-danger fw-bold d-flex align-items-center gap-1">
                          <span className="rounded-circle bg-danger" style={{width: 6, height: 6}}></span> Full Capacity
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant={provider.acceptingNew ? "outline-primary" : "outline-secondary"} 
                      disabled={!provider.acceptingNew}
                      className="d-flex align-items-center gap-2"
                      onClick={() => handleRequestAssignment(provider)}
                    >
                      <UserPlus size={16} /> Request PCP
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProviders.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No providers match your search criteria.</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {selectedProvider && (
        <ConfirmDialog
          show={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmAssignment}
          title="Confirm Provider Assignment"
          message={`Are you sure you want to request ${selectedProvider.name} as your Primary Care Provider? This will send a verification request to their clinic.`}
          confirmLabel="Send Request"
          variant="primary"
        />
      )}
    </PageWrapper>
  );
}

export default ProviderAssignmentPage;
