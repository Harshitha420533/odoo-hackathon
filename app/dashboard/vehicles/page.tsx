import { DashboardLayout } from '@/components/dashboard-layout';
import { VehiclesPage } from '@/components/vehicles-page';

export default function VehiclesPageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/vehicles">
      <VehiclesPage />
    </DashboardLayout>
  );
}
