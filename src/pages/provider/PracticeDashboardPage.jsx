import { Row, Col, Button } from 'react-bootstrap';
import { Users, CheckCircle, Star, UserPlus, TrendingUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockDashboardStats, mockRecentLogs } from '../../data/providerData';

/**
 * PracticeDashboardPage — Analytics overview for clinics.
 */
function PracticeDashboardPage() {
  return (
    <PageWrapper
      title="Practice Dashboard"
      subtitle="Maintain high-level visibility over clinic visits, claims success rates, and pending queues."
    >
      <Row className="g-4 mb-5 stagger-children">
        <Col md={6} lg={3}>
          <StatsCard
            title="Total Clinic Visits"
            value={mockDashboardStats.totalVisits}
            subtitle={mockDashboardStats.visitsTrend}
            icon={Users}
            trend="+12%"
            trendDirection="up"
            variant="primary"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Claims Approval Rate"
            value={`${mockDashboardStats.claimsSuccessRate}%`}
            subtitle={mockDashboardStats.claimsTrend}
            icon={CheckCircle}
            trend="+2.1%"
            trendDirection="up"
            variant="success"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Average Patient Rating"
            value={mockDashboardStats.averageRating}
            subtitle={mockDashboardStats.ratingTrend}
            icon={Star}
            trend="Stable"
            trendDirection="neutral"
            variant="warning"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Pending PCP Enrollments"
            value={mockDashboardStats.pendingEnrollments}
            subtitle={mockDashboardStats.pendingTrend}
            icon={UserPlus}
            trend="-3"
            trendDirection="down"
            variant="danger"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="card glass-panel h-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <h6 className="fw-bold mb-0">Recent Clinical Logs</h6>
              <Button variant="link" size="sm" className="text-decoration-none fw-bold" href="/provider/clinical-logging">View All</Button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Date</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Patient</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Diagnosis</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>Claim Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4" style={{ fontSize: '0.8rem' }}>{log.date}</td>
                        <td className="fw-bold" style={{ fontSize: '0.85rem' }}>{log.patientName}</td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>{log.diagnosis}</div>
                          <div className="text-muted font-mono" style={{ fontSize: '0.7rem' }}>{log.icdCode} • {log.billingCode}</div>
                        </td>
                        <td><StatusBadge status={log.claimStatus} size="sm" /></td>
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
            <div className="card-header bg-transparent border-bottom px-4 py-3">
              <h6 className="fw-bold mb-0">Platform Announcements</h6>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <span className="badge bg-danger rounded-pill mb-2">Urgent Update</span>
                <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>MOH API Maintenance</h6>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>The central registry will undergo scheduled maintenance on Friday at 02:00 AM AST. Claims submitted during this window will be queued.</p>
              </div>
              <hr className="text-muted opacity-25" />
              <div>
                <span className="badge bg-primary rounded-pill mb-2">New Feature</span>
                <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>ICD-11 Transition Plan</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>NexusCare is preparing for the ICD-11 coding update. A sandbox environment will be available next month for staff training.</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default PracticeDashboardPage;
