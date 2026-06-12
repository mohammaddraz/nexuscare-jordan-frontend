import PageWrapper from '../../components/layout/PageWrapper';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TermsPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper title="Terms of Service" subtitle="Legal agreements for using the NexusCare Jordan portal.">
      <div className="card glass-panel p-5">
        <h5 className="fw-bold mb-3">1. Acceptance of Terms</h5>
        <p className="text-muted mb-4">
          By accessing the NexusCare portal, you agree to comply with all MOH regulations regarding data privacy and electronic healthcare records.
        </p>

        <h5 className="fw-bold mb-3">2. Data Privacy</h5>
        <p className="text-muted mb-4">
          Patient records are strictly confidential and encrypted. Unauthorized access by providers to non-assigned patients will result in immediate network expulsion.
        </p>

        <div className="mt-4">
          <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default TermsPage;
