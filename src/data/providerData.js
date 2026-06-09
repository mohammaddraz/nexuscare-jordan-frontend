/**
 * Mock data for the Provider Portal
 * Simulates data fetched from the backend for clinics and doctors.
 */

export const mockDashboardStats = {
  totalVisits: 1248,
  visitsTrend: '+12% from last month',
  visitsHistory: [
    { name: 'Mon', value: 30 }, { name: 'Tue', value: 45 }, { name: 'Wed', value: 38 },
    { name: 'Thu', value: 50 }, { name: 'Fri', value: 65 }, { name: 'Sat', value: 40 }
  ],
  claimsSuccessRate: 94.2,
  claimsTrend: '+2.1% from last month',
  claimsHistory: [
    { name: 'Jan', value: 90.0 }, { name: 'Feb', value: 91.5 }, { name: 'Mar', value: 91.0 },
    { name: 'Apr', value: 93.5 }, { name: 'May', value: 92.1 }, { name: 'Jun', value: 94.2 }
  ],
  averageRating: 4.8,
  ratingTrend: 'Based on 432 reviews',
  ratingHistory: [
    { name: 'Q1', value: 4.5 }, { name: 'Q2', value: 4.6 }, { name: 'Q3', value: 4.8 },
    { name: 'Q4', value: 4.7 }, { name: 'Q1', value: 4.9 }, { name: 'Q2', value: 4.8 }
  ],
  pendingEnrollments: 14,
  pendingTrend: '5 require immediate attention',
  pendingHistory: [
    { name: 'W1', value: 8 }, { name: 'W2', value: 10 }, { name: 'W3', value: 12 },
    { name: 'W4', value: 15 }, { name: 'W5', value: 13 }, { name: 'W6', value: 14 }
  ],
};

export const mockPendingEnrollments = [
  {
    id: 'ENR-8091',
    patientName: 'Rania Al-Amiri',
    nationalId: '9852045566',
    dateRequested: '2023-11-20',
    planType: 'Platinum Care JOR',
    status: 'Pending',
  },
  {
    id: 'ENR-8092',
    patientName: 'Kareem Nabulsi',
    nationalId: '1990234451',
    dateRequested: '2023-11-21',
    planType: 'Gold Shield JOR',
    status: 'Pending',
  },
  {
    id: 'ENR-8093',
    patientName: 'Layla Mahmoud',
    nationalId: '2005011122',
    dateRequested: '2023-11-22',
    planType: 'MOH Basic',
    status: 'Pending',
  }
];

export const mockRecentLogs = [
  {
    id: 'LOG-3301',
    patientName: 'Ahmed Al-Amiri',
    date: '2023-11-22',
    diagnosis: 'Hypertension follow-up',
    icdCode: 'I10',
    billingCode: '99213 (Level 3 Visit)',
    claimStatus: 'Paid',
  },
  {
    id: 'LOG-3302',
    patientName: 'Omar Al-Amiri',
    date: '2023-11-22',
    diagnosis: 'Acute Bronchitis',
    icdCode: 'J20.9',
    billingCode: '99214 (Level 4 Visit)',
    claimStatus: 'Pending',
  }
];

// For the Sandbox Eligibility Checker
export const mockNationalDb = {
  '9821034455': {
    name: 'Ahmed Al-Amiri',
    status: 'Active',
    plan: 'Platinum Care JOR',
    network: 'In-Network (100% Coverage)',
    copay: '0.00 JOD',
  },
  '1990234451': {
    name: 'Kareem Nabulsi',
    status: 'Active',
    plan: 'Gold Shield JOR',
    network: 'In-Network (80% Coverage)',
    copay: '15.00 JOD',
  },
  '9999999999': {
    name: 'Unknown User',
    status: 'Inactive',
    plan: 'Expired/None',
    network: 'Out-of-Network',
    copay: 'N/A',
  }
};
