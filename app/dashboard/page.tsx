import { DashboardLayout } from '@/components/dashboard-layout';
import { PremiumDashboard } from '@/components/premium-dashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout activeTab="/dashboard">
      <PremiumDashboard />
    </DashboardLayout>
  );
}
