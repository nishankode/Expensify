import type { Account } from '../../types'

export function buildProfilePayload(account?: Account) {
  if (!account) {
    return {}
  }

  return {
    fullName: account.settings.fullName,
    email: account.settings.email,
    phoneNumber: account.settings.phoneNumber || '',
    dob: account.settings.dob || '',
  }
}

export function buildBudgetPayload(account?: Account) {
  if (!account) {
    return {}
  }

  return {
    monthlyBudget: account.settings.budgetConfigured ? account.settings.monthlyBudget : 0,
    budgetConfigured: account.settings.budgetConfigured ?? false,
    categories: account.categories || [],
    categoryBudgets: account.settings.categoryBudgets || [],
  }
}

export function buildNotificationsPayload(account?: Account) {
  return account?.settings.notifications ?? {}
}
