'use client';

import { SummaryCards } from '@/components/net-worth/summary-cards';
import { BreakdownChart } from '@/components/net-worth/breakdown-chart';
import { AccountsList } from '@/components/dashboard/accounts-list';
import type { AccountSummary } from '@/lib/ynab/types';

interface NetWorthClientProps {
  currentAssets: number;
  currentLiabilities: number;
  currentNetWorth: number;
  accounts: AccountSummary[];
}

export function NetWorthClient({
  currentAssets,
  currentLiabilities,
  currentNetWorth,
  accounts,
}: NetWorthClientProps) {
  return (
    <div className="space-y-6">
      <SummaryCards
        assets={currentAssets}
        liabilities={currentLiabilities}
        netWorth={currentNetWorth}
      />

      <BreakdownChart accounts={accounts} />

      <AccountsList accounts={accounts} />
    </div>
  );
}
