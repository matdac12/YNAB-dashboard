'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/ynab/client';
import { Landmark, CreditCard, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  assets: number;
  liabilities: number;
  netWorth: number;
}

export function SummaryCards({ assets, liabilities, netWorth }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Net Worth Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <Landmark className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'text-2xl font-bold',
              netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {formatCurrency(netWorth)}
          </div>
          <p className="text-xs text-muted-foreground">Assets minus liabilities</p>
        </CardContent>
      </Card>

      {/* Assets Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <PiggyBank className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(assets)}
          </div>
          <p className="text-xs text-muted-foreground">Cash, savings & investments</p>
        </CardContent>
      </Card>

      {/* Liabilities Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          <CreditCard className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(Math.abs(liabilities))}
          </div>
          <p className="text-xs text-muted-foreground">Credit cards, loans & debts</p>
        </CardContent>
      </Card>
    </div>
  );
}
