'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { MonthlySpendingTypePoint, SpendingTypeKey } from '@/lib/ynab/trends';
import { SPENDING_TYPE_COLORS, SPENDING_TYPE_LABELS } from '@/lib/ynab/trends';

interface TrendsChartProps {
  data: MonthlySpendingTypePoint[];
}

const SPENDING_TYPES: SpendingTypeKey[] = ['living', 'fixed', 'creditCards'];

const chartConfig: ChartConfig = {
  living: {
    label: SPENDING_TYPE_LABELS.living,
    color: SPENDING_TYPE_COLORS.living,
  },
  fixed: {
    label: SPENDING_TYPE_LABELS.fixed,
    color: SPENDING_TYPE_COLORS.fixed,
  },
  creditCards: {
    label: SPENDING_TYPE_LABELS.creditCards,
    color: SPENDING_TYPE_COLORS.creditCards,
  },
};

export function TrendsChart({ data }: TrendsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Spending by type over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No spending data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
        <CardDescription>Spending by type over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="monthLabel"
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
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `€${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
                    name,
                  ]}
                />
              }
            />
            {SPENDING_TYPES.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                name={SPENDING_TYPE_LABELS[type]}
                stroke={SPENDING_TYPE_COLORS[type]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {SPENDING_TYPES.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: SPENDING_TYPE_COLORS[type] }}
              />
              <span className="text-sm">{SPENDING_TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
