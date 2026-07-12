import { DashboardLayout } from '@/components/dashboard-layout';
import { DriversPage } from '@/components/drivers-page';

export default function DriversPageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/drivers">
      <DriversPage />
    </DashboardLayout>
  );
}
