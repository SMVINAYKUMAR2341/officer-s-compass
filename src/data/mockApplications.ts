import { 
  LoanApplication, 
  AuditLogEntry, 
  DashboardMetrics,
  RiskBand,
  LoanPurpose,
  ApplicationStatus,
  AIDecision,
  KYCStatus
} from './types';

const indianFirstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Anita', 'Suresh', 'Kavita', 
  'Rahul', 'Meena', 'Arun', 'Deepa', 'Sanjay', 'Rekha', 'Vinod', 'Geeta',
  'Manoj', 'Shweta', 'Ashok', 'Pooja', 'Ramesh', 'Neha', 'Prakash', 'Ritu',
  'Sunil', 'Aarti', 'Ravi', 'Seema', 'Ajay', 'Nisha', 'Kiran', 'Lakshmi',
  'Mohan', 'Kamala', 'Gopal', 'Radha', 'Bharat', 'Sita', 'Dev', 'Uma'
];

const indianLastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Shah', 'Reddy',
  'Iyer', 'Nair', 'Rao', 'Desai', 'Joshi', 'Verma', 'Agarwal', 'Malhotra',
  'Kapoor', 'Chopra', 'Sinha', 'Chauhan', 'Pandey', 'Mishra', 'Bose', 'Sen'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal', 'Indore', 'Nagpur'
];

const states = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 
  'Telangana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh'
];

const employers = [
  'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies', 
  'Tech Mahindra', 'Reliance Industries', 'HDFC Bank', 'ICICI Bank',
  'State Bank of India', 'Bharti Airtel', 'ITC Limited', 'Larsen & Toubro',
  'Mahindra & Mahindra', 'Bajaj Auto', 'Maruti Suzuki', 'Self-Employed Business'
];

const designations = [
  'Software Engineer', 'Senior Developer', 'Project Manager', 'Business Analyst',
  'Account Manager', 'Sales Executive', 'Operations Manager', 'Finance Manager',
  'HR Manager', 'Marketing Executive', 'Consultant', 'Director', 'CEO', 'Proprietor'
];

const positiveFactors = [
  { factor: 'High credit score (750+)', weight: 0.25 },
  { factor: 'Stable employment (5+ years)', weight: 0.20 },
  { factor: 'Low debt-to-income ratio', weight: 0.18 },
  { factor: 'No recent defaults', weight: 0.15 },
  { factor: 'High monthly income', weight: 0.12 },
  { factor: 'Existing relationship with bank', weight: 0.10 },
  { factor: 'Property ownership', weight: 0.08 },
  { factor: 'Diversified income sources', weight: 0.06 },
  { factor: 'Good repayment history', weight: 0.14 },
  { factor: 'Adequate collateral', weight: 0.11 },
];

const negativeFactors = [
  { factor: 'High existing EMI burden', weight: -0.22 },
  { factor: 'Recent credit inquiries', weight: -0.15 },
  { factor: 'Short employment tenure', weight: -0.18 },
  { factor: 'Irregular income pattern', weight: -0.12 },
  { factor: 'Previous loan restructuring', weight: -0.20 },
  { factor: 'High loan-to-value ratio', weight: -0.14 },
  { factor: 'Industry risk (volatile sector)', weight: -0.10 },
  { factor: 'Age approaching retirement', weight: -0.08 },
  { factor: 'Limited credit history', weight: -0.16 },
  { factor: 'Self-employed income volatility', weight: -0.11 },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  date.setHours(randomInt(8, 20), randomInt(0, 59), randomInt(0, 59));
  return date.toISOString();
}

function generateMaskedId(index: number): string {
  return `CUST-XXXX-${String(index).padStart(4, '0')}`;
}

function generateApplicationId(index: number): string {
  const year = new Date().getFullYear();
  return `LA${year}${String(index).padStart(6, '0')}`;
}

function generatePAN(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return `${letters[randomInt(0, 25)]}${letters[randomInt(0, 25)]}${letters[randomInt(0, 25)]}${letters[randomInt(0, 25)]}${letters[randomInt(0, 25)]}${randomInt(1000, 9999)}${letters[randomInt(0, 25)]}`;
}

