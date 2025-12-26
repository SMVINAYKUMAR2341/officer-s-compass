import { ApprovalTrend, RiskDistribution, OfficerPerformance } from './types';

// Generate last 30 days of approval trends
export function generateApprovalTrends(): ApprovalTrend[] {
  const trends: ApprovalTrend[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseApproved = Math.floor(Math.random() * 8) + 5;
    const baseRejected = Math.floor(Math.random() * 4) + 2;
    const basePending = Math.floor(Math.random() * 5) + 3;
    
    // Add some weekly patterns (weekends have fewer)
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;
    
    trends.push({
      date: date.toISOString().split('T')[0],
      approved: Math.round(baseApproved * weekendFactor),
      rejected: Math.round(baseRejected * weekendFactor),
      pending: Math.round(basePending * weekendFactor),
    });
  }
  
  return trends;
}

export const mockApprovalTrends: ApprovalTrend[] = generateApprovalTrends();

export const mockRiskDistribution: RiskDistribution[] = [
  { riskBand: 'LOW', count: 20, percentage: 40 },
  { riskBand: 'MEDIUM', count: 18, percentage: 36 },
  { riskBand: 'HIGH', count: 12, percentage: 24 },
];

export const mockOfficerPerformance: OfficerPerformance[] = [
  {
    officerId: 'OFF001',
    officerName: 'Arvind Kumar',
    decisionsCount: 145,
    avgTurnaroundHours: 4.2,
    approvalRate: 68,
    overrideRate: 12,
  },
  {
    officerId: 'OFF002',
    officerName: 'Priya Sharma',
    decisionsCount: 128,
    avgTurnaroundHours: 3.8,
    approvalRate: 72,
    overrideRate: 8,
  },
  {
    officerId: 'OFF003',
    officerName: 'Rajesh Patel',
    decisionsCount: 112,
    avgTurnaroundHours: 5.1,
    approvalRate: 65,
    overrideRate: 15,
  },
  {
    officerId: 'OFF004',
    officerName: 'Sunita Reddy',
    decisionsCount: 98,
    avgTurnaroundHours: 4.5,
    approvalRate: 70,
    overrideRate: 10,
  },
  {
    officerId: 'OFF005',
    officerName: 'Amit Gupta',
    decisionsCount: 89,
    avgTurnaroundHours: 6.2,
    approvalRate: 62,
    overrideRate: 18,
  },
];

// Weekly trends for the chart
export const weeklyTrends = [
  { week: 'Week 1', approved: 42, rejected: 18, pending: 25 },
  { week: 'Week 2', approved: 48, rejected: 22, pending: 20 },
  { week: 'Week 3', approved: 55, rejected: 15, pending: 30 },
  { week: 'Week 4', approved: 52, rejected: 20, pending: 22 },
];

// Monthly summary
export const monthlySummary = {
  totalApplications: 285,
  approved: 185,
  rejected: 65,
  pending: 35,
  avgProcessingTime: 4.8,
  totalDisbursed: 125000000, // 12.5 Cr
};