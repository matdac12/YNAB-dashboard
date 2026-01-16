import * as ynab from 'ynab';

// Re-export types from the official library
export type {
  BudgetSummary,
  BudgetDetail,
  Account,
  Category,
  CategoryGroupWithCategories,
  TransactionDetail,
  MonthDetail,
  MonthSummary,
} from 'ynab';

// Singleton instance
let api: ynab.API | null = null;

export function getYNABApi(): ynab.API {
  if (!api) {
    const apiKey = process.env.YNAB_API_KEY;
    if (!apiKey) {
      throw new Error('YNAB_API_KEY environment variable is not set');
    }
    api = new ynab.API(apiKey);
  }
  return api;
}

export function getBudgetId(): string {
  const budgetId = process.env.YNAB_BUDGET_ID;
  if (!budgetId) {
    throw new Error('YNAB_BUDGET_ID environment variable is not set');
  }
  return budgetId;
}

// Helper function to convert milliunits to currency amount
export function milliunitsToAmount(milliunits: number): number {
  return ynab.utils.convertMilliUnitsToCurrencyAmount(milliunits);
}

// Helper function to format currency
export function formatCurrency(milliunits: number, symbol = '€'): string {
  const amount = milliunitsToAmount(milliunits);
  const formatted = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get current month in YNAB format (YYYY-MM-01)
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

// Get last N months in YNAB format
export function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();

  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`);
  }

  return months;
}
