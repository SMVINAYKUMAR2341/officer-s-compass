import { Header } from '@/components/layout/Header';
import { PaymentTracker } from '@/components/payments/PaymentTracker';

export default function PaymentsPage() {
  return (
    <>
      <Header title="Payment Tracking" subtitle="EMI schedules and payment history" />
      <div className="p-6">
        <PaymentTracker />
      </div>
    </>
  );
}