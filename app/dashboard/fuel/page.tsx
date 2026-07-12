import { DashboardLayout } from '@/components/dashboard-layout';
import { FuelPage } from '@/components/fuel-page';

export default function FuelPageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/fuel">
      <FuelPage />
    </DashboardLayout>
  );
}
