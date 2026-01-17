import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendsChart } from '@/components/trends/trends-chart';
import { TrendsTable } from '@/components/trends/trends-table';
import { fetchCategoryTrends, fetchSpendingTypeTrends } from '@/lib/ynab/trends';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
    </div>
  );
}

async function TrendsContent() {
  const [{ categories }, { chartData: typeChartData }] = await Promise.all([
    fetchCategoryTrends(6),
    fetchSpendingTypeTrends(6),
  ]);

  return (
    <div className="space-y-6">
      <TrendsChart data={typeChartData} />
      <TrendsTable categories={categories} />
    </div>
  );
}

export default function TrendsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Spending Trends</h1>
        <p className="text-muted-foreground">
          Analyze your spending patterns over time
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <TrendsContent />
      </Suspense>
    </>
  );
}
