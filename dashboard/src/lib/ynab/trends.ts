import { getYNABApi, getBudgetId, milliunitsToAmount, getLastNMonths } from './client';

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
