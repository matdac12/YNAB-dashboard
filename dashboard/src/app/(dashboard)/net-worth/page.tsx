import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAccountsSummary } from '@/lib/ynab/data';
import { NetWorthClient } from './client';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-[130px]" />
        <Skeleton className="h-[130px]" />
        <Skeleton className="h-[130px]" />
      </div>
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[300px]" />
    </div>
  );
}

async function NetWorthData() {
  const accounts = await fetchAccountsSummary();

  // Calculate totals
  const assets = accounts
    .filter(acc => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const liabilities = accounts
    .filter(acc => acc.balance < 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const netWorth = assets + liabilities;

  return (
    <NetWorthClient
      currentAssets={assets}
      currentLiabilities={liabilities}
      currentNetWorth={netWorth}
      accounts={accounts}
    />
  );
}

export default function NetWorthPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Net Worth</h1>
        <p className="text-muted-foreground">
          Track your assets and liabilities over time
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <NetWorthData />
      </Suspense>
    </>
  );
}
