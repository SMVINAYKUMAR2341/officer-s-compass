import { Header } from '@/components/layout/Header';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <>
      <Header title="Analytics" subtitle="Performance metrics and trends" />
      <div className="p-6">
        <AnalyticsDashboard />
      </div>
    </>
  );
}