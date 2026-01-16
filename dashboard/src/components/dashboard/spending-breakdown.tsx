'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/ynab/client';
import type { SpendingBreakdown as SpendingBreakdownType } from '@/lib/ynab/spending';
import { ShoppingBag, PiggyBank, CreditCard, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendingBreakdownProps {
  data: SpendingBreakdownType;
}

const spendingConfig = {
  living: {
    label: 'Living',
    description: 'Actual spending',
    icon: ShoppingBag,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500',
    barColor: 'bg-green-500',
  },
  fixed: {
    label: 'Fixed',
    description: 'Savings & investments',
    icon: PiggyBank,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500',
    barColor: 'bg-blue-500',
  },
  creditCards: {
    label: 'Credit Cards',
    description: 'Paying off debt',
    icon: CreditCard,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500',
    barColor: 'bg-orange-500',
  },
  other: {
    label: 'Other',
    description: 'Uncategorized',
    icon: HelpCircle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-500',
    barColor: 'bg-gray-500',
  },
} as const;

export function SpendingBreakdown({ data }: SpendingBreakdownProps) {
  const types = ['living', 'fixed', 'creditCards'] as const;

  // Only show "other" if it has spending
  const showOther = data.other.total > 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>
          Where your €{formatCurrency(data.grandTotal).replace('€', '')} went this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className={cn(
          "grid gap-4 mb-6",
          showOther ? "md:grid-cols-4" : "md:grid-cols-3"
        )}>
          {types.map((type) => {
            const config = spendingConfig[type];
            const typeData = data[type];
            const Icon = config.icon;

            return (
              <div
                key={type}
                className="rounded-lg border border-border p-4 bg-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {config.label}
                  </span>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className={cn("text-2xl font-bold", config.color)}>
                  {formatCurrency(typeData.total)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.description}
                </p>
                {typeData.categories.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Top: {typeData.categories[0].name}
                  </p>
                )}
              </div>
            );
          })}

          {showOther && (
            <div className="rounded-lg border border-border p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {spendingConfig.other.label}
                </span>
                <HelpCircle className={cn("h-4 w-4", spendingConfig.other.color)} />
              </div>
              <div className={cn("text-2xl font-bold", spendingConfig.other.color)}>
                {formatCurrency(data.other.total)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {spendingConfig.other.description}
              </p>
            </div>
          )}
        </div>

        {/* Horizontal Bar Chart */}
        <div className="space-y-2">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {types.map((type) => {
              const typeData = data[type];
              const config = spendingConfig[type];
              if (typeData.percentage === 0) return null;

              return (
                <div
                  key={type}
                  className={cn("h-full transition-all", config.barColor)}
                  style={{ width: `${typeData.percentage}%` }}
                  title={`${config.label}: ${typeData.percentage.toFixed(1)}%`}
                />
              );
            })}
            {showOther && data.other.percentage > 0 && (
              <div
                className={cn("h-full transition-all", spendingConfig.other.barColor)}
                style={{ width: `${data.other.percentage}%` }}
                title={`Other: ${data.other.percentage.toFixed(1)}%`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            {types.map((type) => {
              const typeData = data[type];
              const config = spendingConfig[type];
              if (typeData.percentage === 0) return null;

              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", config.barColor)} />
                  <span className="text-muted-foreground">
                    {config.label} {typeData.percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
            {showOther && data.other.percentage > 0 && (
              <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", spendingConfig.other.barColor)} />
                <span className="text-muted-foreground">
                  Other {data.other.percentage.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <strong className="text-foreground">Your actual spending</strong> this month is{' '}
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(data.living.total)}
          </span>
          . The rest is going to savings/investments or paying off credit cards.
        </div>
      </CardContent>
    </Card>
  );
}
