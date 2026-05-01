import {
  buildCategoryBreakdownForTransactions,
  buildCurrentMonthDailyTrend,
  buildCurrentMonthTrend,
  buildCurrentWeekTrend,
  findCategory,
  formatCurrency,
  getCurrentMonthTransactions,
  getCurrentWeekTransactions,
  getPreviousMonthTransactions,
  getPreviousWeekTransactions,
  getSummaryForTransactions,
} from '../../lib/finance'
import { getCategoryAppearance } from '../../lib/categoryAppearance'
import type { Account } from '../../types'

export function buildAnalyticsPayload(account?: Account) {
  if (!account) {
    return {}
  }

  const buildView = (
    periodLabel: string,
    transactions: ReturnType<typeof getCurrentMonthTransactions>,
    previousTransactions: ReturnType<typeof getPreviousMonthTransactions>,
    trendSource: Array<{ label: string; income: number; expenses: number; detailLabel?: string }>,
    periodDays: number,
  ) => {
    const summary = getSummaryForTransactions(account, transactions)
    const previousSummary = getSummaryForTransactions(account, previousTransactions)
    const breakdown = buildCategoryBreakdownForTransactions(account, transactions)
    const totalBreakdown = breakdown.reduce((sum, item) => sum + item.value, 0) || 1
    const maxExpense = Math.max(...trendSource.map((item) => item.expenses), 1)
    const expenseTransactions = transactions.filter((item) => item.type === 'expense')
    const uniqueExpenseDays = new Set(expenseTransactions.map((item) => new Date(item.date).toDateString())).size
    const largestExpense = [...expenseTransactions].sort((left, right) => right.amount - left.amount)[0]
    const largestExpenseCategory = largestExpense ? findCategory(account, largestExpense.categoryId) : undefined
    const topCategory = breakdown[0]
    const avgDailySpend = summary.expenses / Math.max(periodDays, 1)
    const budgetRemaining = account.settings.monthlyBudget - summary.expenses
    const categoryBudgetStatuses = periodLabel === 'Month'
      ? (account.settings.categoryBudgets || [])
          .filter((item) => Number(item.amount) > 0)
          .map((item) => {
            const category = findCategory(account, item.categoryId)
            const spent = expenseTransactions
              .filter((transaction) => transaction.categoryId === item.categoryId)
              .reduce((sum, transaction) => sum + transaction.amount, 0)
            const ratio = item.amount > 0 ? spent / item.amount : 0
            const appearance = getCategoryAppearance({
              name: category?.name ?? 'Category',
              icon: category?.icon,
              color: category?.color,
              type: category?.type ?? 'expense',
            })
            const statusKey = ratio >= 1 ? 'over' : ratio >= 0.8 ? 'warning' : 'good'
            const statusLabel = ratio >= 1
              ? `${formatCurrency(spent - item.amount, account.settings.currency)} over`
              : ratio >= 0.8
                ? `${Math.round(ratio * 100)}% used`
                : `${formatCurrency(item.amount - spent, account.settings.currency)} left`

            return {
              categoryName: category?.name ?? 'Category',
              icon: appearance.icon,
              background: appearance.background,
              foreground: appearance.foreground,
              barColor: statusKey === 'over' ? '#BA1A1A' : appearance.color,
              budget: formatCurrency(item.amount, account.settings.currency),
              spent: formatCurrency(spent, account.settings.currency),
              statusKey,
              statusLabel,
              progress: Math.min(Math.round(ratio * 100), 100),
              progressText: `${Math.round(ratio * 100)}%`,
              sortWeight: ratio,
            }
          })
          .sort((left, right) => right.sortWeight - left.sortWeight)
          .map(({ sortWeight: _sortWeight, ...item }) => item)
      : []

    return {
      periodLabel,
      summary: {
        income: formatCurrency(summary.income, account.settings.currency),
        expenses: formatCurrency(summary.expenses, account.settings.currency),
      },
      comparisonText: `vs last ${periodLabel.toLowerCase()} (${formatCurrency(previousSummary.expenses, account.settings.currency)})`,
      summaryCaption:
        summary.expenses === 0
          ? `No spending recorded this ${periodLabel.toLowerCase()}.`
          : `You logged ${expenseTransactions.length} expense ${expenseTransactions.length === 1 ? 'transaction' : 'transactions'} across ${uniqueExpenseDays} active day${uniqueExpenseDays === 1 ? '' : 's'}.`,
      metrics: {
        income: formatCurrency(summary.income, account.settings.currency),
        net: formatCurrency(summary.balance, account.settings.currency),
        netCaption: summary.balance >= 0 ? 'Money left after expenses' : 'You spent more than you earned',
        budget: account.settings.budgetConfigured
          ? `${Math.round(summary.budgetUsed)}% used`
          : 'Not set',
        budgetCaption: account.settings.budgetConfigured
          ? budgetRemaining >= 0
            ? `${formatCurrency(budgetRemaining, account.settings.currency)} left in budget`
            : `${formatCurrency(Math.abs(budgetRemaining), account.settings.currency)} over budget`
          : 'Set a budget to track your pace',
        average: formatCurrency(avgDailySpend, account.settings.currency),
        averageCaption: 'Average spend per day',
      },
      signals: {
        topCategoryName: topCategory?.name ?? 'No category data',
        topCategoryAmount: topCategory ? formatCurrency(topCategory.value, account.settings.currency) : '₹0',
        topCategoryCaption: topCategory
          ? `${Math.round((topCategory.value / totalBreakdown) * 100)}% of your total spend`
          : 'Add spending to see category leaders',
        largestExpenseName: largestExpenseCategory?.name || largestExpense?.note || 'No expense recorded',
        largestExpenseAmount: largestExpense ? formatCurrency(largestExpense.amount, account.settings.currency) : '₹0',
        largestExpenseCaption: largestExpense
          ? new Date(largestExpense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          : 'Your biggest expense will appear here',
      },
      trend: trendSource.map((item) => ({
        label: item.label,
        detailLabel: item.detailLabel ?? item.label,
        amount: formatCurrency(item.expenses, account.settings.currency),
        rawAmount: item.expenses,
        height: `${Math.max((item.expenses / maxExpense) * 100, item.expenses > 0 ? 12 : 8)}%`,
      })),
      categories: breakdown.slice(0, 4).map((item) => {
        const category = findCategory(account, item.id)
        const appearance = getCategoryAppearance({
          name: category?.name ?? item.name,
          icon: category?.icon,
          color: category?.color ?? item.color,
          type: category?.type ?? 'expense',
        })

        return {
          name: item.name,
          icon: appearance.icon,
          background: appearance.background,
          foreground: appearance.foreground,
          barColor: appearance.color,
          amount: formatCurrency(item.value, account.settings.currency),
          percent: Math.round((item.value / totalBreakdown) * 100),
        }
      }),
      categoryBudgetStatuses,
    }
  }

  const weeklyTransactions = getCurrentWeekTransactions(account)
  const previousWeeklyTransactions = getPreviousWeekTransactions(account)
  const monthlyTransactions = getCurrentMonthTransactions(account)
  const previousMonthlyTransactions = getPreviousMonthTransactions(account)
  const monthlyWeeklyView = buildView('Month', monthlyTransactions, previousMonthlyTransactions, buildCurrentMonthTrend(account), new Date().getDate())
  const monthlyDailyView = buildView('Month', monthlyTransactions, previousMonthlyTransactions, buildCurrentMonthDailyTrend(account), new Date().getDate())

  return {
    currency: account.settings.currency,
    defaultView: 'monthly',
    views: {
      weekly: buildView('Week', weeklyTransactions, previousWeeklyTransactions, buildCurrentWeekTrend(account), 7),
      monthly: {
        ...monthlyWeeklyView,
        defaultTrendMode: 'weekly',
        trendModes: {
          weekly: monthlyWeeklyView.trend,
          daily: monthlyDailyView.trend,
        },
      },
    },
  }
}
