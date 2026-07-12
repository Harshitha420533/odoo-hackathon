import { DashboardLayout } from '@/components/dashboard-layout';
import { MaintenancePage } from '@/components/maintenance-page';

export default function MaintenancePageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/maintenance">
      <MaintenancePage />
    </DashboardLayout>
  );
}
