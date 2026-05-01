import type {
  Account,
  Category,
  NotificationSettings,
  Transaction,
  TransactionDraft,
  UserSettings,
} from '../types'
import { getCategoryAppearance } from './categoryAppearance'

const palette = ['#1A237E', '#2E7D32', '#E57373', '#00838F', '#6A1B9A', '#F9A825']

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function buildDate(offsetDays: number) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString()
}

export function formatCurrency(amount: number, currency = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${Math.round(amount)}`
  }
}

export function createDefaultCategories(): Category[] {
  const cats: Array<Omit<Category, 'id'>> = [
    { name: 'Food & Dining', icon: 'restaurant', color: '#E65100', type: 'expense', order: 0 },
    { name: 'Transport', icon: 'directions_car', color: '#1565C0', type: 'expense', order: 1 },
    { name: 'Shopping', icon: 'shopping_bag', color: '#6A1B9A', type: 'expense', order: 2 },
    { name: 'Utilities', icon: 'receipt_long', color: '#1A237E', type: 'expense', order: 3 },
    { name: 'Health', icon: 'local_hospital', color: '#C62828', type: 'expense', order: 4 },
    { name: 'Entertainment', icon: 'movie', color: '#8E24AA', type: 'expense', order: 5 },
    { name: 'Salary', icon: 'payments', color: '#2E7D32', type: 'income', order: 6 },
  ]

  return cats.map((c) => ({
    ...c,
    id: createId(),
  })) as Category[]
}

function findCategoryId(categories: Category[], name: string) {
  return categories.find((category) => category.name === name)?.id ?? categories[0]?.id ?? ''
}

export function createStarterTransactions(_categories: Category[]): Transaction[] {
  return [] // Start with zero transactions as requested
}

export function createSettings(fullName: string, email: string): UserSettings {
  const notifications: NotificationSettings = {
    billReminders: true,
    weeklyDigest: true,
    unusualSpendAlerts: true,
  }

  return {
    fullName,
    email,
    currency: 'INR',
    monthlyBudget: 0,
    budgetConfigured: false,
    monthlyIncomeGoal: 0,
    savingsGoal: 0,
    phoneNumber: '',
    dob: '',
    notifications,
  }
}

export function createAccount(fullName: string, email: string): Account {
  const categories = createDefaultCategories()
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    settings: createSettings(fullName, email),
    categories,
    transactions: createStarterTransactions(categories),
  }
}

export function createInitialAccountData(fullName: string, email: string) {
  const account = createAccount(fullName, email)
  return {
    createdAt: account.createdAt,
    settings: account.settings,
    categories: account.categories,
    transactions: account.transactions,
  }
}

export function getCurrentMonthTransactions(account: Account) {
  const now = new Date()
  return account.transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function endOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(23, 59, 59, 999)
  return copy
}

function startOfWeek(date: Date) {
  const copy = startOfDay(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  return copy
}

function endOfWeek(date: Date) {
  const copy = startOfWeek(date)
  copy.setDate(copy.getDate() + 6)
  return endOfDay(copy)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date: Date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

function getTransactionsInRange(account: Account, start: Date, end: Date) {
  const startTime = start.getTime()
  const endTime = end.getTime()
  return account.transactions.filter((transaction) => {
    const time = new Date(transaction.date).getTime()
    return time >= startTime && time <= endTime
  })
}

export function getCurrentWeekTransactions(account: Account, referenceDate = new Date()) {
  return getTransactionsInRange(account, startOfWeek(referenceDate), endOfWeek(referenceDate))
}

export function getPreviousWeekTransactions(account: Account, referenceDate = new Date()) {
  const reference = startOfWeek(referenceDate)
  reference.setDate(reference.getDate() - 7)
  return getTransactionsInRange(account, startOfWeek(reference), endOfWeek(reference))
}

export function getPreviousMonthTransactions(account: Account, referenceDate = new Date()) {
  const reference = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1)
  return getTransactionsInRange(account, startOfMonth(reference), endOfMonth(reference))
}

export function getSummaryForTransactions(account: Account, transactions: Transaction[]) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const balance = income - expenses
  const savingsRate = income > 0 ? (balance / income) * 100 : 0
  const budgetUsed = account.settings.budgetConfigured && account.settings.monthlyBudget > 0
    ? (expenses / account.settings.monthlyBudget) * 100
    : 0

  return {
    income,
    expenses,
    balance,
    savingsRate,
    budgetUsed,
  }
}

export function getAccountSummary(account: Account) {
  return getSummaryForTransactions(account, getCurrentMonthTransactions(account))
}

export function buildMonthlyTrend(account: Account) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString('en-IN', { month: 'short' }),
      income: 0,
      expenses: 0,
    }
  })

  for (const transaction of account.transactions) {
    const date = new Date(transaction.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const target = months.find((month) => month.key === key)
    if (!target) {
      continue
    }
    if (transaction.type === 'income') {
      target.income += transaction.amount
    } else {
      target.expenses += transaction.amount
    }
  }

  return months
}

export function buildCurrentWeekTrend(account: Account, referenceDate = new Date()) {
  const start = startOfWeek(referenceDate)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      key: startOfDay(date).getTime(),
      label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      detailLabel: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      income: 0,
      expenses: 0,
    }
  })

  for (const transaction of getCurrentWeekTransactions(account, referenceDate)) {
    const dayKey = startOfDay(new Date(transaction.date)).getTime()
    const target = days.find((day) => day.key === dayKey)
    if (!target) {
      continue
    }
    if (transaction.type === 'income') {
      target.income += transaction.amount
    } else {
      target.expenses += transaction.amount
    }
  }

  return days
}

export function buildCurrentMonthTrend(account: Account, referenceDate = new Date()) {
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)
  const daysInMonth = monthEnd.getDate()
  const totalWeeks = Math.ceil(daysInMonth / 7)
  const weeks = Array.from({ length: totalWeeks }, (_, index) => {
    const startDate = new Date(monthStart)
    startDate.setDate(index * 7 + 1)
    const endDate = new Date(startDate)
    endDate.setDate(Math.min(startDate.getDate() + 6, monthEnd.getDate()))

    return {
      key: index,
      label: `W${index + 1}`,
      detailLabel: `${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} to ${endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      income: 0,
      expenses: 0,
    }
  })

  for (const transaction of getCurrentMonthTransactions(account)) {
    const date = new Date(transaction.date)
    if (date.getFullYear() !== monthStart.getFullYear() || date.getMonth() !== monthStart.getMonth()) {
      continue
    }
    const weekIndex = Math.floor((date.getDate() - 1) / 7)
    const target = weeks[weekIndex]
    if (!target) {
      continue
    }
    if (transaction.type === 'income') {
      target.income += transaction.amount
    } else {
      target.expenses += transaction.amount
    }
  }

  return weeks
}

