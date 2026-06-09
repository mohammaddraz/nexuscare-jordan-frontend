import PageWrapper from '../../components/layout/PageWrapper';
function ComplianceDashboardPage() {
  return (
    <PageWrapper title="System Compliance Dashboard" subtitle="Monitor network-wide analytics, physician counts, and claims processing metrics.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Compliance Dashboard — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>System-wide KPIs and analytics will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default ComplianceDashboardPage;
