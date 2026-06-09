import PageWrapper from '../../components/layout/PageWrapper';
function MedicalRecordsPage() {
  return (
    <PageWrapper title="Medical Records & Prescriptions" subtitle="Review historical diagnoses, check active prescriptions, and download treatment checklists.">
      <div className="card glass-panel p-5 text-center">
        <h4 className="fw-bold">Medical Records — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Diagnoses, prescriptions, and checklists will be built here.</p>
      </div>
    </PageWrapper>
  );
}
export default MedicalRecordsPage;
