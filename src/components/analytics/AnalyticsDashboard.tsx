import { ApprovalTrendsChart } from './ApprovalTrendsChart';
import { RiskDistributionChart } from './RiskDistributionChart';
import { OfficerPerformanceChart } from './OfficerPerformanceChart';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';
import { monthlySummary } from '@/data/mockAnalytics';

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function AnalyticsDashboard() {
  const approvalRate = Math.round((monthlySummary.approved / monthlySummary.totalApplications) * 100);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Applications</p>
                <p className="text-2xl font-bold text-foreground">{monthlySummary.totalApplications}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-chart-2" />
              <span className="text-chart-2">+12%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold text-chart-2">{approvalRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">{monthlySummary.approved} approved, {monthlySummary.rejected} rejected</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(monthlySummary.totalDisbursed)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-chart-2" />
              <span className="text-chart-2">+8%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold text-foreground">{monthlySummary.avgProcessingTime}h</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingDown className="h-3 w-3 text-chart-2" />
              <span className="text-chart-2">-15%</span>
              <span className="text-muted-foreground">faster than target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApprovalTrendsChart />
        <RiskDistributionChart />
      </div>

      <OfficerPerformanceChart />
    </div>
  );
}