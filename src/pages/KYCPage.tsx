import { Header } from '@/components/layout/Header';
import { KYCVerification as KYCVerificationComponent } from '@/components/kyc/KYCVerification';

export default function KYCPage() {
  return (
    <>
      <Header title="KYC Verification" subtitle="Verify customer documents" />
      <div className="p-6">
        <KYCVerificationComponent />
      </div>
    </>
  );
}