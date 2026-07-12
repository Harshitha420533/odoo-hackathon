import { DashboardLayout } from '@/components/dashboard-layout';
import { ExpensesPage } from '@/components/expenses-page';

export default function ExpensesPageWrapper() {
  return (
    <DashboardLayout activeTab="/dashboard/expenses">
      <ExpensesPage />
    </DashboardLayout>
  );
}
