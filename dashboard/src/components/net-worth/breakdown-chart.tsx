'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { formatCurrency, milliunitsToAmount } from '@/lib/ynab/client';
import type { AccountSummary } from '@/lib/ynab/types';

interface BreakdownChartProps {
  accounts: AccountSummary[];
}

// Account type display names
const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  cash: 'Cash',
  creditCard: 'Credit Card',
  lineOfCredit: 'Line of Credit',
  otherAsset: 'Other Asset',
  otherLiability: 'Other Liability',
  mortgage: 'Mortgage',
  autoLoan: 'Auto Loan',
  studentLoan: 'Student Loan',
  personalLoan: 'Personal Loan',
  medicalDebt: 'Medical Debt',
  otherDebt: 'Other Debt',
};

// Asset colors (green palette)
const ASSET_COLORS: Record<string, string> = {
  checking: 'hsl(142, 76%, 36%)',
  savings: 'hsl(142, 60%, 45%)',
  cash: 'hsl(142, 50%, 55%)',
  otherAsset: 'hsl(142, 40%, 65%)',
};

// Liability colors (red palette)
const LIABILITY_COLORS: Record<string, string> = {
  creditCard: 'hsl(0, 84%, 60%)',
  lineOfCredit: 'hsl(0, 70%, 50%)',
  mortgage: 'hsl(0, 60%, 45%)',
  autoLoan: 'hsl(0, 55%, 55%)',
  studentLoan: 'hsl(0, 50%, 60%)',
  personalLoan: 'hsl(0, 45%, 65%)',
  medicalDebt: 'hsl(0, 40%, 70%)',
  otherDebt: 'hsl(0, 35%, 75%)',
  otherLiability: 'hsl(0, 30%, 80%)',
};

function getAssetColor(type: string): string {
  return ASSET_COLORS[type] || ASSET_COLORS.otherAsset;
}

function getLiabilityColor(type: string): string {
  return LIABILITY_COLORS[type] || LIABILITY_COLORS.otherLiability;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  displayValue: string;
}

export function BreakdownChart({ accounts }: BreakdownChartProps) {
  // Separate assets and liabilities
  const assets = accounts.filter((acc) => acc.balance > 0);
  const liabilities = accounts.filter((acc) => acc.balance < 0);

  // Group by account type and aggregate
  const assetData: ChartDataItem[] = assets.map((acc) => ({
    name: acc.name,
    value: milliunitsToAmount(acc.balance),
    color: getAssetColor(acc.type),
    displayValue: formatCurrency(acc.balance),
  }));

  const liabilityData: ChartDataItem[] = liabilities.map((acc) => ({
    name: acc.name,
    value: milliunitsToAmount(Math.abs(acc.balance)),
    color: getLiabilityColor(acc.type),
    displayValue: formatCurrency(Math.abs(acc.balance)),
  }));

  const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = Math.abs(liabilities.reduce((sum, acc) => sum + acc.balance, 0));

  const assetChartConfig: ChartConfig = assetData.reduce(
    (config, item) => ({
      ...config,
      [item.name]: { label: item.name, color: item.color },
    }),
    {} as ChartConfig
  );

  const liabilityChartConfig: ChartConfig = liabilityData.reduce(
    (config, item) => ({
      ...config,
      [item.name]: { label: item.name, color: item.color },
    }),
    {} as ChartConfig
  );

  // Custom label renderer for pie slices
  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    if (percent < 0.05) return null; // Don't show labels for tiny slices
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Breakdown</CardTitle>
        <CardDescription>Assets and liabilities by account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          {/* Assets Chart */}
          <div className="flex-1 max-w-[350px]">
            <h4 className="text-sm font-semibold text-center mb-2 text-green-600">
              Assets ({formatCurrency(totalAssets)})
            </h4>
            {assetData.length > 0 ? (
              <>
                <ChartContainer config={assetChartConfig} className="h-[250px] w-full overflow-visible">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            `€${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2 })} `,
                            name,
                          ]}
                        />
                      }
                    />
                    <Pie
                      data={assetData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      label={renderLabel}
                      labelLine={false}
                    >
                      {assetData.map((entry, index) => (
                        <Cell key={`asset-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {assetData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No assets</p>
              </div>
            )}
          </div>

          {/* Liabilities Chart */}
          <div className="flex-1 max-w-[350px]">
            <h4 className="text-sm font-semibold text-center mb-2 text-red-600">
              Liabilities ({formatCurrency(totalLiabilities)})
            </h4>
            {liabilityData.length > 0 ? (
              <>
                <ChartContainer config={liabilityChartConfig} className="h-[250px] w-full overflow-visible">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            `€${Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2 })} `,
                            name,
                          ]}
                        />
                      }
                    />
                    <Pie
                      data={liabilityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      label={renderLabel}
                      labelLine={false}
                    >
                      {liabilityData.map((entry, index) => (
                        <Cell key={`liability-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {liabilityData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No liabilities</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
