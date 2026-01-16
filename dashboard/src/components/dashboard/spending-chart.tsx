'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { milliunitsToAmount } from '@/lib/ynab/client';
import type { MonthlySpending } from '@/lib/ynab/types';

interface SpendingChartProps {
  data: MonthlySpending[];
}

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(142, 76%, 36%)',
  },
  spending: {
    label: 'Spending',
    color: 'hsl(0, 84%, 60%)',
  },
} satisfies ChartConfig;

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((item) => ({
    month: new Date(item.month).toLocaleDateString('it-IT', { month: 'short' }),
    income: milliunitsToAmount(item.income),
    spending: milliunitsToAmount(item.spending),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Spending</CardTitle>
        <CardDescription>Monthly comparison over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
