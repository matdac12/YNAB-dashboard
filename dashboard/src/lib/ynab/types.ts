// Re-export all types from the official YNAB library
export * from 'ynab';

// Custom analytics types for the dashboard
export interface SpendingByCategory {
  categoryId: string;
  categoryName: string;
  categoryGroupName: string;
  amount: number; // in milliunits
  percentage: number;
}

export interface MonthlySpending {
  month: string;
  income: number;
  spending: number;
  budgeted: number;
  netFlow: number;
}

export interface CategoryTrend {
  categoryName: string;
  data: {
    month: string;
    amount: number;
  }[];
}

export interface NetWorthData {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface AccountSummary {
  id: string;
  name: string;
  type: string;
  balance: number;
  onBudget: boolean;
}
