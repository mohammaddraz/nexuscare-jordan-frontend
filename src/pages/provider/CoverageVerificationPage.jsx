import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Search, ShieldCheck, ShieldAlert, User } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatusBadge from '../../components/ui/StatusBadge';
import { providerService } from '../../services/providerService';
import './CoverageVerificationPage.css';

/**
 * CoverageVerificationPage — Instantly check national ID listings and verify real-time insurance.
 */
function CoverageVerificationPage() {
  const [nationalId, setNationalId] = useState('');
  const [result, setResult] = useState(null); // { status: 'success' | 'not-found', data: {...} }
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!nationalId) return;

    setIsLoading(true);
    
    try {
      const data = await providerService.verifyCoverage(nationalId);
      setResult({ 
        status: 'success', 
        data: {
          name: data.name,
          plan: data.plan_type,
          status: data.approval_status === 'Approved' ? 'Active' : data.approval_status,
          network: data.network_status,
          company: data.insurance_company_name,
          copay: data.network_status === 'In-Network' ? '10.00 JOD' : '100% Patient Responsibility'
        }
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setResult({ status: 'not-found' });
      } else {
        console.error('Verification error:', err);
        setResult({ status: 'not-found' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Coverage Verification Sandbox"
      subtitle="Instantly check national ID listings and verify real-time insurance card eligibility to eliminate out-of-network surprises."
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card glass-panel mb-4 animate-fadeInUp">
            <div className="card-body p-4 p-md-5 text-center">
              <div className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center coverage-verify-icon">
                <ShieldCheck size={32} color="var(--color-brand-secondary)" />
              </div>
              <h4 className="fw-bold mb-3">Check Patient Eligibility</h4>
              <p className="text-muted mb-4 coverage-verify-desc">
                Enter a 10-digit Jordanian National ID to securely query the MOH central registry for active coverage.
              </p>
              
              <Form onSubmit={handleVerify} className="coverage-verify-form">
                <InputGroup className="mb-3 input-group-lg shadow-sm">
                  <InputGroup.Text className="bg-white border-end-0">
                    <Search size={20} color="var(--color-text-muted)" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 9821034455"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="border-start-0 ps-0 text-center font-mono fw-bold coverage-verify-input"
                    disabled={isLoading}
                  />
                </InputGroup>
                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit" 
                  className="w-100 fw-bold"
                  disabled={nationalId.length < 10 || isLoading}
                >
                  {isLoading ? 'Querying MOH Database...' : 'Verify Coverage Now'}
                </Button>
                
                <p className="mt-3 text-muted coverage-verify-hint">
                  Demo IDs: Try <strong>9821034455</strong> (Platinum) or <strong>9999999999</strong> (Inactive)
                </p>
              </Form>
            </div>
          </div>

          {result && result.status === 'success' && (
            <div className="card border-0 shadow-lg animate-scaleIn overflow-hidden">
              <div className="card-header bg-success text-white px-4 py-3 d-flex align-items-center gap-2 border-0">
                <ShieldCheck size={20} />
                <h6 className="fw-bold mb-0">Active Coverage Verified</h6>
              </div>
              <div className="card-body p-4 p-md-5 bg-white">
                <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                  <div className="rounded-circle d-flex align-items-center justify-content-center bg-light coverage-verify-result-icon">
                    <User size={40} color="var(--color-text-muted)" />
                  </div>
                  <div>
                    <p className="text-muted text-uppercase mb-1 coverage-verify-profile-label">Patient Profile</p>
                    <h3 className="fw-bold mb-1 coverage-verify-profile-name">{result.data.name}</h3>
                    <p className="font-mono text-muted mb-0">ID: {nationalId}</p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <p className="text-muted text-uppercase mb-1 coverage-verify-tier-label">Contract Tier</p>
                      <h6 className="fw-bold mb-2">{result.data.plan}</h6>
                      <StatusBadge status={result.data.status} size="sm" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <p className="text-muted text-uppercase mb-1 coverage-verify-tier-label">Network & Copay</p>
                      <h6 className={`fw-bold mb-1 ${result.data.network === 'In-Network' ? 'text-success' : 'text-danger'}`}>
                        {result.data.company} - {result.data.network}
                      </h6>
                      <p className="mb-0 fw-bold coverage-verify-copay">Copay: {result.data.copay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && result.status === 'not-found' && (
            <div className="card border-0 shadow-lg animate-scaleIn overflow-hidden">
              <div className="card-header bg-danger text-white px-4 py-3 d-flex align-items-center gap-2 border-0">
                <ShieldAlert size={20} />
                <h6 className="fw-bold mb-0">Coverage Not Found</h6>
              </div>
              <div className="card-body p-4 text-center bg-white">
                <p className="fw-bold mb-2 coverage-verify-notfound-title">No active insurance found for ID: {nationalId}</p>
                <p className="text-muted coverage-verify-notfound-text">
                  Please ensure the National ID is correct. If the patient recently applied, their registration may still be pending administrative review.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default CoverageVerificationPage;
