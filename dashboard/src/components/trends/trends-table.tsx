'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryTrendData } from '@/lib/ynab/trends';

interface TrendsTableProps {
  categories: CategoryTrendData[];
}

export function TrendsTable({ categories }: TrendsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend < -5) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendBadge = (trend: number) => {
    const isHigher = trend > 5;
    const isLower = trend < -5;

    return (
      <Badge
        variant="outline"
        className={cn(
          'font-mono text-xs',
          isHigher && 'border-red-500/50 text-red-500 bg-red-500/10',
          isLower && 'border-green-500/50 text-green-500 bg-green-500/10',
          !isHigher && !isLower && 'text-muted-foreground'
        )}
      >
        {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
      </Badge>
    );
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Comparison</CardTitle>
          <CardDescription>This month vs average</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No category data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription>This month vs your average spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  This Month
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  Average
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.slice(0, 10).map((cat) => (
                <tr
                  key={cat.categoryId}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium text-sm">{cat.categoryName}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.categoryGroupName}
                      </p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="font-mono text-sm">
                      {formatCurrency(cat.currentMonth)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatCurrency(cat.average)}
                    </span>
                  </td>
                  <td className="text-right py-3 px-2">
                    <div className="flex items-center justify-end gap-2">
                      {getTrendIcon(cat.trend)}
                      {getTrendBadge(cat.trend)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length > 10 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Showing top 10 of {categories.length} categories
          </p>
        )}
      </CardContent>
    </Card>
  );
}
