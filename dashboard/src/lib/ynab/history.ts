// Net Worth History Management
// Stores snapshots in localStorage since YNAB API doesn't provide historical data

export interface NetWorthSnapshot {
  date: string; // ISO date string
  assets: number; // milliunits
  liabilities: number; // milliunits
  netWorth: number; // milliunits
  accounts: {
    id: string;
    name: string;
    balance: number;
    type: string;
  }[];
}

const STORAGE_KEY = 'ynab-net-worth-history';
const MAX_SNAPSHOTS = 365; // Keep up to 1 year of daily snapshots

export function getNetWorthHistory(): NetWorthSnapshot[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveNetWorthSnapshot(snapshot: NetWorthSnapshot): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getNetWorthHistory();
    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a snapshot for today
    const existingIndex = history.findIndex(
      (s) => s.date.split('T')[0] === today
    );

    if (existingIndex >= 0) {
      // Update today's snapshot
      history[existingIndex] = { ...snapshot, date: new Date().toISOString() };
    } else {
      // Add new snapshot
      history.push({ ...snapshot, date: new Date().toISOString() });
    }

    // Sort by date and keep only the last MAX_SNAPSHOTS
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const trimmed = history.slice(-MAX_SNAPSHOTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save net worth snapshot:', error);
  }
}

export function getNetWorthTrend(months: number = 12): NetWorthSnapshot[] {
  const history = getNetWorthHistory();
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  return history.filter((s) => new Date(s.date) >= cutoffDate);
}

export function clearNetWorthHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Calculate change between two snapshots
export function calculateChange(
  current: number,
  previous: number
): { amount: number; percentage: number } {
  const amount = current - previous;
  const percentage = previous !== 0 ? (amount / Math.abs(previous)) * 100 : 0;
  return { amount, percentage };
}
