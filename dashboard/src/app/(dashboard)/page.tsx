import { Suspense } from 'react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown';
import { AccountsList } from '@/components/dashboard/accounts-list';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchBudgetSummary,
  fetchMonthlySpending,
  fetchSpendingByCategory,
  fetchAccountsSummary,
} from '@/lib/ynab/data';

function LoadingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[120px]" />
      ))}
    </div>
  );
}

async function DashboardContent() {
  const [summary, monthlySpending, categorySpending, accounts] = await Promise.all([
    fetchBudgetSummary(),
    fetchMonthlySpending(6),
    fetchSpendingByCategory(),
    fetchAccountsSummary(),
  ]);

  return (
    <>
      <OverviewCards data={summary} />

      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <SpendingChart data={monthlySpending} />
        <CategoryBreakdown data={categorySpending} />
      </div>

      <div className="mt-6">
        <AccountsList accounts={accounts} />
      </div>
    </>
  );
}

export default function OverviewPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Your budget analytics at a glance
        </p>
      </div>

      <Suspense fallback={<LoadingCards />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
