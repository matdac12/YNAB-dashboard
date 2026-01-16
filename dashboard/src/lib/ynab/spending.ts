// Spending Classification
// Categorizes spending into Living, Fixed/Savings, and Credit Card Payments

import type { Category } from 'ynab';
import { milliunitsToAmount } from './client';

// Define which category groups belong to each spending type
const SPENDING_GROUPS: Record<string, string[]> = {
  living: ['Living'],
  fixed: ['Fixed', 'CASA NUOVA', 'RAINY DAYS'],
  creditCards: ['Credit Card Payments'],
};

export type SpendingType = 'living' | 'fixed' | 'creditCards' | 'other';

export interface CategorySpending {
  id: string;
  name: string;
  groupName: string;
  amount: number; // in milliunits
  type: SpendingType;
}

export interface SpendingBreakdown {
  living: {
    total: number; // milliunits
    categories: CategorySpending[];
    percentage: number;
  };
  fixed: {
    total: number;
    categories: CategorySpending[];
    percentage: number;
  };
  creditCards: {
    total: number;
    categories: CategorySpending[];
    percentage: number;
  };
  other: {
    total: number;
    categories: CategorySpending[];
    percentage: number;
  };
  grandTotal: number;
}

// Determine the spending type for a category based on its group name
export function getSpendingType(categoryGroupName: string): SpendingType {
  if (SPENDING_GROUPS.living.includes(categoryGroupName)) {
    return 'living';
  }
  if (SPENDING_GROUPS.fixed.includes(categoryGroupName)) {
    return 'fixed';
  }
  if (SPENDING_GROUPS.creditCards.includes(categoryGroupName)) {
    return 'creditCards';
  }
  return 'other';
}

// Classify all categories into spending types
export function classifySpending(categories: Category[]): SpendingBreakdown {
  const result: SpendingBreakdown = {
    living: { total: 0, categories: [], percentage: 0 },
    fixed: { total: 0, categories: [], percentage: 0 },
    creditCards: { total: 0, categories: [], percentage: 0 },
    other: { total: 0, categories: [], percentage: 0 },
    grandTotal: 0,
  };

  // Process each category with negative activity (spending)
  categories
    .filter((cat) => !cat.hidden && !cat.deleted && cat.activity < 0)
    .forEach((cat) => {
      const groupName = cat.category_group_name || 'Uncategorized';
      const type = getSpendingType(groupName);
      const amount = Math.abs(cat.activity);

      const categorySpending: CategorySpending = {
        id: cat.id,
        name: cat.name,
        groupName,
        amount,
        type,
      };

      result[type].categories.push(categorySpending);
      result[type].total += amount;
      result.grandTotal += amount;
    });

  // Sort categories by amount (highest first)
  (['living', 'fixed', 'creditCards', 'other'] as SpendingType[]).forEach((type) => {
    result[type].categories.sort((a, b) => b.amount - a.amount);
  });

  // Calculate percentages
  if (result.grandTotal > 0) {
    result.living.percentage = (result.living.total / result.grandTotal) * 100;
    result.fixed.percentage = (result.fixed.total / result.grandTotal) * 100;
    result.creditCards.percentage = (result.creditCards.total / result.grandTotal) * 100;
    result.other.percentage = (result.other.total / result.grandTotal) * 100;
  }

  return result;
}

// Get a human-readable label for spending type
export function getSpendingTypeLabel(type: SpendingType): string {
  switch (type) {
    case 'living':
      return 'Living Expenses';
    case 'fixed':
      return 'Savings & Investments';
    case 'creditCards':
      return 'Credit Card Payments';
    case 'other':
      return 'Other';
  }
}

// Get description for spending type
export function getSpendingTypeDescription(type: SpendingType): string {
  switch (type) {
    case 'living':
      return 'Actual spending on daily life';
    case 'fixed':
      return 'Money going to savings & investments';
    case 'creditCards':
      return 'Paying off previous spending';
    case 'other':
      return 'Uncategorized spending';
  }
}
