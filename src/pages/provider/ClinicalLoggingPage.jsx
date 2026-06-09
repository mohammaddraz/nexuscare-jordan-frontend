import PageWrapper from '../../components/layout/PageWrapper';
function ClinicalLoggingPage() {
  return (
    <PageWrapper title="Clinical Patient Logging" subtitle="Log visits, record ICD diagnostics, assign billing codes, and file insurance claims.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Clinical Logging — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Visit logging and claims filing will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default ClinicalLoggingPage;
