import { useState, useEffect } from 'react';
import { Row, Col, ProgressBar, Tabs, Tab, Accordion, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { Users, Building, Activity, Clock, AlertTriangle, Info, Map } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockComplianceStats, mockRegionalData } from '../../data/adminData';
import { adminService } from '../../services/adminService';
import './ComplianceDashboardPage.css';

/**
 * ComplianceDashboardPage — System-wide analytics for MOH admins.
 */
function ComplianceDashboardPage() {
  const [activeTab, setActiveTab] = useState('data');
  const [stats, setStats] = useState({
    total_consumers: 0,
    pending_approvals: 0,
    total_claims: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderTooltip = (text) => (
    <Tooltip id="stat-tooltip">{text}</Tooltip>
  );

  return (
    <PageWrapper
      title="System Compliance Dashboard"
      subtitle="Monitor network-wide analytics, regional coverage metrics, and claims processing performance."
    >
      <Row className="g-4 mb-5 stagger-children">
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Compared to Q3 2023 baseline")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Active Insured Citizens"
                value={stats.total_consumers}
                subtitle="Total Verified"
                icon={Users}
                trend="+12%"
                trendDirection="up"
                variant="primary"
                chartData={mockComplianceStats.insuredHistory}
              />
            </div>
          </OverlayTrigger>
        </Col>
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Newly verified facilities this month")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Pending Consumer Approvals"
                value={stats.pending_approvals}
                subtitle="Pending Requests"
                icon={Building}
                trend="+45"
                trendDirection="up"
                variant="info"
                chartData={mockComplianceStats.physiciansHistory}
              />
            </div>
          </OverlayTrigger>
        </Col>
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Improvement from last quarter")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Total Claims Submitted"
                value={stats.total_claims}
                subtitle="All Claim Types"
                icon={Clock}
                trend="-1.1h"
                trendDirection="up"
                variant="success"
                chartData={mockComplianceStats.processingHistory}
              />
            </div>
          </OverlayTrigger>
        </Col>
        <Col md={6} lg={3}>
          <OverlayTrigger placement="top" overlay={renderTooltip("Year to date total operations")}>
            <div className="dashboard-tooltip-trigger">
              <StatsCard
                title="Total Processed Claims"
                value={(mockComplianceStats.totalClaims / 1000000).toFixed(2) + 'M'}
                subtitle={mockComplianceStats.claimsTrend}
                icon={Activity}
                trend="Stable"
                trendDirection="neutral"
                variant="secondary"
                chartData={mockComplianceStats.claimsHistory}
              />
            </div>
          </OverlayTrigger>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="card glass-panel h-100 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="card-header bg-transparent border-bottom px-4 py-3">
              <h6 className="fw-bold mb-0">Regional Coverage & Network Health</h6>
            </div>
            
            <div className="px-4 pt-3">
              <Tabs
                id="regional-data-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 border-bottom-0"
              >
                <Tab eventKey="data" title="Data View" />
                <Tab eventKey="map" title="Visual Map (Beta)" />
              </Tabs>
            </div>

            <div className="card-body p-0">
              {activeTab === 'data' ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light border-bottom border-top">
                      <tr>
                        <th className="px-4 py-3 text-muted text-uppercase dashboard-table-header">Region</th>
                        <th className="py-3 text-muted text-uppercase dashboard-table-header">Population Coverage</th>
                        <th className="py-3 text-muted text-uppercase dashboard-table-header">Active Clinics</th>
                        <th className="py-3 text-muted text-uppercase text-end px-4 dashboard-table-header">Health Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRegionalData.map((region, idx) => (
                        <tr key={idx}>
                          <td className="px-4 fw-bold dashboard-table-cell">{region.region}</td>
                          <td style={{ width: '40%' }}>
                            <div className="d-flex align-items-center gap-2">
                              <span className="font-mono text-muted dashboard-table-cell-sm" style={{ width: '35px' }}>{region.coverage}%</span>
                              <ProgressBar 
                                now={region.coverage} 
                                variant={region.coverage > 75 ? 'success' : region.coverage > 60 ? 'warning' : 'danger'} 
                                className="dashboard-progress-bar"
                              />
                            </div>
                          </td>
                          <td className="font-mono text-muted dashboard-table-cell-mono">{region.clinics}</td>
                          <td className="text-end px-4">
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
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted dashboard-map-container">
                  <Map size={48} className="mb-3 opacity-50 text-primary" />
                  <h6 className="fw-bold">Interactive Map Coming Soon</h6>
                  <p className="text-center dashboard-map-text">
                    The geographical visualization of coverage data is currently in beta testing.
                  </p>
                  <Badge bg="primary" className="mt-2">Beta Sandbox</Badge>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="card glass-panel h-100 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={18} color="var(--color-danger)" />
                <h6 className="fw-bold mb-0">System Alerts</h6>
              </div>
              <Badge bg="danger" pill>2 Active</Badge>
            </div>
            <div className="card-body p-0">
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <div className="dashboard-alert-dot" style={{ backgroundColor: 'var(--color-danger)' }}></div>
                      <span className="fw-bold dashboard-alert-title">Zarqa Provider Shortage</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="bg-danger bg-opacity-10 text-danger border-top">
                    <p className="mb-0 fw-medium dashboard-alert-text">
                      Coverage in Zarqa has dropped below 60%. Prioritize onboarding new clinics in this region immediately to prevent overflow.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <div className="dashboard-alert-dot" style={{ backgroundColor: 'var(--color-warning)' }}></div>
                      <span className="fw-bold dashboard-alert-title">API Gateway Latency</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="bg-warning bg-opacity-10 text-dark border-top">
                    <p className="mb-0 dashboard-alert-text">
                      The national ID verification endpoint is currently experiencing elevated latency (avg 850ms). IT operations are investigating.
                    </p>
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

export default ComplianceDashboardPage;
