import { Header } from '@/components/layout/Header';
import { AdminProfile } from '@/components/profile/AdminProfile';

export default function ProfilePage() {
  return (
    <>
      <Header title="Admin Profile" subtitle="Manage your account settings" />
      <div className="p-6">
        <AdminProfile />
      </div>
    </>
  );
}