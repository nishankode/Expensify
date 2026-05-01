import { getCategoryAppearance } from '../lib/categoryAppearance'

export function materialIcon(categoryName: string, rawIcon?: string) {
  return getCategoryAppearance({
    name: categoryName,
    icon: rawIcon,
  }).icon
}
