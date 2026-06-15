import { useState } from 'react';
import { Row, Col, Button, Tabs, Tab, Accordion, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { Users, CheckCircle, Star, UserPlus, Info } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockDashboardStats, mockRecentLogs } from '../../data/providerData';
import './PracticeDashboardPage.css';

/**
 * PracticeDashboardPage — Analytics overview for clinics.
 */
function PracticeDashboardPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredLogs = mockRecentLogs.filter(log => {
    if (activeTab === 'all') return true;
    return log.claimStatus.toLowerCase() === activeTab;
  });

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  return (
    <PageWrapper
      title="Practice Dashboard"
      subtitle="Maintain high-level visibility over clinic visits, claims success rates, and pending queues."
    >
      <Row className="g-4 mb-5 stagger-children">
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Compared to previous 30 days")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Total Clinic Visits"
                value={mockDashboardStats.totalVisits}
                subtitle={mockDashboardStats.visitsTrend}
                icon={Users}
                trend="+12%"
                trendDirection="up"
                variant="primary"
                chartData={mockDashboardStats.visitsHistory}
              />
            </div>
          </OverlayTrigger>
        </Col>
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Percentage of first-pass approvals")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Claims Approval Rate"
                value={`${mockDashboardStats.claimsSuccessRate}%`}
                subtitle={mockDashboardStats.claimsTrend}
                icon={CheckCircle}
                trend="+2.1%"
                trendDirection="up"
                variant="success"
                chartData={mockDashboardStats.claimsHistory}
              />
            </div>
          </OverlayTrigger>
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
            chartData={mockDashboardStats.ratingHistory}
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
            chartData={mockDashboardStats.pendingHistory}
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
            
            <div className="px-4 pt-3">
              <Tabs
                id="clinical-logs-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 border-bottom-0 custom-tabs"
              >
                <Tab eventKey="all" title="All Logs" />
                <Tab eventKey="paid" title="Paid Claims" />
                <Tab eventKey="pending" title="Pending Claims" />
              </Tabs>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-muted text-uppercase page-table-header">Date</th>
                      <th className="py-3 text-muted text-uppercase page-table-header">Patient</th>
                      <th className="py-3 text-muted text-uppercase page-table-header">
                        Diagnosis 
                        <OverlayTrigger placement="right" overlay={renderTooltip("ICD-10 and Billing Codes")}>
                          <Info size={12} className="ms-1 d-inline text-primary dashboard-info-icon" />
                        </OverlayTrigger>
                      </th>
                      <th className="py-3 text-muted text-uppercase page-table-header">Claim Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 page-table-cell">{log.date}</td>
                        <td className="fw-bold page-table-cell">{log.patientName}</td>
                        <td>
                          <div className="page-table-cell">{log.diagnosis}</div>
                          <div className="text-muted font-mono clinical-log-icd">{log.icdCode} • {log.billingCode}</div>
                        </td>
                        <td><StatusBadge status={log.claimStatus} size="sm" /></td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          No logs found in this category.
                        </td>
                      </tr>
                    )}
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
            <div className="card-body p-0">
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div>
                      <Badge bg="danger" className="rounded-pill mb-1">Urgent Update</Badge>
                      <div className="fw-bold dashboard-announcement-title">MOH API Maintenance</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted dashboard-announcement-body">
                    The central registry will undergo scheduled maintenance on Friday at 02:00 AM AST. Claims submitted during this window will be queued.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <div>
                      <Badge bg="primary" className="rounded-pill mb-1">New Feature</Badge>
                      <div className="fw-bold dashboard-announcement-title">ICD-11 Transition Plan</div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted dashboard-announcement-body">
                    NexusCare is preparing for the ICD-11 coding update. A sandbox environment will be available next month for staff training. Detailed documentation will be provided via email.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default PracticeDashboardPage;
