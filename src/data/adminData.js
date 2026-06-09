/**
 * Mock data for the Admin Portal
 * Simulates data fetched from the backend for MOH operations.
 */

export const mockComplianceStats = {
  activeInsured: 452100,
  insuredTrend: '+12.4% from last year',
  insuredHistory: [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 410 }, { name: 'Mar', value: 415 },
    { name: 'Apr', value: 430 }, { name: 'May', value: 440 }, { name: 'Jun', value: 452 }
  ],
  totalPhysicians: 3421,
  physiciansTrend: '+45 new this month',
  physiciansHistory: [
    { name: 'Jan', value: 3300 }, { name: 'Feb', value: 3320 }, { name: 'Mar', value: 3350 },
    { name: 'Apr', value: 3380 }, { name: 'May', value: 3400 }, { name: 'Jun', value: 3421 }
  ],
  claimsProcessingTime: '4.2 hours',
  processingTrend: '-1.1 hours from last month',
  processingHistory: [
    { name: 'Jan', value: 6.0 }, { name: 'Feb', value: 5.8 }, { name: 'Mar', value: 5.2 },
    { name: 'Apr', value: 4.8 }, { name: 'May', value: 4.5 }, { name: 'Jun', value: 4.2 }
  ],
  totalClaims: 1250000,
  claimsTrend: 'YTD 2024',
  claimsHistory: [
    { name: 'Jan', value: 200 }, { name: 'Feb', value: 250 }, { name: 'Mar', value: 280 },
    { name: 'Apr', value: 320 }, { name: 'May', value: 360 }, { name: 'Jun', value: 400 }
  ],
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

export const mockAdmins = [
  {
    id: 'ADM-001',
    name: 'Faisal Al-Rifai',
    email: 'faisal.rifai@moh.gov.jo',
    role: 'SUPER_ADMIN',
    status: 'Active',
    lastLogin: '2023-12-04T08:30:00Z'
  },
  {
    id: 'ADM-002',
    name: 'Layla Mahmoud',
    email: 'layla.mahmoud@moh.gov.jo',
    role: 'COMPLIANCE_OFFICER',
    status: 'Active',
    lastLogin: '2023-12-04T09:15:00Z'
  },
  {
    id: 'ADM-003',
    name: 'Omar Tariq',
    email: 'omar.tariq@moh.gov.jo',
    role: 'NETWORK_MANAGER',
    status: 'Inactive',
    lastLogin: '2023-11-20T14:22:00Z'
  }
];
