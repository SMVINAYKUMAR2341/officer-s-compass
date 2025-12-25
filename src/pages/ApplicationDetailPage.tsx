import { Header } from '@/components/layout/Header';
import { ApplicationDetail as ApplicationDetailComponent } from '@/components/applications/ApplicationDetail';

export default function ApplicationDetailPage() {
  return (
    <>
      <Header title="Application Details" subtitle="Review application and make decision" />
      <div className="p-6">
        <ApplicationDetailComponent />
      </div>
    </>
  );
}