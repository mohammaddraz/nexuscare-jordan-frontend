import PageWrapper from '../../components/layout/PageWrapper';
function ProviderAssignmentPage() {
  return (
    <PageWrapper title="Clinical Provider Assignment" subtitle="Search the clinic directory and request a designated Primary Care Provider (PCP).">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Provider Assignment — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>PCP search with Google Maps integration will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default ProviderAssignmentPage;
