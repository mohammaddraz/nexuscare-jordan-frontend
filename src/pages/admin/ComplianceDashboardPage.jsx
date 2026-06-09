import { Row, Col, ProgressBar } from 'react-bootstrap';
import { Users, Building, Activity, Clock, AlertTriangle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockComplianceStats, mockRegionalData } from '../../data/adminData';

/**
 * ComplianceDashboardPage — System-wide analytics for MOH admins.
 */
function ComplianceDashboardPage() {
  return (
    <PageWrapper
      title="System Compliance Dashboard"
      subtitle="Monitor network-wide analytics, regional coverage metrics, and claims processing performance."
    >
      <Row className="g-4 mb-5 stagger-children">
        <Col md={6} lg={3}>
          <StatsCard
            title="Active Insured Citizens"
            value={(mockComplianceStats.activeInsured / 1000).toFixed(1) + 'k'}
            subtitle={mockComplianceStats.insuredTrend}
            icon={Users}
            trend="+12%"
            trendDirection="up"
            variant="primary"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Registered Network Physicians"
            value={mockComplianceStats.totalPhysicians}
            subtitle={mockComplianceStats.physiciansTrend}
            icon={Building}
            trend="+45"
            trendDirection="up"
            variant="info"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Avg Claims Processing Time"
            value={mockComplianceStats.claimsProcessingTime}
            subtitle={mockComplianceStats.processingTrend}
            icon={Clock}
            trend="-1.1h"
            trendDirection="up"
            variant="success"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Total Processed Claims"
            value={(mockComplianceStats.totalClaims / 1000000).toFixed(2) + 'M'}
            subtitle={mockComplianceStats.claimsTrend}
            icon={Activity}
            trend="Stable"
            trendDirection="neutral"
            variant="secondary"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="card glass-panel h-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card-header bg-transparent border-bottom px-4 py-3">
              <h6 className="fw-bold mb-0">Regional Coverage & Network Health</h6>
            </div>
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light border-bottom border-top">
                    <tr>
                      <th className="px-3 py-2 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Region</th>
                      <th className="py-2 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Population Coverage</th>
                      <th className="py-2 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Active Clinics</th>
                      <th className="py-2 text-muted text-uppercase text-end px-3" style={{ fontSize: '0.65rem' }}>Health Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRegionalData.map((region, idx) => (
                      <tr key={idx}>
                        <td className="px-3 fw-bold" style={{ fontSize: '0.85rem' }}>{region.region}</td>
                        <td style={{ width: '40%' }}>
                          <div className="d-flex align-items-center gap-2">
                            <span className="font-mono text-muted" style={{ fontSize: '0.75rem', width: '35px' }}>{region.coverage}%</span>
                            <ProgressBar 
                              now={region.coverage} 
                              variant={region.coverage > 75 ? 'success' : region.coverage > 60 ? 'warning' : 'danger'} 
                              style={{ height: '6px', flexGrow: 1 }} 
                            />
                          </div>
                        </td>
                        <td className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>{region.clinics}</td>
                        <td className="text-end px-3">
                          <StatusBadge 
                            status={region.status === 'Optimal' ? 'Active' : region.status === 'Good' ? 'Pending' : 'Rejected'} 
                            size="sm" 
                            label={region.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card glass-panel h-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center gap-2">
              <AlertTriangle size={18} color="var(--color-danger)" />
              <h6 className="fw-bold mb-0">System Alerts</h6>
            </div>
            <div className="card-body p-4">
              <div className="alert alert-warning border-0 shadow-sm" role="alert">
                <h6 className="alert-heading fw-bold" style={{ fontSize: '0.85rem' }}>Zarqa Provider Shortage</h6>
                <p className="mb-0 text-dark opacity-75" style={{ fontSize: '0.75rem' }}>
                  Coverage in Zarqa has dropped below 60%. Prioritize onboarding new clinics in this region.
                </p>
              </div>
              <div className="alert alert-danger border-0 shadow-sm" role="alert">
                <h6 className="alert-heading fw-bold" style={{ fontSize: '0.85rem' }}>API Gateway Latency</h6>
                <p className="mb-0 text-dark opacity-75" style={{ fontSize: '0.75rem' }}>
                  The national ID verification endpoint is currently experiencing elevated latency (avg 850ms).
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default ComplianceDashboardPage;
