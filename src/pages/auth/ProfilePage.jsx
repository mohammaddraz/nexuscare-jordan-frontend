import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { User, Mail, Lock, Save } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    // Simulate API call
    setTimeout(() => {
      updateUser({
        name: formData.name,
        email: formData.email,
      });
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      
      // Clear passwords
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  if (!currentUser) return null;

  return (
    <PageWrapper
      title="My Profile"
      subtitle="Manage your account details and security preferences."
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="card glass-panel">
            <div className="card-body p-4 p-md-5">
              
              <div className="text-center mb-4">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt="Profile" 
                    className="rounded-circle mb-3 border border-3 border-white shadow-sm profile-page-avatar"
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm profile-page-initials"
                  >
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <h4 className="fw-bold mb-1 profile-page-name">{currentUser.name}</h4>
                <p className="text-muted text-uppercase profile-page-role">
                  Role: {currentUser.role}
                </p>
              </div>

              {saveMessage && (
                <div className="alert alert-success d-flex align-items-center py-2 profile-page-alert">
                  {saveMessage}
                </div>
              )}

              <Form onSubmit={handleSave}>
                <h6 className="fw-bold mb-3 border-bottom pb-2">Personal Information</h6>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted fw-bold profile-page-label">Full Name</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={16} className="text-muted" /></span>
                    <Form.Control 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-start-0"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold profile-page-label">Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-start-0"
                      required
                    />
                  </div>
                </Form.Group>

                <h6 className="fw-bold mb-3 border-bottom pb-2 mt-4">Security</h6>

                <Form.Group className="mb-3">
                  <Form.Label className="text-muted fw-bold profile-page-label">Current Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="border-start-0"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold profile-page-label">New Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                    <Form.Control 
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="border-start-0"
                    />
                  </div>
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSaving}
                    className="d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default ProfilePage;
