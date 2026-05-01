export type TransactionType = 'expense' | 'income'

export type NotificationSettings = {
  billReminders: boolean
  weeklyDigest: boolean
  unusualSpendAlerts: boolean
}

export type Category = {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
  order: number
}

export type Transaction = {
  id: string
  amount: number
  categoryId: string
  note: string
  date: string
  type: TransactionType
  paymentMethod: string
  recurring: boolean
}

export type UserSettings = {
  fullName: string
  email: string
  avatarDataUrl?: string
  currency: string
  monthlyBudget: number
  budgetConfigured?: boolean
  monthlyIncomeGoal: number
  savingsGoal: number
  phoneNumber?: string
  dob?: string
  notifications: NotificationSettings
  categoryBudgets?: { categoryId: string; amount: number }[]
}

export type Account = {
  id: string
  createdAt: string
  settings: UserSettings
  categories: Category[]
  transactions: Transaction[]
}

export type UserDocument = {
  createdAt: string
  settings: UserSettings
}

export type CategoryDraft = Pick<Category, 'name' | 'icon' | 'color' | 'type'>

export type TransactionDraft = Omit<Transaction, 'id'>

export type RouteName = 'dashboard' | 'transactions' | 'analytics' | 'categories' | 'settings' | 'add'
