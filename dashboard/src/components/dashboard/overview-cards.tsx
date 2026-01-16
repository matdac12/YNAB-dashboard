'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, milliunitsToAmount } from '@/lib/ynab/client';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Calendar, CreditCard } from 'lucide-react';

interface OverviewCardsProps {
  data: {
    toBeBudgeted: number;
    income: number;
    budgeted: number;
    activity: number;
    ageOfMoney: number | null | undefined;
    totalBalance: number;
    onBudgetBalance: number;
    accountsCount: number;
  };
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const cards = [
    {
      title: 'To Be Budgeted',
      value: formatCurrency(data.toBeBudgeted),
      icon: Wallet,
      description: 'Available to assign',
      color: data.toBeBudgeted >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Total Balance',
      value: formatCurrency(data.totalBalance),
      icon: PiggyBank,
      description: `Across ${data.accountsCount} accounts`,
      color: data.totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Income This Month',
      value: formatCurrency(data.income),
      icon: TrendingUp,
      description: 'Total income received',
      color: 'text-green-600',
    },
    {
      title: 'Spent This Month',
      value: formatCurrency(Math.abs(data.activity)),
      icon: TrendingDown,
      description: 'Total spending',
      color: 'text-orange-600',
    },
    {
      title: 'Budgeted',
      value: formatCurrency(data.budgeted),
      icon: CreditCard,
      description: 'Assigned to categories',
      color: 'text-blue-600',
    },
    {
      title: 'Age of Money',
      value: data.ageOfMoney ? `${data.ageOfMoney} days` : 'N/A',
      icon: Calendar,
      description: 'Days before money is spent',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
