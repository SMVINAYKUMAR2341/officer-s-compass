import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Timer,
  TrendingUp 
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { mockMetrics } from '@/data/mockApplications';

export function MetricsOverview() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        title="Pending Review"
        value={mockMetrics.pendingReviewCount}
        subtitle="Awaiting decision"
        icon={Clock}
        variant="warning"
        onClick={() => navigate('/applications?status=PENDING_REVIEW')}
      />
      <MetricCard
        title="Approved Today"
        value={mockMetrics.approvedToday}
        subtitle="Applications approved"
        icon={CheckCircle2}
        variant="success"
        trend={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Rejected Today"
        value={mockMetrics.rejectedToday}
        subtitle="Applications rejected"
        icon={XCircle}
        variant="destructive"
      />
      <MetricCard
        title="Avg. Turnaround"
        value={`${mockMetrics.avgTurnaroundHours}h`}
        subtitle="Decision time"
        icon={Timer}
        variant="info"
      />
      <MetricCard
        title="SLA Breaches"
        value={mockMetrics.slaBreachCount}
        subtitle="Need immediate attention"
        icon={AlertTriangle}
        variant={mockMetrics.slaBreachCount > 0 ? 'destructive' : 'success'}
        onClick={() => navigate('/applications?breach=true')}
      />
      <MetricCard
        title="This Week"
        value={mockMetrics.totalApplicationsThisWeek}
        subtitle="Total applications"
        icon={TrendingUp}
        variant="default"
      />
    </div>
  );
}