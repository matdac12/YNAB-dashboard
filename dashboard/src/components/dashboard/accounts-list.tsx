'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/ynab/client';
import type { AccountSummary } from '@/lib/ynab/types';
import { Building2, CreditCard, Wallet, PiggyBank, TrendingUp, Landmark } from 'lucide-react';

interface AccountsListProps {
  accounts: AccountSummary[];
}

const accountIcons: Record<string, typeof Wallet> = {
  checking: Building2,
  savings: PiggyBank,
  cash: Wallet,
  creditCard: CreditCard,
  lineOfCredit: CreditCard,
  otherAsset: TrendingUp,
  otherLiability: Landmark,
  mortgage: Landmark,
  autoLoan: Landmark,
  studentLoan: Landmark,
  personalLoan: Landmark,
  medicalDebt: Landmark,
  otherDebt: Landmark,
};

export function AccountsList({ accounts }: AccountsListProps) {
  // All accounts are now on-budget (off-budget accounts filtered at data layer)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const renderAccount = (account: AccountSummary) => {
    const Icon = accountIcons[account.type] || Wallet;
    const isNegative = account.balance < 0;

    return (
      <div
        key={account.id}
        className="flex items-center justify-between py-2 border-b border-border last:border-0"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{account.name}</span>
        </div>
        <span className={`text-sm font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {formatCurrency(account.balance)}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>Your account balances</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Budget Accounts</h4>
              <span className={`text-sm font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalBalance)}
              </span>
            </div>
            <div className="space-y-1">
              {accounts.map(renderAccount)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
