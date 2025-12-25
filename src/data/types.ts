export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH';
export type LoanPurpose = 'HOME' | 'VEHICLE' | 'BUSINESS' | 'PERSONAL' | 'EDUCATION';
export type ApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type AIDecision = 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DocumentType = 'IDENTITY' | 'ADDRESS' | 'BANK_STATEMENT';

export interface CustomerData {
  id: string;
  maskedId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  panNumber: string;
  aadharMasked: string;
  employmentType: 'Salaried' | 'Self-Employed' | 'Business Owner';
  employer: string;
  designation: string;
  monthlyIncome: number;
  yearsOfEmployment: number;
  existingLoans: number;
  existingEMI: number;
}

export interface AIExplanation {
  positiveFactors: Array<{ factor: string; weight: number }>;
  negativeFactors: Array<{ factor: string; weight: number }>;
  summary: string;
}

export interface AIDecisionData {
  approvalProbability: number;
  decision: AIDecision;
  interestRate: number;
  emi: number;
  totalRepayment: number;
  riskBand: RiskBand;
  confidence: number;
  explanation: AIExplanation;
  decidedAt: string;
}

export interface OfficerDecision {
  officerId: string;
  officerName: string;
  decision: 'APPROVED' | 'REJECTED';
  justification: string;
  decidedAt: string;
}

export interface KYCDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  status: KYCStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface LoanApplication {
  id: string;
  customerId: string;
  customerData: CustomerData;
  loanAmount: number;
  loanPurpose: LoanPurpose;
  loanTenureMonths: number;
  status: ApplicationStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: string;
  aiDecision: AIDecisionData;
  officerDecision?: OfficerDecision;
  kycDocuments: KYCDocument[];
  slaBreachAt: string;
  isSlaBreach: boolean;
}

export interface AuditLogEntry {
  id: string;
  applicationId: string;
  officerId: string;
  officerName: string;
  actionType: 
    | 'APPLICATION_VIEWED'
    | 'AI_DECISION_REVIEWED'
    | 'OFFICER_APPROVED'
    | 'OFFICER_REJECTED'
    | 'KYC_VERIFIED'
    | 'KYC_REJECTED'
    | 'LOGIN'
    | 'LOGOUT';
  details: string;
  timestamp: string;
  ipHash?: string;
  deviceSummary?: string;
}

export interface DashboardMetrics {
  pendingReviewCount: number;
  approvedToday: number;
  rejectedToday: number;
  avgTurnaroundHours: number;
  slaBreachCount: number;
  totalApplicationsThisWeek: number;
}