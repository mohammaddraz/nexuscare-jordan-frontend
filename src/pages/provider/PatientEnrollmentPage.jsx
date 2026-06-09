import PageWrapper from '../../components/layout/PageWrapper';
function PatientEnrollmentPage() {
  return (
    <PageWrapper title="Patient Enrollment Gateway" subtitle="Audit, approve, or reject consumer enrollment applications.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Enrollment Gateway — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Enrollment approval workflow will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default PatientEnrollmentPage;