function generateAadharMasked(): string {
  return `XXXX-XXXX-${randomInt(1000, 9999)}`;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateExplanation(riskBand: RiskBand): {
  positiveFactors: Array<{ factor: string; weight: number }>;
  negativeFactors: Array<{ factor: string; weight: number }>;
  summary: string;
} {
  const shuffledPositive = shuffleArray(positiveFactors);
  const shuffledNegative = shuffleArray(negativeFactors);
  
  let numPositive: number;
  let numNegative: number;
  
  if (riskBand === 'LOW') {
    numPositive = randomInt(4, 5);
    numNegative = randomInt(1, 2);
  } else if (riskBand === 'MEDIUM') {
    numPositive = randomInt(2, 3);
    numNegative = randomInt(2, 3);
  } else {
    numPositive = randomInt(1, 2);
    numNegative = randomInt(4, 5);
  }
  
  const selectedPositive = shuffledPositive.slice(0, numPositive);
  const selectedNegative = shuffledNegative.slice(0, numNegative);
  
  const summaries: Record<RiskBand, string[]> = {
    LOW: [
      'Strong application with excellent credit profile and stable income. Low risk of default.',
      'Applicant demonstrates solid financial discipline with minimal existing obligations.',
      'High confidence in repayment capacity based on income stability and credit history.',
    ],
    MEDIUM: [
      'Moderate risk profile with some concerns. Manual review recommended for final decision.',
      'Mixed indicators suggest careful evaluation of income stability and existing debt.',
      'Application shows both positive and concerning factors requiring officer assessment.',
    ],
    HIGH: [
      'High risk application with significant concerns about repayment capacity.',
      'Multiple risk factors identified. Thorough manual review essential before decision.',
      'Elevated default risk due to debt burden and income instability indicators.',
    ],
  };
  
  return {
    positiveFactors: selectedPositive,
    negativeFactors: selectedNegative,
    summary: randomElement(summaries[riskBand]),
  };
}

function generateApplication(index: number): LoanApplication {
  const firstName = randomElement(indianFirstNames);
  const lastName = randomElement(indianLastNames);
  const city = randomElement(cities);
  const stateIndex = cities.indexOf(city) % states.length;
  
  // Distribution: 40% Low, 35% Medium, 25% High
  const riskRoll = Math.random();
  let riskBand: RiskBand;
  let confidence: number;
  let approvalProbability: number;
  let aiDecision: AIDecision;
  let interestRate: number;
  
  if (riskRoll < 0.40) {
    riskBand = 'LOW';
    confidence = randomInt(85, 98) / 100;
    approvalProbability = randomInt(75, 95) / 100;
    aiDecision = Math.random() < 0.9 ? 'APPROVED' : 'PENDING_REVIEW';
    interestRate = randomInt(850, 1050) / 100;
  } else if (riskRoll < 0.75) {
    riskBand = 'MEDIUM';
    confidence = randomInt(60, 84) / 100;
    approvalProbability = randomInt(45, 74) / 100;
    aiDecision = 'PENDING_REVIEW';
    interestRate = randomInt(1100, 1400) / 100;
  } else {
    riskBand = 'HIGH';
    confidence = randomInt(70, 92) / 100;
    approvalProbability = randomInt(15, 44) / 100;
    aiDecision = Math.random() < 0.7 ? 'REJECTED' : 'PENDING_REVIEW';
    interestRate = randomInt(1500, 1850) / 100;
  }
  
  const loanAmount = randomInt(5, 500) * 10000;
  const loanTenureMonths = randomElement([12, 24, 36, 48, 60, 72, 84, 120, 180, 240]);
  const monthlyRate = interestRate / 100 / 12;
  const emi = Math.round(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths) / (Math.pow(1 + monthlyRate, loanTenureMonths) - 1));
  const totalRepayment = emi * loanTenureMonths;
  
  const monthlyIncome = randomInt(30, 500) * 1000;
  
  let status: ApplicationStatus;
  let officerDecision = undefined;
  
  if (aiDecision === 'PENDING_REVIEW') {
    // 60% still pending, 40% decided
    if (Math.random() < 0.6) {
      status = 'PENDING_REVIEW';
    } else {
      status = Math.random() < 0.5 ? 'APPROVED' : 'REJECTED';
      officerDecision = {
        officerId: 'OFF001',
        officerName: 'Arvind Kumar',
        decision: status as 'APPROVED' | 'REJECTED',
        justification: status === 'APPROVED' 
          ? 'After careful review of the application and supporting documents, the applicant demonstrates adequate repayment capacity despite the AI flagged concerns. Income verification and employer confirmation support approval.'
          : 'Upon detailed analysis, the risk factors outweigh the positive indicators. The high existing debt burden and unstable income pattern suggest significant default risk. Recommend rejection.',
        decidedAt: randomDate(2),
      };
    }
  } else {
    status = aiDecision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
  }
  
  const submittedAt = randomDate(14);
  const slaBreachAt = new Date(new Date(submittedAt).getTime() + 48 * 60 * 60 * 1000).toISOString();
  const isSlaBreach = status === 'PENDING_REVIEW' && new Date(slaBreachAt) < new Date();
  
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  if (isSlaBreach) {
    priority = 'URGENT';
  } else if (riskBand === 'HIGH') {
    priority = 'HIGH';
  } else if (riskBand === 'MEDIUM') {
    priority = 'MEDIUM';
  } else {
    priority = 'LOW';
  }
  
  const kycStatus: KYCStatus = status === 'APPROVED' ? (Math.random() < 0.7 ? 'VERIFIED' : 'PENDING') : 'PENDING';
  
  return {
    id: generateApplicationId(index + 1),
    customerId: `CUST${String(index + 1).padStart(6, '0')}`,
    customerData: {
      id: `CUST${String(index + 1).padStart(6, '0')}`,
      maskedId: generateMaskedId(index + 1),
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+91 ${randomInt(70, 99)}${randomInt(10, 99)}${randomInt(10, 99)}${randomInt(1000, 9999)}`,
      dateOfBirth: `${randomInt(1965, 1998)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      gender: randomElement(['Male', 'Female', 'Other']),
      address: `${randomInt(1, 999)}, ${randomElement(['MG Road', 'Gandhi Nagar', 'Nehru Street', 'Patel Colony', 'Rajaji Road', 'Anna Nagar'])}`,
      city,
      state: states[stateIndex],
      pincode: String(randomInt(100000, 999999)),
      panNumber: generatePAN(),
      aadharMasked: generateAadharMasked(),
      employmentType: randomElement(['Salaried', 'Self-Employed', 'Business Owner']),
      employer: randomElement(employers),
      designation: randomElement(designations),
      monthlyIncome,
      yearsOfEmployment: randomInt(1, 25),
      existingLoans: randomInt(0, 3),
      existingEMI: randomInt(0, 5) * 5000,
    },
    loanAmount,
    loanPurpose: randomElement(['HOME', 'VEHICLE', 'BUSINESS', 'PERSONAL', 'EDUCATION'] as LoanPurpose[]),
    loanTenureMonths,
    status,
    priority,
    submittedAt,
    aiDecision: {
      approvalProbability,
      decision: aiDecision,
      interestRate,
      emi,
      totalRepayment,
      riskBand,
      confidence,
      explanation: generateExplanation(riskBand),
      decidedAt: new Date(new Date(submittedAt).getTime() + randomInt(1, 30) * 60 * 1000).toISOString(),
    },
    officerDecision,
    kycDocuments: [
      {
        id: `DOC${index}001`,
        type: 'IDENTITY',
        fileName: 'pan_card.pdf',
        uploadedAt: submittedAt,
        status: kycStatus,
        verifiedBy: kycStatus === 'VERIFIED' ? 'OFF001' : undefined,
        verifiedAt: kycStatus === 'VERIFIED' ? randomDate(3) : undefined,
      },
      {
        id: `DOC${index}002`,
        type: 'ADDRESS',
        fileName: 'aadhar_card.pdf',
        uploadedAt: submittedAt,
        status: kycStatus,
        verifiedBy: kycStatus === 'VERIFIED' ? 'OFF001' : undefined,
        verifiedAt: kycStatus === 'VERIFIED' ? randomDate(3) : undefined,
      },
      {
        id: `DOC${index}003`,
        type: 'BANK_STATEMENT',
        fileName: 'bank_statement_6months.pdf',
        uploadedAt: submittedAt,
        status: kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        verifiedBy: kycStatus === 'VERIFIED' ? 'OFF001' : undefined,
        verifiedAt: kycStatus === 'VERIFIED' ? randomDate(3) : undefined,
      },
    ],
    slaBreachAt,
    isSlaBreach,
  };
}

function generateAuditLogs(applications: LoanApplication[]): AuditLogEntry[] {
  const logs: AuditLogEntry[] = [];
  let logId = 1;
  
  applications.forEach(app => {
    // Application viewed
    logs.push({
      id: `LOG${String(logId++).padStart(6, '0')}`,
      applicationId: app.id,
      officerId: 'OFF001',
      officerName: 'Arvind Kumar',
      actionType: 'APPLICATION_VIEWED',
      details: `Application ${app.id} opened for review`,
      timestamp: new Date(new Date(app.submittedAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      deviceSummary: 'Chrome 120, Windows 11',
    });
    
    // AI decision reviewed
    logs.push({
      id: `LOG${String(logId++).padStart(6, '0')}`,
      applicationId: app.id,
      officerId: 'OFF001',
      officerName: 'Arvind Kumar',
      actionType: 'AI_DECISION_REVIEWED',
      details: `AI decision reviewed: ${app.aiDecision.decision} with ${Math.round(app.aiDecision.confidence * 100)}% confidence`,
      timestamp: new Date(new Date(app.submittedAt).getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
      deviceSummary: 'Chrome 120, Windows 11',
    });
    
    // Officer decision if exists
    if (app.officerDecision) {
      logs.push({
        id: `LOG${String(logId++).padStart(6, '0')}`,
        applicationId: app.id,
        officerId: app.officerDecision.officerId,
        officerName: app.officerDecision.officerName,
        actionType: app.officerDecision.decision === 'APPROVED' ? 'OFFICER_APPROVED' : 'OFFICER_REJECTED',
        details: `Application ${app.officerDecision.decision.toLowerCase()} by officer. Justification: ${app.officerDecision.justification.substring(0, 100)}...`,
        timestamp: app.officerDecision.decidedAt,
        deviceSummary: 'Chrome 120, Windows 11',
      });
    }
    
    // KYC verification if done
    app.kycDocuments.forEach(doc => {
      if (doc.status === 'VERIFIED' && doc.verifiedAt) {
        logs.push({
          id: `LOG${String(logId++).padStart(6, '0')}`,
          applicationId: app.id,
          officerId: doc.verifiedBy || 'OFF001',
          officerName: 'Arvind Kumar',
          actionType: 'KYC_VERIFIED',
          details: `${doc.type} document verified: ${doc.fileName}`,
          timestamp: doc.verifiedAt,
          deviceSummary: 'Chrome 120, Windows 11',
        });
      }
    });
  });
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Generate 50 applications
export const mockApplications: LoanApplication[] = Array.from({ length: 50 }, (_, i) => generateApplication(i));

export const mockAuditLogs: AuditLogEntry[] = generateAuditLogs(mockApplications);

export const mockMetrics: DashboardMetrics = {
  pendingReviewCount: mockApplications.filter(a => a.status === 'PENDING_REVIEW').length,
  approvedToday: mockApplications.filter(a => {
    const today = new Date().toDateString();
    return a.status === 'APPROVED' && new Date(a.officerDecision?.decidedAt || a.aiDecision.decidedAt).toDateString() === today;
  }).length || 3,
  rejectedToday: mockApplications.filter(a => {
    const today = new Date().toDateString();
    return a.status === 'REJECTED' && new Date(a.officerDecision?.decidedAt || a.aiDecision.decidedAt).toDateString() === today;
  }).length || 2,
  avgTurnaroundHours: 18.5,
  slaBreachCount: mockApplications.filter(a => a.isSlaBreach).length,
  totalApplicationsThisWeek: mockApplications.filter(a => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.submittedAt) >= weekAgo;
  }).length,
  pendingTransfers: 8,
  overduePayments: 5,
  totalDisbursed: 125000000,
};

export const currentOfficer = {
  id: 'OFF001',
  name: 'Arvind Kumar',
  email: 'arvind.kumar@bank.com',
  role: 'Senior Loan Officer',
  department: 'Retail Lending',
};