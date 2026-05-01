import { findCategory, formatCurrency } from '../../lib/finance'
import { getCategoryAppearance } from '../../lib/categoryAppearance'
import type { Account } from '../../types'

export function buildTransactionsPayload(account?: Account) {
  if (!account) {
    return { groups: [] }
  }

  const groups = new Map<string, Array<{
    title: string
    subtitle: string
    amount: string
    kind: string
    icon: string
    background: string
    foreground: string
    filter: string
  }>>()

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  for (const transaction of [...account.transactions].sort((a, b) => +new Date(b.date) - +new Date(a.date))) {
    const date = new Date(transaction.date)
    let label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    if (date.toDateString() === today.toDateString()) label = 'Today'
    if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
    const category = findCategory(account, transaction.categoryId)
    const appearance = getCategoryAppearance({
      name: category?.name,
      icon: category?.icon,
      color: category?.color,
      type: category?.type ?? transaction.type,
    })
    const item = {
      id: transaction.id,
      title: transaction.note || category?.name || 'Transaction',
      subtitle: `${new Date(transaction.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${category?.name ?? transaction.type}`,
      amount: `${transaction.type === 'expense' ? '-' : '+'}${formatCurrency(transaction.amount, account.settings.currency)}`,
      kind: transaction.type,
      icon: appearance.icon,
      background: appearance.background,
      foreground: appearance.foreground,
      filter: transaction.type === 'expense' ? 'Expenses' : 'Income',
      categoryId: transaction.categoryId,
      date: transaction.date
    }
    groups.set(label, [...(groups.get(label) ?? []), item])
  }

  return {
    groups: [...groups.entries()].map(([label, items]) => ({ label, items })),
    categories: account.categories
  }
}
