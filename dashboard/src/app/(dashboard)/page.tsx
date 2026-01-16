import { Suspense } from 'react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SpendingBreakdown } from '@/components/dashboard/spending-breakdown';
import { AccountsList } from '@/components/dashboard/accounts-list';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchBudgetSummary,
  fetchSpendingBreakdown,
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
  const [summary, spendingBreakdown, accounts] = await Promise.all([
    fetchBudgetSummary(),
    fetchSpendingBreakdown(),
    fetchAccountsSummary(),
  ]);

  return (
    <>
      <OverviewCards data={summary} />

      <SpendingBreakdown data={spendingBreakdown} />

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
