import { getYNABApi, getBudgetId, milliunitsToAmount, getLastNMonths } from './client';
import { getSpendingType } from './spending';

export interface CategoryTrendData {
  categoryId: string;
  categoryName: string;
  categoryGroupName: string;
  monthlyData: {
    month: string;
    amount: number; // already converted from milliunits
  }[];
  total: number;
  average: number;
  currentMonth: number;
  trend: number; // percentage change vs average
}

export interface MonthlyTrendPoint {
  month: string;
  monthLabel: string;
  [key: string]: string | number; // dynamic category keys
}

// Fetch spending trends by category over multiple months
export async function fetchCategoryTrends(numMonths: number = 6): Promise<{
  categories: CategoryTrendData[];
  chartData: MonthlyTrendPoint[];
}> {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const months = getLastNMonths(numMonths);

  // Fetch data for each month
  const monthlyData = await Promise.all(
    months.map(async (month) => {
      const response = await api.months.getBudgetMonth(budgetId, month);
      return {
        month,
        categories: response.data.month.categories,
      };
    })
  );

  // Build category map
  const categoryMap = new Map<string, CategoryTrendData>();

  monthlyData.forEach(({ month, categories }) => {
    categories
      .filter((cat) => !cat.hidden && !cat.deleted && cat.activity < 0)
      .forEach((cat) => {
        const amount = Math.abs(milliunitsToAmount(cat.activity));

        if (!categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, {
            categoryId: cat.id,
            categoryName: cat.name,
            categoryGroupName: cat.category_group_name || 'Uncategorized',
            monthlyData: [],
            total: 0,
            average: 0,
            currentMonth: 0,
            trend: 0,
          });
        }

        const catData = categoryMap.get(cat.id)!;
        catData.monthlyData.push({ month, amount });
        catData.total += amount;
      });
  });

  // Calculate averages and trends
  const currentMonth = months[0];
  const categories = Array.from(categoryMap.values()).map((cat) => {
    cat.average = cat.total / cat.monthlyData.length;
    const currentMonthData = cat.monthlyData.find((m) => m.month === currentMonth);
    cat.currentMonth = currentMonthData?.amount || 0;
    cat.trend = cat.average > 0 ? ((cat.currentMonth - cat.average) / cat.average) * 100 : 0;
    return cat;
  });

  // Sort by total spending
  categories.sort((a, b) => b.total - a.total);

  // Build chart data (for recharts)
  const topCategories = categories.slice(0, 5);
  const chartData: MonthlyTrendPoint[] = months
    .slice()
    .reverse()
    .map((month) => {
      const point: MonthlyTrendPoint = {
        month,
        monthLabel: new Date(month).toLocaleDateString('it-IT', { month: 'short' }),
      };

      topCategories.forEach((cat) => {
        const monthData = cat.monthlyData.find((m) => m.month === month);
        point[cat.categoryName] = monthData?.amount || 0;
      });

      return point;
    });

  return { categories, chartData };
}

// Get unique category names for filtering
export function getCategoryNames(categories: CategoryTrendData[]): string[] {
  return categories.map((c) => c.categoryName);
}

// Chart colors for categories
export const CATEGORY_COLORS = [
  'hsl(221, 83%, 53%)', // blue
  'hsl(142, 76%, 36%)', // green
  'hsl(0, 84%, 60%)',   // red
  'hsl(45, 93%, 47%)',  // yellow
  'hsl(262, 83%, 58%)', // purple
  'hsl(199, 89%, 48%)', // cyan
  'hsl(24, 95%, 53%)',  // orange
  'hsl(340, 82%, 52%)', // pink
];

// Spending Type Trends
export type SpendingTypeKey = 'living' | 'fixed' | 'creditCards';

export interface MonthlySpendingTypePoint {
  month: string;
  monthLabel: string;
  living: number;
  fixed: number;
  creditCards: number;
}

// Colors matching spending-breakdown.tsx
export const SPENDING_TYPE_COLORS: Record<SpendingTypeKey, string> = {
  living: 'hsl(142, 76%, 36%)',     // green
  fixed: 'hsl(221, 83%, 53%)',      // blue
  creditCards: 'hsl(24, 95%, 53%)', // orange
};

export const SPENDING_TYPE_LABELS: Record<SpendingTypeKey, string> = {
  living: 'Living',
  fixed: 'Fixed/Savings',
  creditCards: 'Credit Cards',
};

// Fetch spending trends aggregated by type over multiple months
export async function fetchSpendingTypeTrends(numMonths: number = 6): Promise<{
  chartData: MonthlySpendingTypePoint[];
}> {
  const api = getYNABApi();
  const budgetId = getBudgetId();
  const months = getLastNMonths(numMonths);

  // Fetch data for each month
  const monthlyData = await Promise.all(
    months.map(async (month) => {
      const response = await api.months.getBudgetMonth(budgetId, month);
      return {
        month,
        categories: response.data.month.categories,
      };
    })
  );

  // Aggregate by spending type per month
  const typeAggregates: Record<SpendingTypeKey, Map<string, number>> = {
    living: new Map(),
    fixed: new Map(),
    creditCards: new Map(),
  };

  monthlyData.forEach(({ month, categories }) => {
    // Initialize all types for this month to 0
    typeAggregates.living.set(month, 0);
    typeAggregates.fixed.set(month, 0);
    typeAggregates.creditCards.set(month, 0);

    categories
      .filter((cat) => !cat.hidden && !cat.deleted && cat.activity < 0)
      .forEach((cat) => {
        const groupName = cat.category_group_name || 'Uncategorized';
        const type = getSpendingType(groupName);

        // Skip 'other' type - exclude from chart
        if (type === 'other') return;

        const amount = Math.abs(milliunitsToAmount(cat.activity));
        const currentTotal = typeAggregates[type].get(month) || 0;
        typeAggregates[type].set(month, currentTotal + amount);
      });
  });

  // Build chart data (reversed for chronological order)
  const chartData: MonthlySpendingTypePoint[] = months
    .slice()
    .reverse()
    .map((month) => ({
      month,
      monthLabel: new Date(month).toLocaleDateString('it-IT', { month: 'short' }),
      living: typeAggregates.living.get(month) || 0,
      fixed: typeAggregates.fixed.get(month) || 0,
      creditCards: typeAggregates.creditCards.get(month) || 0,
    }));

  return { chartData };
}
