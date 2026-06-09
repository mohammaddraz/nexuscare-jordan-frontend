/**
 * Mock data for the Admin Portal
 * Simulates data fetched from the backend for MOH operations.
 */

export const mockComplianceStats = {
  activeInsured: 452100,
  insuredTrend: '+12.4% from last year',
  totalPhysicians: 3421,
  physiciansTrend: '+45 new this month',
  claimsProcessingTime: '4.2 hours',
  processingTrend: '-1.1 hours from last month',
  totalClaims: 1245000,
  claimsTrend: 'YTD 2024',
};

export const mockRegionalData = [
  { region: 'Amman Governorate', coverage: 78, clinics: 450, status: 'Optimal' },
  { region: 'Irbid Governorate', coverage: 65, clinics: 210, status: 'Good' },
  { region: 'Zarqa Governorate', coverage: 58, clinics: 180, status: 'Needs Improvement' },
  { region: 'Aqaba Governorate', coverage: 82, clinics: 95, status: 'Optimal' },
];

export const mockPendingCertifications = [
  {
    id: 'CERT-001',
    doctorName: 'Dr. Zaid Al-Masri',
    specialty: 'Orthopedics',
    licenseNumber: 'JOR-MD-88124',
    clinicName: 'Istishari Hospital',
    dateSubmitted: '2023-12-01',
    status: 'Pending Review',
  },
  {
    id: 'CERT-002',
    doctorName: 'Dr. Laila Hassan',
    specialty: 'Dermatology',
    licenseNumber: 'JOR-MD-99211',
    clinicName: 'Amman Skin Clinic',
    dateSubmitted: '2023-12-02',
    status: 'Pending Review',
  },
  {
    id: 'CERT-003',
    doctorName: 'Dr. Faisal Qassim',
    specialty: 'Neurology',
    licenseNumber: 'JOR-MD-77112',
    clinicName: 'Jordan University Hospital',
    dateSubmitted: '2023-12-03',
    status: 'Flagged',
  }
];
