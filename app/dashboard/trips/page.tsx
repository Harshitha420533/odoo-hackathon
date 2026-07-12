import { DashboardLayout } from '@/components/dashboard-layout';
import { TripsPage } from '@/components/trips-page';

export default function TripsPageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/trips">
      <TripsPage />
    </DashboardLayout>
  );
}
