import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from 'react-native'
import type { Account, TransactionDraft } from '../types'
import { getCategoryAppearance } from '../lib/categoryAppearance'

type CaptureCategoryConfig = {
  id: string
  name: string
  icon: string
  background: string
  foreground: string
}

type PendingCapturedExpense = TransactionDraft & {
  id: string
  userId: string
  sourceBody?: string
}

type SmsExpenseCaptureNativeModule = {
  configure(configJson: string): Promise<void>
  clearConfiguration(): Promise<void>
  getPendingTransactions(): Promise<string>
  removePendingTransactions(ids: string[]): Promise<void>
  hasOverlayPermission(): Promise<boolean>
  hasNotificationAccess(): Promise<boolean>
  openOverlayPermissionSettings(): Promise<void>
  openNotificationAccessSettings(): Promise<void>
}

const nativeModule = Platform.OS === 'android'
  ? (NativeModules.SmsExpenseCapture as SmsExpenseCaptureNativeModule | undefined)
  : undefined

const eventEmitter = nativeModule ? new NativeEventEmitter(NativeModules.SmsExpenseCapture) : null

export function isSmsExpenseCaptureAvailable() {
  return Platform.OS === 'android' && Boolean(nativeModule)
}

export async function syncSmsExpenseCaptureConfiguration(account: Account | null) {
  if (!nativeModule) {
    return
  }

  if (!account) {
    await nativeModule.clearConfiguration()
    return
  }

  const categories: CaptureCategoryConfig[] = account.categories
    .filter((category) => category.type === 'expense')
    .sort((left, right) => left.order - right.order)
    .map((category) => ({
      ...getCategoryAppearance(category),
      id: category.id,
      name: category.name,
    }))

  await nativeModule.configure(
    JSON.stringify({
      userId: account.id,
      categories,
    }),
  )
}

export async function getPendingCapturedExpenses(): Promise<PendingCapturedExpense[]> {
  if (!nativeModule) {
    return []
  }

  const raw = await nativeModule.getPendingTransactions()
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PendingCapturedExpense[]) : []
  } catch {
    return []
  }
}

export async function removePendingCapturedExpenses(ids: string[]) {
  if (!nativeModule || ids.length === 0) {
    return
  }
  await nativeModule.removePendingTransactions(ids)
}

export async function ensureSmsPermission() {
  if (Platform.OS !== 'android') {
    return true
  }

  const permissions = [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS]

  const checks = await Promise.all(permissions.map((permission) => PermissionsAndroid.check(permission)))
  if (checks.every(Boolean)) {
    return true
  }

  const result = await PermissionsAndroid.requestMultiple(permissions)

  return permissions.every((permission) => result[permission] === PermissionsAndroid.RESULTS.GRANTED)
}

export async function hasOverlayPermission() {
  if (!nativeModule) {
    return false
  }
  return nativeModule.hasOverlayPermission()
}

export async function hasNotificationAccess() {
  if (!nativeModule) {
    return false
  }
  return nativeModule.hasNotificationAccess()
}

export async function openOverlayPermissionSettings() {
  if (!nativeModule) {
    return
  }
  await nativeModule.openOverlayPermissionSettings()
}

export async function openNotificationAccessSettings() {
  if (!nativeModule) {
    return
  }
  await nativeModule.openNotificationAccessSettings()
}

export function addPendingExpenseListener(listener: () => void) {
  if (!eventEmitter) {
    return () => {}
  }

  const subscription = eventEmitter.addListener('SmsExpenseCapturePendingChanged', listener)
  return () => subscription.remove()
}
