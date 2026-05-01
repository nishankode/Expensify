import {
  buildCategoryBreakdown,
  findCategory,
  formatCurrency,
  getAccountSummary,
  getRecentTransactions,
} from '../../lib/finance'
import { getCategoryAppearance } from '../../lib/categoryAppearance'
import type { Account } from '../../types'

export function buildDashboardPayload(account?: Account) {
  if (!account) {
    return {}
  }

  const summary = getAccountSummary(account)
  const now = new Date()
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonthExpense = account.transactions
    .filter((transaction) => {
      if (transaction.type !== 'expense') {
        return false
      }
      const date = new Date(transaction.date)
      return (
        date.getMonth() === previousMonthDate.getMonth() &&
        date.getFullYear() === previousMonthDate.getFullYear()
      )
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const expenseDeltaPercent = previousMonthExpense > 0
    ? Math.round(((summary.expenses - previousMonthExpense) / previousMonthExpense) * 100)
    : null

  const recentTransactions = getRecentTransactions(account, 4).map((transaction) => {
    const category = findCategory(account, transaction.categoryId)
    const appearance = getCategoryAppearance({
      name: category?.name,
      icon: category?.icon,
      color: category?.color,
      type: category?.type ?? transaction.type,
    })

    return {
      title: transaction.note || category?.name || 'Transaction',
      subtitle: `${category?.name ?? 'Uncategorized'} - ${new Date(transaction.date).toLocaleDateString('en-IN')}`,
      amount: `${transaction.type === 'expense' ? '-' : '+'}${formatCurrency(transaction.amount, account.settings.currency)}`,
      kind: transaction.type,
      icon: appearance.icon,
      background: appearance.background,
      foreground: appearance.foreground,
    }
  })

  const breakdown = buildCategoryBreakdown(account).slice(0, 8)
  const totalBreakdown = breakdown.reduce((sum, item) => sum + item.value, 0) || 1

  return {
    summary: {
      balance: formatCurrency(summary.balance, account.settings.currency),
      income: formatCurrency(summary.income, account.settings.currency),
      expenses: formatCurrency(summary.expenses, account.settings.currency),
      budget: account.settings.budgetConfigured
        ? formatCurrency(account.settings.monthlyBudget, account.settings.currency)
        : formatCurrency(0, account.settings.currency),
    },
    expenseChange:
      expenseDeltaPercent === null
        ? null
        : {
            direction:
              expenseDeltaPercent > 0 ? 'up' : expenseDeltaPercent < 0 ? 'down' : 'flat',
            label: `${Math.abs(expenseDeltaPercent)}% vs last month`,
          },
    categories: breakdown.map((item) => {
      const category = findCategory(account, item.id)
      const appearance = getCategoryAppearance({
        name: category?.name ?? item.name,
        icon: category?.icon,
        color: category?.color ?? item.color,
        type: category?.type ?? 'expense',
      })

      return {
        name: item.name,
        amount: formatCurrency(item.value, account.settings.currency),
        icon: appearance.icon,
        background: appearance.background,
        foreground: appearance.foreground,
        percent: Math.round((item.value / totalBreakdown) * 100),
      }
    }),
    recentTransactions,
  }
}
