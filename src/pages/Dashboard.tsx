import { Header } from '@/components/layout/Header';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  return (
    <>
      <Header title="Dashboard" subtitle="Bank Officer Overview" />
      <div className="p-6 space-y-6">
        <MetricsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <QuickActions />
        </div>
      </div>
    </>
  );
}