import { useState } from 'react';
import { Row, Col, Button, Tabs, Tab, Accordion, OverlayTrigger, Tooltip, Badge, Modal, Form } from 'react-bootstrap';
import { Users, CheckCircle, Star, UserPlus, Info, Settings } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockDashboardStats, mockRecentLogs } from '../../data/providerData';
import { providerService } from '../../services/providerService';
import './PracticeDashboardPage.css';

/**
 * PracticeDashboardPage — Analytics overview for clinics.
 */
function PracticeDashboardPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Profile Settings Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLat, setProfileLat] = useState('');
  const [profileLng, setProfileLng] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await providerService.updateProfile({
        lat: profileLat ? parseFloat(profileLat) : null,
        lng: profileLng ? parseFloat(profileLng) : null
      });
      alert('Profile updated successfully!');
      setShowProfileModal(false);
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setProfileLoading(false);
    }
  };

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
      actions={
        <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={() => setShowProfileModal(true)}>
          <Settings size={16} /> Edit Profile Settings
        </Button>
      }
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
                    SehaGrid is preparing for the ICD-11 coding update. A sandbox environment will be available next month for staff training. Detailed documentation will be provided via email.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Col>
      </Row>

      {/* Profile Settings Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Form onSubmit={handleUpdateProfile}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-2">
              <Settings size={20} className="text-primary" />
              Edit Profile Settings
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted mb-4">
              Update your clinic's map coordinates so patients can easily locate you.
            </p>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-muted">Latitude</Form.Label>
                  <Form.Control 
                    type="number" step="any"
                    placeholder="e.g. 31.9522"
                    value={profileLat} 
                    onChange={e => setProfileLat(e.target.value)} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-muted">Longitude</Form.Label>
                  <Form.Control 
                    type="number" step="any"
                    placeholder="e.g. 35.9334"
                    value={profileLng} 
                    onChange={e => setProfileLng(e.target.value)} 
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowProfileModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </PageWrapper>
  );
}

export default PracticeDashboardPage;
