import { getCategoryAppearance } from '../../lib/categoryAppearance'
import type { Account } from '../../types'

export function buildAddExpensePayload(account?: Account) {
  if (!account) {
    return { categories: [] }
  }

  return {
    categories: account.categories.map((category) => {
      const appearance = getCategoryAppearance(category)
      return {
        name: category.name,
        type: category.type,
        icon: appearance.icon,
        background: appearance.background,
        foreground: appearance.foreground,
      }
    }),
  }
}
