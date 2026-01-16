'use client';

import { useEffect, useState } from 'react';
import { SummaryCards } from '@/components/net-worth/summary-cards';
import { NetWorthChart } from '@/components/net-worth/net-worth-chart';
import { AccountsList } from '@/components/dashboard/accounts-list';
import {
  getNetWorthHistory,
  saveNetWorthSnapshot,
  type NetWorthSnapshot,
} from '@/lib/ynab/history';
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
  const [history, setHistory] = useState<NetWorthSnapshot[]>([]);
  const [previousNetWorth, setPreviousNetWorth] = useState<number | undefined>();

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = getNetWorthHistory();
    setHistory(storedHistory);

    // Get previous day's net worth for comparison
    if (storedHistory.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const previousSnapshots = storedHistory.filter(
        (s) => s.date.split('T')[0] !== today
      );
      if (previousSnapshots.length > 0) {
        setPreviousNetWorth(previousSnapshots[previousSnapshots.length - 1].netWorth);
      }
    }

    // Save current snapshot
    const snapshot: NetWorthSnapshot = {
      date: new Date().toISOString(),
      assets: currentAssets,
      liabilities: currentLiabilities,
      netWorth: currentNetWorth,
      accounts: accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        balance: acc.balance,
        type: acc.type,
      })),
    };
    saveNetWorthSnapshot(snapshot);

    // Update history with the new snapshot
    const updatedHistory = getNetWorthHistory();
    setHistory(updatedHistory);
  }, [currentAssets, currentLiabilities, currentNetWorth, accounts]);

  return (
    <div className="space-y-6">
      <SummaryCards
        assets={currentAssets}
        liabilities={currentLiabilities}
        netWorth={currentNetWorth}
        previousNetWorth={previousNetWorth}
      />

      <NetWorthChart data={history} />

      <AccountsList accounts={accounts} />
    </div>
  );
}
