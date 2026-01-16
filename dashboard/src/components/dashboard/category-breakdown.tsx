'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency, milliunitsToAmount } from '@/lib/ynab/client';
import type { SpendingByCategory } from '@/lib/ynab/types';

interface CategoryBreakdownProps {
  data: SpendingByCategory[];
}

const COLORS = [
  'hsl(221, 83%, 53%)', // blue
  'hsl(142, 76%, 36%)', // green
  'hsl(0, 84%, 60%)',   // red
  'hsl(45, 93%, 47%)',  // yellow
  'hsl(262, 83%, 58%)', // purple
  'hsl(199, 89%, 48%)', // cyan
  'hsl(24, 95%, 53%)',  // orange
  'hsl(340, 82%, 52%)', // pink
];

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  // Take top 8 categories, group rest as "Other"
  const topCategories = data.slice(0, 7);
  const otherCategories = data.slice(7);
  const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const otherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);

  const chartData = [
    ...topCategories.map((cat, index) => ({
      name: cat.categoryName,
      value: milliunitsToAmount(cat.amount),
      percentage: cat.percentage,
      fill: COLORS[index % COLORS.length],
    })),
    ...(otherTotal > 0
      ? [
          {
            name: 'Other',
            value: milliunitsToAmount(otherTotal),
            percentage: otherPercentage,
            fill: 'hsl(0, 0%, 60%)',
          },
        ]
      : []),
  ];

  const chartConfig = chartData.reduce((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Where your money went this month</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-4">
        <ChartContainer config={chartConfig} className="h-[300px] flex-1">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`€${Number(value).toFixed(2)}`, name]}
                />
              }
            />
          </PieChart>
        </ChartContainer>
        <div className="flex-1 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">€{item.value.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
