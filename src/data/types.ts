export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH';
export type LoanPurpose = 'HOME' | 'VEHICLE' | 'BUSINESS' | 'PERSONAL' | 'EDUCATION';
export type ApplicationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
export type AIDecision = 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DocumentType = 'IDENTITY' | 'ADDRESS' | 'BANK_STATEMENT';
export type TransferStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PaymentStatus = 'UPCOMING' | 'PAID' | 'OVERDUE' | 'PARTIAL';

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
  bankAccountMasked?: string;
  ifscCode?: string;
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

export interface EMIPayment {
  id: string;
  applicationId: string;
  emiNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paidAmount?: number;
  lateFee?: number;
  reminderSent?: boolean;
}

export interface FundTransfer {
  id: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  amount: number;
  bankAccount: string;
  ifscCode: string;
  status: TransferStatus;
  initiatedAt: string;
  processedAt?: string;
  batchId?: string;
  failureReason?: string;
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
  fundTransfer?: FundTransfer;
  emiPayments?: EMIPayment[];
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
    | 'FUND_TRANSFER_INITIATED'
    | 'FUND_TRANSFER_COMPLETED'
    | 'PAYMENT_RECEIVED'
    | 'REMINDER_SENT'
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
  pendingTransfers: number;
  overduePayments: number;
  totalDisbursed: number;
}

export interface ApprovalTrend {
  date: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface RiskDistribution {
  riskBand: RiskBand;
  count: number;
  percentage: number;
}

export interface OfficerPerformance {
  officerId: string;
  officerName: string;
  decisionsCount: number;
  avgTurnaroundHours: number;
  approvalRate: number;
  overrideRate: number;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  phone?: string;
  joinedAt: string;
  lastLogin: string;
}