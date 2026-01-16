'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, milliunitsToAmount } from '@/lib/ynab/client';
import { TrendingUp, TrendingDown, Minus, Landmark, CreditCard, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  assets: number;
  liabilities: number;
  netWorth: number;
  previousNetWorth?: number;
}

export function SummaryCards({ assets, liabilities, netWorth, previousNetWorth }: SummaryCardsProps) {
  const change = previousNetWorth !== undefined ? netWorth - previousNetWorth : 0;
  const changePercentage = previousNetWorth && previousNetWorth !== 0
    ? (change / Math.abs(previousNetWorth)) * 100
    : 0;

  const isPositiveChange = change > 0;
  const isNegativeChange = change < 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Net Worth Card - Main focus */}
      <Card className="md:col-span-3 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <Landmark className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={cn(
            "text-3xl font-bold",
            netWorth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {formatCurrency(netWorth)}
          </div>
          {previousNetWorth !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : isNegativeChange ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(
                "text-sm",
                isPositiveChange && "text-green-600",
                isNegativeChange && "text-red-600",
                !isPositiveChange && !isNegativeChange && "text-muted-foreground"
              )}>
                {isPositiveChange ? '+' : ''}{formatCurrency(change)}
                <span className="text-muted-foreground ml-1">
                  ({changePercentage >= 0 ? '+' : ''}{changePercentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          )}
          {previousNetWorth === undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Changes will show after next visit
            </p>
          )}
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
          <p className="text-xs text-muted-foreground">
            Cash, savings & investments
          </p>
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
          <p className="text-xs text-muted-foreground">
            Credit cards, loans & debts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
