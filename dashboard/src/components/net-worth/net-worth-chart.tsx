'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';
import { milliunitsToAmount } from '@/lib/ynab/client';
import type { NetWorthSnapshot } from '@/lib/ynab/history';

interface NetWorthChartProps {
  data: NetWorthSnapshot[];
}

const chartConfig = {
  assets: {
    label: 'Assets',
    color: 'hsl(142, 76%, 36%)',
  },
  liabilities: {
    label: 'Liabilities',
    color: 'hsl(0, 84%, 60%)',
  },
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(221, 83%, 53%)',
  },
} satisfies ChartConfig;

export function NetWorthChart({ data }: NetWorthChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('it-IT', {
      month: 'short',
      day: 'numeric',
    }),
    assets: milliunitsToAmount(item.assets),
    liabilities: milliunitsToAmount(Math.abs(item.liabilities)),
    netWorth: milliunitsToAmount(item.netWorth),
  }));

  if (data.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Over Time</CardTitle>
          <CardDescription>Historical trend of your net worth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">Not enough data yet</p>
              <p className="text-sm text-muted-foreground">
                Visit this page daily to build your net worth history.
                <br />
                We&apos;ll store a snapshot each time you visit.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Over Time</CardTitle>
        <CardDescription>Historical trend of your net worth</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `€${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
                    name,
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="assets"
              stroke="hsl(142, 76%, 36%)"
              fill="url(#assetsGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="liabilities"
              stroke="hsl(0, 84%, 60%)"
              fill="url(#liabilitiesGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
