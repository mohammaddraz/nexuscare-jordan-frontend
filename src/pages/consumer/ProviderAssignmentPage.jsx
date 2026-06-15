import { useState, useCallback, useEffect } from 'react';
import { Row, Col, Form, Button, InputGroup, Badge, Modal, Table } from 'react-bootstrap';
import { Search, MapPin, Star, UserPlus, History } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import PageWrapper from '../../components/layout/PageWrapper';
import { consumerService } from '../../services/consumerService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import './ProviderAssignmentPage.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

// Default center: Amman, Jordan
const defaultCenter = {
  lat: 31.9522,
  lng: 35.9333,
};

/**
 * ProviderAssignmentPage — Search clinic directory and request a Primary Care Provider.
 * Integrated with Google Maps for visual directory.
 */
function ProviderAssignmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // History state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const data = await consumerService.getProviders();
        
        // Ensure lat/lng are numbers for Google Maps
        const parsedData = data.map(p => ({
          ...p,
          id: p.user_id, // Map backend user_id to frontend id
          acceptingNew: p.accepting_new,
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lng)
        }));
        
        setProviders(parsedData);
        setFilteredProviders(parsedData);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Filter effect
  useEffect(() => {
    let results = providers;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.specialty.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
      );
    }
    
    if (selectedCity !== 'All') {
      results = results.filter(p => p.city === selectedCity);
    }
    
    if (selectedSpecialty !== 'All') {
      results = results.filter(p => p.specialty.includes(selectedSpecialty));
    }
    
    setFilteredProviders(results);

    // Auto-center map if only 1 result
    if (results.length === 1 && results[0].lat && results[0].lng) {
      setMapCenter({ lat: results[0].lat, lng: results[0].lng });
      setActiveMarker(results[0].id);
    }
  }, [searchTerm, selectedCity, selectedSpecialty, providers]);

  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRequestAssignment = (provider) => {
    setSelectedProvider(provider);
    setShowConfirm(true);
  };

  const confirmAssignment = async () => {
    try {
      // Fetch family to get the primary patient ID
      const family = await consumerService.getFamily();
      if (!family || family.length === 0) {
        alert("Could not find your patient profile.");
        return;
      }
      
      const primaryPatientId = family[0].id; // Assuming first is primary or just using the first one
      await consumerService.requestPCP(primaryPatientId, selectedProvider.id);
      
      alert(`Assignment request sent to ${selectedProvider.name}. Pending clinic approval.`);
    } catch (err) {
      console.error(err);
      alert("Failed to send assignment request. " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  const handleMarkerClick = (provider) => {
    setActiveMarker(provider.id);
    setMapCenter({ lat: provider.lat, lng: provider.lng });
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      setShowHistoryModal(true);
      const data = await consumerService.getPCPHistory();
      setHistoryData(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Google Maps rendering block
  const renderMap = () => {
    if (loadError) return <div className="p-4 text-center text-danger">Error loading maps API. Check your API key.</div>;
    if (!isLoaded) return <div className="p-4 text-center">Loading map...</div>;

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={12}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {filteredProviders.map((provider) => (
          provider.lat && provider.lng && (
            <Marker
              key={provider.id}
              position={{ lat: provider.lat, lng: provider.lng }}
              onClick={() => handleMarkerClick(provider)}
              icon={{
                url: provider.acceptingNew ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }}
            >
              {activeMarker === provider.id && (
                <InfoWindow 
                  position={{ lat: provider.lat, lng: provider.lng }} 
                  onCloseClick={() => setActiveMarker(null)}
                >
                  <div className="provider-assignment-map-info">
                    <h6>{provider.name}</h6>
                    <p>{provider.specialty}</p>
                    <p>{provider.clinic}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        ))}
      </GoogleMap>
    );
  };

  return (
    <PageWrapper
      title="Clinical Provider Assignment"
      subtitle="Search the clinic directory and request a designated Primary Care Provider (PCP)."
      actions={
        <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={fetchHistory}>
          <History size={16} /> View Request History
        </Button>
      }
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
                <Form.Select 
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    if (e.target.value === 'Amman') setMapCenter({ lat: 31.9522, lng: 35.9333 });
                    if (e.target.value === 'Irbid') setMapCenter({ lat: 32.5568, lng: 35.8469 });
                    if (e.target.value === 'Zarqa') setMapCenter({ lat: 32.0653, lng: 36.0895 });
                  }}
                >
                  <option value="All">All Cities</option>
                  <option value="Amman">Amman</option>
                  <option value="Irbid">Irbid</option>
                  <option value="Zarqa">Zarqa</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="All">All Specialties</option>
                  <option value="General">General Practice</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="card glass-panel provider-assignment-map-container">
            <div className="card-body p-0 h-100 position-relative">
               {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                 <div className="position-absolute top-0 start-0 w-100 p-2 bg-warning text-dark text-center provider-assignment-map-warning">
                   Missing VITE_GOOGLE_MAPS_API_KEY. Map is in dev mode.
                 </div>
               )}
               {renderMap()}
            </div>
          </div>
        </Col>

        <Col lg={8}>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="mb-0 fw-bold provider-assignment-title">Available Providers</h2>
              <Badge bg="primary" pill>{filteredProviders.length}</Badge>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading providers...</p>
              </div>
            ) : filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <div 
                  key={provider.id} 
                  className={`card glass-panel-hover p-4 animate-fadeInUp provider-assignment-card ${activeMarker === provider.id ? 'border-primary shadow-sm' : ''}`}
                >
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                    <div>
                      <h5 className="fw-bold mb-1 provider-assignment-name">{provider.name}</h5>
                      <p className="mb-2 text-muted provider-assignment-subtitle">
                        {provider.specialty} • {provider.clinic}
                      </p>
                      <div className="d-flex align-items-center gap-3 provider-assignment-meta">
                        <span className="d-flex align-items-center gap-1 text-muted cursor-pointer hover-text-primary" onClick={() => handleMarkerClick(provider)}>
                          <MapPin size={14} /> {provider.city} (View on Map)
                        </span>
                        <span className="d-flex align-items-center gap-1 text-warning fw-bold">
                          <Star size={14} className="fill-warning" /> {provider.rating}
                        </span>
                        {provider.accepting_new ? (
                          <span className="text-success fw-bold d-flex align-items-center gap-1">
                            <span className="rounded-circle bg-success provider-assignment-dot"></span> Accepting New Patients
                          </span>
                        ) : (
                          <span className="text-danger fw-bold d-flex align-items-center gap-1">
                            <span className="rounded-circle bg-danger provider-assignment-dot"></span> Full Capacity
                          </span>
                        )}
                      </div>
                      
                      {/* Provider Networks */}
                      <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
                        {provider.networks && provider.networks.filter(n => n && n.tier).map((net, idx) => {
                          const companyMap = {
                            '11111111-1111-1111-1111-111111111111': 'NatHealth',
                            '22222222-2222-2222-2222-222222222222': 'GIG Jordan',
                            '33333333-3333-3333-3333-333333333333': 'MedNet'
                          };
                          const companyName = companyMap[net.company_id] || 'Insurance';
                          return (
                            <Badge key={idx} bg={net.tier === 'Premium' ? 'primary' : net.tier === 'Standard' ? 'success' : 'secondary'} className="fw-normal provider-assignment-network-badge">
                              {companyName} {net.tier}
                            </Badge>
                          );
                        })}
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
              ))
            ) : (
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

      {/* History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>PCP Assignment History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-muted text-uppercase page-table-header">Date Requested</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Family Member</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Provider</th>
                <th className="py-3 text-muted text-uppercase page-table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
              ) : historyData.length > 0 ? (
                historyData.map(req => (
                  <tr key={req.id}>
                    <td className="px-4 page-table-cell">{new Date(req.date_requested).toLocaleDateString()}</td>
                    <td className="page-table-cell--bold">{req.patient_name}</td>
                    <td className="page-table-cell">{req.provider_name}</td>
                    <td><StatusBadge status={req.status} size="sm" /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-5 text-muted">No request history found.</td></tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowHistoryModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </PageWrapper>
  );
}

export default ProviderAssignmentPage;
