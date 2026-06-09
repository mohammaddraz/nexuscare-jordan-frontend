/**
 * Mock data for the Consumer Portal
 * Represents the shape of data that will eventually come from the PostgreSQL backend via Axios.
 */

export const mockDependents = [
  {
    id: 'DEP-001',
    name: 'Ahmed Al-Amiri',
    relation: 'Primary',
    dob: '1982-05-14',
    nationalId: '9821034455',
    planType: 'Platinum Care JOR',
    pcpId: 'PROV-001', // ID of assigned doctor
    pcpName: 'Dr. Reem Al-Khalidi',
    pcpStatus: 'Approved',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    coverageLimit: 50000,
    usedCoverage: 1250,
  },
  {
    id: 'DEP-002',
    name: 'Rania Al-Amiri',
    relation: 'Spouse',
    dob: '1985-08-22',
    nationalId: '9852045566',
    planType: 'Platinum Care JOR',
    pcpId: 'PROV-002',
    pcpName: 'Dr. Tariq Haddad',
    pcpStatus: 'Pending',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    coverageLimit: 50000,
    usedCoverage: 0,
  },
  {
    id: 'DEP-003',
    name: 'Omar Al-Amiri',
    relation: 'Child',
    dob: '2012-03-10',
    nationalId: '2012012233',
    planType: 'Gold Shield JOR',
    pcpId: null,
    pcpName: null,
    pcpStatus: null,
    avatarUrl: null,
    coverageLimit: 25000,
    usedCoverage: 450,
  }
];

export const mockProviders = [
  {
    id: 'PROV-001',
    name: 'Dr. Reem Al-Khalidi',
    specialty: 'Cardiology',
    clinic: 'Al-Khalidi Medical Plaza',
    city: 'Amman',
    rating: 4.8,
    acceptingNew: true,
  },
  {
    id: 'PROV-002',
    name: 'Dr. Tariq Haddad',
    specialty: 'General Practice',
    clinic: 'Istiklal Hospital',
    city: 'Amman',
    rating: 4.5,
    acceptingNew: true,
  },
  {
    id: 'PROV-003',
    name: 'Dr. Salma Nasser',
    specialty: 'Pediatrics',
    clinic: 'Irbid Specialist Center',
    city: 'Irbid',
    rating: 4.9,
    acceptingNew: false,
  }
];

export const mockMedicalRecords = [
  {
    id: 'REC-1001',
    dependentId: 'DEP-001',
    date: '2023-10-15',
    providerName: 'Dr. Reem Al-Khalidi',
    diagnosis: 'Essential (primary) hypertension',
    icdCode: 'I10',
    prescription: 'Amlodipine 5mg daily',
    notes: 'Blood pressure slightly elevated. Monitor diet and sodium intake.',
  },
  {
    id: 'REC-1002',
    dependentId: 'DEP-003',
    date: '2023-11-02',
    providerName: 'Dr. Salma Nasser',
    diagnosis: 'Acute upper respiratory infection',
    icdCode: 'J06.9',
    prescription: 'Amoxicillin 250mg 3x daily for 5 days',
    notes: 'Child presented with fever and cough. Prescribed antibiotics.',
  }
];

export const mockClaims = [
  {
    id: 'CLM-2023-0881',
    dependentName: 'Ahmed Al-Amiri',
    date: '2023-10-15',
    type: 'Outpatient Consultation',
    providerName: 'Al-Khalidi Medical Plaza',
    amount: 50.00,
    status: 'Paid',
    deductibleApplied: 10.00,
  },
  {
    id: 'CLM-2023-0942',
    dependentName: 'Omar Al-Amiri',
    date: '2023-11-02',
    type: 'Pharmacy Prescription',
    providerName: 'Pharmacy One',
    amount: 15.50,
    status: 'Pending',
    deductibleApplied: 0.00,
  },
  {
    id: 'CLM-2023-0995',
    dependentName: 'Rania Al-Amiri',
    date: '2023-11-18',
    type: 'Laboratory Tests',
    providerName: 'Biolab',
    amount: 120.00,
    status: 'In Review',
    deductibleApplied: 24.00,
  }
];
