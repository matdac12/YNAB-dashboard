import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendsChart } from '@/components/trends/trends-chart';
import { TrendsTable } from '@/components/trends/trends-table';
import { fetchCategoryTrends } from '@/lib/ynab/trends';

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
    </div>
  );
}

async function TrendsContent() {
  const { categories, chartData } = await fetchCategoryTrends(6);

  return (
    <div className="space-y-6">
      <TrendsChart data={chartData} categories={categories} />
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
