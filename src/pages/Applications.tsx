import { Header } from '@/components/layout/Header';
import { ApplicationQueue } from '@/components/applications/ApplicationQueue';

export default function Applications() {
  return (
    <>
      <Header title="Applications" subtitle="Review and manage loan applications" />
      <div className="p-6">
        <ApplicationQueue />
      </div>
    </>
  );
}