import PageWrapper from '../../components/layout/PageWrapper';
function ClaimsPage() {
  return (
    <PageWrapper title="Self-Service Claims Processing" subtitle="Submit outpatient reimbursement claims with automated deductible calculations.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Claims Processing — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Claim submission and tracking will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default ClaimsPage;
