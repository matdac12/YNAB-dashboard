import { getYNABApi, getBudgetId, milliunitsToAmount, getLastNMonths } from './client';
import { classifySpending, type SpendingBreakdown } from './spending';
import type {
  SpendingByCategory,
  MonthlySpending,
  NetWorthData,
  AccountSummary,
} from './types';

// Fetch complete budget data
export async function fetchBudgetData() {
  const api = getYNABApi();
  const budgetId = getBudgetId();

  const response = await api.budgets.getBudgetById(budgetId);
  return response.data.budget;
}

// Fetch accounts summary (on-budget only, used by most pages)
export async function fetchAccountsSummary(): Promise<AccountSummary[]> {
  const api = getYNABApi();
  const budgetId = getBudgetId();

  const response = await api.accounts.getAccounts(budgetId);

  return response.data.accounts
    .filter(acc => !acc.deleted && !acc.closed && acc.on_budget)
    .map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: acc.balance,
      onBudget: acc.on_budget,
    }));
}

// Fetch all accounts including tracking accounts (for net worth page)
export async function fetchAllAccounts(): Promise<AccountSummary[]> {
  const api = getYNABApi();
  const budgetId = getBudgetId();

  const response = await api.accounts.getAccounts(budgetId);

  return response.data.accounts
    .filter(acc => !acc.deleted && !acc.closed)
    .map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: acc.balance,
      onBudget: acc.on_budget,
    }));
}

// Fetch spending by category for current month
export async function fetchSpendingByCategory(month?: string): Promise<SpendingByCategory[]> {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const targetMonth = month || getLastNMonths(1)[0];

  const response = await api.months.getBudgetMonth(budgetId, targetMonth);
  const categories = response.data.month.categories;

  // Filter out hidden categories and those with no activity
  const activeCategories = categories.filter(
    cat => !cat.hidden && !cat.deleted && cat.activity < 0
  );

  // Calculate total spending (activity is negative for spending)
  const totalSpending = activeCategories.reduce(
    (sum, cat) => sum + Math.abs(cat.activity),
    0
  );

  return activeCategories
    .map(cat => ({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryGroupName: cat.category_group_name || 'Uncategorized',
      amount: Math.abs(cat.activity),
      percentage: totalSpending > 0 ? (Math.abs(cat.activity) / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Fetch monthly spending trends
export async function fetchMonthlySpending(numMonths = 6): Promise<MonthlySpending[]> {
  const api = getYNABApi();
  const budgetId = getBudgetId();

  const response = await api.months.getBudgetMonths(budgetId);
  const months = response.data.months;

  // Get the last N months
  const recentMonths = months
    .filter(m => !m.deleted)
    .slice(0, numMonths)
    .reverse();

  return recentMonths.map(month => ({
    month: month.month,
    income: month.income,
    spending: Math.abs(month.activity),
    budgeted: month.budgeted,
    netFlow: month.income + month.activity, // activity is negative for spending
  }));
}

// Fetch net worth over time
export async function fetchNetWorthTrend(): Promise<NetWorthData[]> {
  const accounts = await fetchAccountsSummary();

  // Calculate current totals
  const assets = accounts
    .filter(acc => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const liabilities = accounts
    .filter(acc => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  // For now, return just current month (historical would require storing data)
  const currentMonth = getLastNMonths(1)[0];

  return [
    {
      month: currentMonth,
      assets,
      liabilities,
      netWorth: assets - liabilities,
    },
  ];
}

// Fetch transactions for a month
export async function fetchTransactions(month?: string) {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const targetMonth = month || getLastNMonths(1)[0];

  // Calculate date range for the month
  const startDate = new Date(targetMonth);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

  const response = await api.transactions.getTransactions(
    budgetId,
    targetMonth
  );

  return response.data.transactions.filter(t => !t.deleted);
}

// Get budget summary stats
export async function fetchBudgetSummary() {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const currentMonth = getLastNMonths(1)[0];

  const [monthResponse, accountsResponse] = await Promise.all([
    api.months.getBudgetMonth(budgetId, currentMonth),
    api.accounts.getAccounts(budgetId),
  ]);

  const month = monthResponse.data.month;
  const accounts = accountsResponse.data.accounts.filter(a => !a.deleted && !a.closed && a.on_budget);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const onBudgetBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return {
    toBeBudgeted: month.to_be_budgeted,
    income: month.income,
    budgeted: month.budgeted,
    activity: month.activity,
    ageOfMoney: month.age_of_money,
    totalBalance,
    onBudgetBalance,
    accountsCount: accounts.length,
  };
}

// Fetch spending breakdown by type (Living, Fixed, Credit Cards)
export async function fetchSpendingBreakdown(month?: string): Promise<SpendingBreakdown> {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const targetMonth = month || getLastNMonths(1)[0];

  const response = await api.months.getBudgetMonth(budgetId, targetMonth);
  const categories = response.data.month.categories;

  return classifySpending(categories);
}
