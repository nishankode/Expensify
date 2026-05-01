import type { Category, TransactionType } from '../types'

type CategoryAppearanceInput = Partial<Pick<Category, 'name' | 'icon' | 'color' | 'type'>>

type CategoryPreset = {
  aliases: string[]
  icon: string
  color: string
}

const presets: CategoryPreset[] = [
  { aliases: ['food', 'dining', 'restaurant', 'meal', 'cafe'], icon: 'restaurant', color: '#E65100' },
  { aliases: ['transport', 'transportation', 'travel', 'commute', 'uber', 'fuel'], icon: 'directions_car', color: '#1565C0' },
  { aliases: ['shopping', 'shop', 'store', 'amazon', 'mall'], icon: 'shopping_bag', color: '#6A1B9A' },
  { aliases: ['utility', 'bill', 'bills', 'electricity', 'water', 'internet'], icon: 'receipt_long', color: '#1A237E' },
  { aliases: ['health', 'medical', 'pharmacy', 'doctor', 'hospital'], icon: 'local_hospital', color: '#C62828' },
  { aliases: ['salary', 'income', 'freelance', 'pay', 'payroll'], icon: 'payments', color: '#2E7D32' },
  { aliases: ['home', 'housing', 'rent'], icon: 'home', color: '#5E35B1' },
  { aliases: ['entertainment', 'movie', 'game', 'gaming'], icon: 'movie', color: '#8E24AA' },
  { aliases: ['education', 'school', 'course'], icon: 'school', color: '#3949AB' },
  { aliases: ['pet', 'pets'], icon: 'pets', color: '#00897B' },
]

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function normalizeHexColor(value: string) {
  const trimmed = value.trim()
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toUpperCase()
  }

  return ''
}

function withAlpha(color: string, alpha = '22') {
  const hex = normalizeHexColor(color)
  return hex ? `${hex}${alpha}` : '#E2E8F022'
}

function fallbackForType(type?: TransactionType) {
  if (type === 'income') {
    return { icon: 'payments', color: '#2E7D32' }
  }

  return { icon: 'category', color: '#546E7A' }
}

function presetForName(name: string, type?: TransactionType) {
  const normalized = normalizeName(name)
  const match = presets.find((preset) =>
    preset.aliases.some((alias) => normalized.includes(alias)),
  )

  return match ?? fallbackForType(type)
}

export function getCategoryAppearance(input: CategoryAppearanceInput = {}) {
  const preset = presetForName(input.name ?? '', input.type)
  const icon = /^[a-z_]+$/i.test(input.icon ?? '') ? String(input.icon) : preset.icon
  const color = normalizeHexColor(input.color ?? '') || preset.color

  return {
    icon,
    color,
    foreground: color,
    background: withAlpha(color),
  }
}
