import PageWrapper from '../../components/layout/PageWrapper';
function PracticeDashboardPage() {
  return (
    <PageWrapper title="Practice Dashboard" subtitle="High-level visibility over clinic visits, claims success rates, and pending queues.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Practice Dashboard — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>KPI cards and analytics will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default PracticeDashboardPage;
