import type { Account } from '../../types'
import { getCategoryAppearance } from '../../lib/categoryAppearance'

export function buildCategoriesPayload(account?: Account) {
  if (!account) {
    return { categories: [] }
  }

  return {
    categories: account.categories.map((category) => {
      const appearance = getCategoryAppearance(category)
      return {
        id: category.id,
        name: category.name,
        type: category.type === 'income' ? 'Income' : 'Expense',
        icon: appearance.icon,
        background: appearance.background,
        foreground: appearance.foreground,
      }
    }),
  }
}

export function buildEditCategoryPayload(account?: Account, params?: Record<string, string>) {
  if (!account || !params?.id) {
    return {}
  }

  const category = account.categories.find((c) => c.id === params.id)
  if (!category) return {}

  return {
    category: {
      ...category,
      type: category.type // Keep as is for the script logic
    }
  }
}
