import { Header } from '@/components/layout/Header';
import { FundTransferList } from '@/components/transfers/FundTransferList';

export default function TransfersPage() {
  return (
    <>
      <Header title="Fund Transfers" subtitle="Batch processing and transfer management" />
      <div className="p-6">
        <FundTransferList />
      </div>
    </>
  );
}