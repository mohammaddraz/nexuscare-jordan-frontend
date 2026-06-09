import { useState, useCallback } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Search, MapPin, Star, UserPlus } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import PageWrapper from '../../components/layout/PageWrapper';
import { mockProviders } from '../../data/consumerData';
import ConfirmDialog from '../../components/common/ConfirmDialog';

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
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const results = mockProviders.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.specialty.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term)
    );
    
    setFilteredProviders(results);

    // If there's exactly one result, center map on it
    if (results.length === 1 && results[0].lat && results[0].lng) {
      setMapCenter({ lat: results[0].lat, lng: results[0].lng });
      setActiveMarker(results[0].id);
    }
  };

  const handleRequestAssignment = (provider) => {
    setSelectedProvider(provider);
    setShowConfirm(true);
  };

  const confirmAssignment = () => {
    alert(`Assignment request sent to ${selectedProvider.name}. Pending clinic approval.`);
    setShowConfirm(false);
  };

  const handleMarkerClick = (provider) => {
    setActiveMarker(provider.id);
    setMapCenter({ lat: provider.lat, lng: provider.lng });
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
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div style={{ color: '#333', padding: '5px', maxWidth: '200px' }}>
                    <h6 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{provider.name}</h6>
                    <p style={{ margin: '4px 0', fontSize: '12px' }}>{provider.specialty}</p>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>{provider.clinic}</p>
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
                <Form.Select onChange={(e) => {
                  if (e.target.value === 'Amman') setMapCenter({ lat: 31.9522, lng: 35.9333 });
                  if (e.target.value === 'Irbid') setMapCenter({ lat: 32.5568, lng: 35.8469 });
                }}>
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

          <div className="card glass-panel" style={{ height: 350, overflow: 'hidden' }}>
            <div className="card-body p-0 h-100 position-relative">
               {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                 <div className="position-absolute top-0 start-0 w-100 p-2 bg-warning text-dark text-center" style={{ zIndex: 10, fontSize: '0.8rem', fontWeight: 'bold' }}>
                   Missing VITE_GOOGLE_MAPS_API_KEY. Map is in dev mode.
                 </div>
               )}
               {renderMap()}
            </div>
          </div>
        </Col>

        <Col lg={8}>
          <div className="d-flex flex-column gap-3">
            {filteredProviders.map((provider) => (
              <div 
                key={provider.id} 
                className={`card glass-panel-hover p-4 animate-fadeInUp ${activeMarker === provider.id ? 'border-primary shadow-sm' : ''}`}
                style={{ transition: 'all 0.3s ease' }}
              >
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--color-brand-primary)' }}>{provider.name}</h5>
                    <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      {provider.specialty} • {provider.clinic}
                    </p>
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.75rem' }}>
                      <span className="d-flex align-items-center gap-1 text-muted cursor-pointer hover-text-primary" onClick={() => handleMarkerClick(provider)}>
                        <MapPin size={14} /> {provider.city} (View on Map)
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
