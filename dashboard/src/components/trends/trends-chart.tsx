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
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrendPoint, CategoryTrendData } from '@/lib/ynab/trends';
import { CATEGORY_COLORS } from '@/lib/ynab/trends';

interface TrendsChartProps {
  data: MonthlyTrendPoint[];
  categories: CategoryTrendData[];
}

export function TrendsChart({ data, categories }: TrendsChartProps) {
  const topCategories = categories.slice(0, 5);

  // Build chart config dynamically
  const chartConfig = topCategories.reduce((config, cat, index) => {
    config[cat.categoryName] = {
      label: cat.categoryName,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Category spending over time</CardDescription>
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
        <CardDescription>Top 5 categories over the last 6 months</CardDescription>
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
            {topCategories.map((cat, index) => (
              <Line
                key={cat.categoryId}
                type="monotone"
                dataKey={cat.categoryName}
                stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {topCategories.map((cat, index) => (
            <div key={cat.categoryId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              />
              <span className="text-sm">{cat.categoryName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
