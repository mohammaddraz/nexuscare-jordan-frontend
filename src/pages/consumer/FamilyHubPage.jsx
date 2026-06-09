import PageWrapper from '../../components/layout/PageWrapper';
import { Users } from 'lucide-react';

/**
 * FamilyHubPage — Active Profile Switcher
 * TODO: Full implementation in feature/consumer-portal branch
 */
function FamilyHubPage() {
  return (
    <PageWrapper
      title="Family Hub"
      subtitle="Interactively toggle between registered active dependents or add a new family member."
    >
      <div className="card glass-panel p-5 text-center">
        <Users size={48} color="var(--color-brand-secondary)" className="mx-auto mb-3" />
        <h4 className="fw-bold">Family Hub — Coming Soon</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Active profile switcher with dependent management will be built here.
        </p>
      </div>
    </PageWrapper>
  );
}

export default FamilyHubPage;
