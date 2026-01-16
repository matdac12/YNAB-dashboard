import { NextResponse } from 'next/server';
import { getYNABApi, getBudgetId } from '@/lib/ynab';

export async function GET() {
  try {
    const api = getYNABApi();
    const budgetId = getBudgetId();
    const response = await api.budgets.getBudgetById(budgetId);

    return NextResponse.json(response.data.budget);
  } catch (error) {
    console.error('Failed to fetch budget:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}
