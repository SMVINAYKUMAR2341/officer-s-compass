import { EMIPayment, FundTransfer, TransferStatus, PaymentStatus } from './types';
import { mockApplications } from './mockApplications';

// Generate EMI payments for approved loans
export function generateEMIPayments(): EMIPayment[] {
  const payments: EMIPayment[] = [];
  let paymentId = 1;
  
  const approvedLoans = mockApplications.filter(app => app.status === 'APPROVED');
  
  approvedLoans.forEach(app => {
    const emi = app.aiDecision.emi;
    const tenure = app.loanTenureMonths;
    const startDate = new Date(app.officerDecision?.decidedAt || app.aiDecision.decidedAt);
    
    // Generate first 6 EMIs for each loan
    const emisToGenerate = Math.min(6, tenure);
    
    for (let i = 0; i < emisToGenerate; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      dueDate.setDate(5); // EMI due on 5th of each month
      
      const today = new Date();
      let status: PaymentStatus;
      let paidDate: string | undefined;
      let paidAmount: number | undefined;
      let lateFee: number | undefined;
      
      if (dueDate < today) {
        // Past due date
        const isPaid = Math.random() > 0.15; // 85% payment rate
        if (isPaid) {
          status = 'PAID';
          paidDate = new Date(dueDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString();
          paidAmount = emi;
          
          // 10% chance of late payment
          if (Math.random() < 0.1) {
            lateFee = Math.round(emi * 0.02);
            paidAmount = emi + lateFee;
          }
        } else {
          status = 'OVERDUE';
          lateFee = Math.round(emi * 0.02 * Math.ceil((today.getTime() - dueDate.getTime()) / (30 * 24 * 60 * 60 * 1000)));
        }
      } else if (dueDate.toDateString() === today.toDateString()) {
        status = 'UPCOMING';
      } else {
        status = 'UPCOMING';
      }
      
      payments.push({
        id: `EMI${String(paymentId++).padStart(6, '0')}`,
        applicationId: app.id,
        emiNumber: i + 1,
        amount: emi,
        dueDate: dueDate.toISOString(),
        paidDate,
        status,
        paidAmount,
        lateFee,
        reminderSent: status === 'UPCOMING' && dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000,
      });
    }
  });
  
  return payments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

// Generate fund transfers for approved loans
export function generateFundTransfers(): FundTransfer[] {
  const transfers: FundTransfer[] = [];
  let transferId = 1;
  
  const approvedLoans = mockApplications.filter(app => app.status === 'APPROVED');
  
  approvedLoans.forEach(app => {
    const statuses: TransferStatus[] = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'PENDING', 'PROCESSING'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const initiatedAt = new Date(app.officerDecision?.decidedAt || app.aiDecision.decidedAt);
    initiatedAt.setHours(initiatedAt.getHours() + 2);
    
    let processedAt: string | undefined;
    let batchId: string | undefined;
    
    if (status === 'COMPLETED') {
      processedAt = new Date(initiatedAt.getTime() + 24 * 60 * 60 * 1000).toISOString();
      batchId = `BATCH${String(Math.floor(transferId / 10) + 1).padStart(4, '0')}`;
    } else if (status === 'PROCESSING') {
      batchId = `BATCH${String(Math.floor(transferId / 10) + 1).padStart(4, '0')}`;
    }
    
    transfers.push({
      id: `TRF${String(transferId++).padStart(6, '0')}`,
      applicationId: app.id,
      customerId: app.customerId,
      customerName: app.customerData.fullName,
      amount: app.loanAmount,
      bankAccount: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      ifscCode: `HDFC0${String(Math.floor(100000 + Math.random() * 900000))}`,
      status,
      initiatedAt: initiatedAt.toISOString(),
      processedAt,
      batchId,
    });
  });
  
  return transfers;
}

export const mockEMIPayments = generateEMIPayments();
export const mockFundTransfers = generateFundTransfers();

// Pending transfers for batch processing
export const pendingTransfers = mockFundTransfers.filter(t => t.status === 'PENDING');
export const processingTransfers = mockFundTransfers.filter(t => t.status === 'PROCESSING');
export const completedTransfers = mockFundTransfers.filter(t => t.status === 'COMPLETED');

// Payment statistics
export const paymentStats = {
  totalCollected: mockEMIPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.paidAmount || 0), 0),
  overdueAmount: mockEMIPayments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0),
  upcomingAmount: mockEMIPayments.filter(p => p.status === 'UPCOMING').reduce((sum, p) => sum + p.amount, 0),
  overdueCount: mockEMIPayments.filter(p => p.status === 'OVERDUE').length,
  paidCount: mockEMIPayments.filter(p => p.status === 'PAID').length,
  upcomingCount: mockEMIPayments.filter(p => p.status === 'UPCOMING').length,
};