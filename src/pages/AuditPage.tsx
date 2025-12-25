import { Header } from '@/components/layout/Header';
import { AuditLog as AuditLogComponent } from '@/components/audit/AuditLog';

export default function AuditPage() {
  return (
    <>
      <Header title="Audit Log" subtitle="Immutable record of all actions" />
      <div className="p-6">
        <AuditLogComponent />
      </div>
    </>
  );
}