export function buildCurrentMonthDailyTrend(account: Account, referenceDate = new Date()) {
  const monthStart = startOfMonth(referenceDate)
  const daysInMonth = endOfMonth(referenceDate).getDate()
  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    key: index + 1,
    label: `${index + 1}`,
    detailLabel: new Date(monthStart.getFullYear(), monthStart.getMonth(), index + 1).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    income: 0,
    expenses: 0,
  }))

  for (const transaction of account.transactions) {
    const date = new Date(transaction.date)
    if (date.getFullYear() !== monthStart.getFullYear() || date.getMonth() !== monthStart.getMonth()) {
      continue
    }
    const dayIndex = date.getDate() - 1
    const target = days[dayIndex]
    if (!target) {
      continue
    }
    if (transaction.type === 'income') {
      target.income += transaction.amount
    } else {
      target.expenses += transaction.amount
    }
  }

  return days
}

export function buildCategoryBreakdown(account: Account) {
  return buildCategoryBreakdownForTransactions(account, account.transactions)
}

export function buildCategoryBreakdownForTransactions(account: Account, transactions: Transaction[]) {
  return account.categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const value = transactions
        .filter((transaction) => transaction.type === 'expense' && transaction.categoryId === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
      return {
        id: category.id,
        name: category.name,
        value,
        color: category.color,
      }
    })
    .sort((left, right) => {
      // Sort by value descending, then by name
      if (right.value !== left.value) {
        return right.value - left.value
      }
      return left.name.localeCompare(right.name)
    })
}

export function getRecentTransactions(account: Account, count = 5) {
  return [...account.transactions]
    .sort((left, right) => +new Date(right.date) - +new Date(left.date))
    .slice(0, count)
}

export function getInsights(account: Account) {
  const summary = getAccountSummary(account)
  const breakdown = buildCategoryBreakdown(account)
  const insights: string[] = []

  if (account.settings.budgetConfigured && summary.expenses > account.settings.monthlyBudget) {
    insights.push('You are over your monthly budget. A quick trim in discretionary categories would help reset the month.')
  } else if (account.settings.budgetConfigured && summary.budgetUsed > 75) {
    insights.push('You have used more than three quarters of your monthly budget. Keep the next few days lighter to stay in control.')
  }

  if (breakdown[0]) {
    insights.push(`${breakdown[0].name} is your biggest spending bucket right now. Review the last few transactions there for quick wins.`)
  }

  if (summary.balance > 0) {
    const remaining = Math.max(account.settings.savingsGoal - summary.balance, 0)
    if (remaining === 0) {
      insights.push('You have already crossed your savings target for the month. Great time to move the surplus into a separate goal bucket.')
    } else {
      insights.push(`${formatCurrency(remaining, account.settings.currency)} more in net savings gets you to your target.`)
    }
  }

  if (insights.length === 0) {
    if (account.transactions.length === 0) {
      if (account.categories.length === 0) {
        insights.push('Create your first category to start tracking your daily expenses and income.')
      } else {
        insights.push('Add your first transaction to start building your personal spending history.')
      }
    } else {
      insights.push('Your cash flow looks steady. Keep logging transactions consistently to unlock sharper spending signals.')
    }
  }

  return insights
}

export function getCategoryUsage(account: Account, categoryId: string) {
  const matching = account.transactions.filter((transaction) => transaction.categoryId === categoryId)
  return {
    count: matching.length,
    total: matching.reduce((sum, transaction) => sum + transaction.amount, 0),
  }
}

export function findCategory(account: Account, categoryId: string) {
  return account.categories.find((category) => category.id === categoryId)
}

export function createEmptyTransaction(categoryId: string): TransactionDraft {
  return {
    amount: 0,
    categoryId,
    note: '',
    date: new Date().toISOString(),
    type: 'expense',
    paymentMethod: 'UPI',
    recurring: false,
  }
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function pickAccent(index: number) {
  return palette[index % palette.length]
}
