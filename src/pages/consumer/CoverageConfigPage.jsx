import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { ShieldCheck, User } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { mockDependents } from '../../data/consumerData';

/**
 * CoverageConfigPage — Independent Coverage Configuration
 * Allows customizing insurance contracts for each family member independently.
 */
function CoverageConfigPage() {
  const [dependents, setDependents] = useState(mockDependents);
  const [activeDependentId, setActiveDependentId] = useState(dependents[0].id);

  const activeDependent = dependents.find(d => d.id === activeDependentId);

  const handleUpdateCoverage = (e) => {
    e.preventDefault();
    // Simulate updating coverage
    alert('Coverage update request submitted for administrative review.');
  };

  return (
    <PageWrapper
      title="Coverage Configuration"
      subtitle="Customize specific insurance contracts for each family member independently."
    >
      <Row className="g-4">
        {/* Left Column: Member Selector */}
        <Col md={4}>
          <div className="card glass-panel h-100">
            <div className="card-header bg-transparent border-bottom px-4 py-3">
              <h6 className="mb-0 fw-bold">Select Member</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded-bottom">
                {dependents.map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => setActiveDependentId(dep.id)}
                    className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-3 ${activeDependentId === dep.id ? 'bg-light' : ''}`}
                    style={{
                      borderLeft: activeDependentId === dep.id ? '4px solid var(--color-brand-secondary)' : '4px solid transparent',
                    }}
                  >
                    <div className="flex-grow-1 text-start">
                      <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{dep.name}</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>Current: {dep.planType}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column: Configuration Form */}
        <Col md={8}>
          <div className="card glass-panel animate-fadeIn" key={activeDependentId}>
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-10" style={{ width: 48, height: 48 }}>
                  <ShieldCheck size={24} color="var(--color-brand-secondary)" />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Configure Plan for {activeDependent.name}</h5>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>Changes require MOH administrative approval.</p>
                </div>
              </div>

              <Form onSubmit={handleUpdateCoverage}>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Insurance Contract Tier</Form.Label>
                      <Form.Select defaultValue={activeDependent.planType}>
                        <option value="Platinum Care JOR">Platinum Care JOR (100% In-Network)</option>
                        <option value="Gold Shield JOR">Gold Shield JOR (80% In-Network)</option>
                        <option value="Silver Basic JOR">Silver Basic JOR (MOH Public Clinics Only)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Deductible Preference</Form.Label>
                      <Form.Select defaultValue="standard">
                        <option value="low">Low Deductible (Higher Premium)</option>
                        <option value="standard">Standard MOH Deductible</option>
                        <option value="high">High Deductible (Lower Premium)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="p-3 border rounded-3 mb-4" style={{ backgroundColor: '#f8fafc' }}>
                  <h6 className="fw-bold" style={{ fontSize: '0.85rem' }}>Additional Riders (Optional)</h6>
                  <Form.Check type="switch" id="dental" label="Dental Coverage (+15 JOD/mo)" className="mb-2" style={{ fontSize: '0.85rem' }} />
                  <Form.Check type="switch" id="vision" label="Vision Coverage (+10 JOD/mo)" className="mb-2" style={{ fontSize: '0.85rem' }} />
                  <Form.Check type="switch" id="maternity" label="Maternity Care (+25 JOD/mo)" style={{ fontSize: '0.85rem' }} />
                </div>

                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="primary">Submit Modification Request</Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default CoverageConfigPage;
