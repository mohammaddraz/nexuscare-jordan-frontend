import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { FileText, Download, Calendar, Activity, Pill } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { consumerService } from '../../services/consumerService';
import './MedicalRecordsPage.css';

/**
 * MedicalRecordsPage — Review historical diagnoses and prescriptions.
 */
function MedicalRecordsPage() {
  const [selectedDependent, setSelectedDependent] = useState('All');
  const [dependents, setDependents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const family = await consumerService.getFamily();
      setDependents(family);

      // Fetch records for all family members initially
      let allRecords = [];
      for (const member of family) {
        try {
          const res = await consumerService.getMedicalRecords(member.id);
          const mapped = res.map(r => ({
            id: r.id,
            dependentId: member.id,
            date: new Date(r.record_date).toLocaleDateString(),
            diagnosis: r.diagnosis,
            icdCode: r.icd_code,
            notes: r.notes || '',
            prescription: r.prescription || 'None',
            providerName: r.provider_name
          }));
          allRecords = [...allRecords, ...mapped];
        } catch (e) {
          console.error(`Failed to fetch records for ${member.name}`);
        }
      }
      setRecords(allRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = selectedDependent === 'All' 
    ? records 
    : records.filter(r => String(r.dependentId) === String(selectedDependent));

  const getDependentName = (id) => dependents.find(d => String(d.id) === String(id))?.name || 'Unknown';

  return (
    <PageWrapper
      title="Medical Records"
      subtitle="Review historical diagnoses, check active electronic prescriptions, and download clinic treatment checklists."
    >
      <div className="card glass-panel mb-4">
        <div className="card-body p-4 d-flex flex-column flex-md-row gap-3">
          <Form.Group className="flex-grow-1">
            <Form.Label>Filter by Family Member</Form.Label>
            <Form.Select value={selectedDependent} onChange={e => setSelectedDependent(e.target.value)}>
              <option value="All">All Family Members</option>
              {dependents.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <Form.Label>Date Range</Form.Label>
            <Form.Select>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="all">All Time</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex align-items-end">
            <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
              <Download size={16} /> Export All (PDF)
            </Button>
          </div>
        </div>
      </div>

      <Row className="g-4">
        {loading && (
          <Col xs={12}>
            <div className="text-center py-5 text-muted">
              Loading...
            </div>
          </Col>
        )}
        {!loading && filteredRecords.map(record => (
          <Col md={6} key={record.id}>
            <div className="card glass-panel-hover h-100 animate-fadeInUp">
              <div className="card-header bg-transparent border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={16} color="var(--color-text-muted)" />
                  <span className="fw-bold text-muted records-date">{record.date}</span>
                </div>
                <span className="badge bg-light text-dark border">{record.id}</span>
              </div>
              <div className="card-body p-4">
                <p className="mb-1 text-muted records-patient-label">Patient</p>
                <h6 className="fw-bold mb-3">{getDependentName(record.dependentId)}</h6>
                
                <div className="p-3 bg-light rounded-3 mb-3 border d-flex gap-3">
                  <div className="pt-1"><Activity size={18} color="var(--color-brand-secondary)" /></div>
                  <div>
                    <p className="mb-0 fw-bold records-diagnosis-text">{record.diagnosis}</p>
                    <p className="mb-0 text-muted font-mono records-icd-code">ICD-10: {record.icdCode}</p>
                    <p className="mt-2 mb-0 records-notes">{record.notes}</p>
                  </div>
                </div>

                <div className="p-3 rounded-3 border d-flex gap-3 records-prescription-box">
                  <div className="pt-1"><Pill size={18} color="var(--color-success)" /></div>
                  <div>
                    <p className="mb-0 fw-bold records-prescription-title">Electronic Prescription</p>
                    <p className="mb-0 text-success records-prescription-text">{record.prescription}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top px-4 py-3 d-flex justify-content-between align-items-center">
                <p className="mb-0 text-muted records-provider-name">Provider: <strong>{record.providerName}</strong></p>
                <Button variant="link" className="p-0 text-decoration-none records-download-link">
                  Download Full Report
                </Button>
              </div>
            </div>
          </Col>
        ))}
        {!loading && filteredRecords.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5 text-muted">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>No medical records found for the selected criteria.</p>
            </div>
          </Col>
        )}
      </Row>
    </PageWrapper>
  );
}

export default MedicalRecordsPage;
