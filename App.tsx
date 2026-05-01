import { StatusBar } from 'expo-status-bar'
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { AppProvider, useApp } from './src/context/AppContext'
import {
  getFirebaseSetupMessage,
  getGoogleNativeWebClientId,
  isGoogleAuthConfigured,
} from './src/lib/firebase'
import {
  addPendingExpenseListener,
  ensureSmsPermission,
  getPendingCapturedExpenses,
  hasNotificationAccess,
  hasOverlayPermission,
  isSmsExpenseCaptureAvailable,
  openNotificationAccessSettings,
  openOverlayPermissionSettings,
  removePendingCapturedExpenses,
  syncSmsExpenseCaptureConfiguration,
} from './src/native/smsExpenseCapture'
import { buildStitchHtml, type StitchRoute } from './src/stitchBridge'

const mainRoutes: StitchRoute[] = ['dashboard', 'transactions', 'analytics', 'addExpense', 'profile', 'categories']
const authPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'web' ? 'web' : 'android'

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <RootApp />
      </AppProvider>
    </SafeAreaProvider>
  )
}

function RootApp() {
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addTransaction,
    deleteTransaction,
    currentAccount,
    isAuthenticated,
    isReady,
    signInWithGoogleIdToken,
    signOut,
    updateSettings,
  } = useApp()

  const [authRoute, setAuthRoute] = useState<'signin' | 'signup'>('signin')
  const [routeStack, setRouteStack] = useState<StitchRoute[]>(['dashboard'])
  const [currentParams, setCurrentParams] = useState<Record<string, string>>({})
  const hasShownCapturePrompt = useRef(false)
  const isSyncingCapturedExpenses = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setRouteStack(['dashboard'])
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (authPlatform !== 'android') {
      return
    }

    GoogleSignin.configure({
      webClientId: getGoogleNativeWebClientId(),
    })
  }, [])

  const syncCapturedExpenses = useCallback(async () => {
    if (!currentAccount || !isSmsExpenseCaptureAvailable() || isSyncingCapturedExpenses.current) {
      return
    }

    isSyncingCapturedExpenses.current = true
    try {
      const pending = await getPendingCapturedExpenses()
      const syncedIds: string[] = []
      const fallbackExpenseCategory = currentAccount.categories.find((category) => category.type === 'expense')?.id ?? ''

      for (const pendingExpense of pending) {
        if (pendingExpense.userId && pendingExpense.userId !== currentAccount.id) {
          continue
        }

        const pendingCategoryId = String(pendingExpense.categoryId ?? '')
        const pendingCategoryName = String((pendingExpense as { categoryName?: string }).categoryName ?? '')
        const matchedCategory = currentAccount.categories.find((category) => (
          category.id === pendingCategoryId ||
          category.name.toLowerCase() === pendingCategoryId.toLowerCase() ||
          category.name.toLowerCase() === pendingCategoryName.toLowerCase()
        ))

        const categoryId = matchedCategory?.id ?? fallbackExpenseCategory

        if (!categoryId) {
          continue
        }

        await addTransaction({
          amount: Number(pendingExpense.amount ?? 0),
          categoryId,
          note: String(pendingExpense.note ?? 'Auto-captured UPI payment'),
          date: String(pendingExpense.date ?? new Date().toISOString()),
          type: 'expense',
          paymentMethod: String(pendingExpense.paymentMethod ?? 'UPI'),
          recurring: Boolean(pendingExpense.recurring),
        })

        syncedIds.push(pendingExpense.id)
      }

      await removePendingCapturedExpenses(syncedIds)
    } catch (error) {
      console.warn('Failed to sync captured SMS expenses', error)
    } finally {
      isSyncingCapturedExpenses.current = false
    }
  }, [addTransaction, currentAccount])

  useEffect(() => {
    if (authPlatform !== 'android' || !isSmsExpenseCaptureAvailable()) {
      return
    }

    void syncSmsExpenseCaptureConfiguration(currentAccount ?? null)
    if (currentAccount) {
      void syncCapturedExpenses()
    }
  }, [currentAccount, syncCapturedExpenses])

  useEffect(() => {
    if (authPlatform !== 'android' || !currentAccount || !isSmsExpenseCaptureAvailable() || hasShownCapturePrompt.current) {
      return
    }

    hasShownCapturePrompt.current = true

    void (async () => {
      const smsGranted = await ensureSmsPermission()
      const notificationGranted = await hasNotificationAccess()
      const overlayGranted = await hasOverlayPermission()

      if ((smsGranted || notificationGranted) && overlayGranted) {
        return
      }

      Alert.alert(
        'Finish payment capture setup',
        'To auto-capture UPI spends from bank messages, allow SMS or notification access and enable display over other apps.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              void (async () => {
                const grantedNow = smsGranted || await ensureSmsPermission()
                if (!notificationGranted) {
                  await openNotificationAccessSettings()
                }
                if ((grantedNow || notificationGranted) && !overlayGranted) {
                  await openOverlayPermissionSettings()
                }
              })()
            },
          },
        ],
      )
    })()
  }, [currentAccount])

  useEffect(() => {
    if (!isSmsExpenseCaptureAvailable()) {
      return
    }
    return addPendingExpenseListener(() => {
      void syncCapturedExpenses()
    })
  }, [syncCapturedExpenses])

  const currentRoute = isAuthenticated ? routeStack[routeStack.length - 1] : authRoute
  const webViewKey = useMemo(
    () => `main-view-${isAuthenticated ? currentAccount?.id ?? 'user' : 'guest'}`,
    [currentAccount?.id, isAuthenticated],
  )

  const html = useMemo(
    () => buildStitchHtml(currentRoute, currentAccount ?? undefined, currentParams),
    [currentAccount, currentRoute, currentParams],
  )

  function navigate(route: StitchRoute, params?: Record<string, string>) {
    setRouteStack((current) => {
      const active = current[current.length - 1]
      if (mainRoutes.includes(route)) {
        setCurrentParams(params || {})
        return [route]
      }
      if (active === route && JSON.stringify(params) === JSON.stringify(currentParams)) {
        return current
      }
      setCurrentParams(params || {})
      return [...current, route]
    })
  }

  function goBack() {
    setRouteStack((current) => (current.length > 1 ? current.slice(0, -1) : ['dashboard']))
  }

  function resolveCategoryId(label: string, type: 'expense' | 'income') {
    if (!currentAccount) {
      return ''
    }
    const lower = label.toLowerCase()
    const match = currentAccount.categories.find((category) => {
      if (category.type !== type) {
        return false
      }
      const name = category.name.toLowerCase()
      return name.includes(lower) || lower.includes(name)
    })
    return match?.id ?? currentAccount.categories.find((category) => category.type === type)?.id ?? ''
  }

  async function handleNativeGoogleSignIn() {
    const setupMessage = getFirebaseSetupMessage(authPlatform)
    if (setupMessage) {
      Alert.alert('Firebase setup required', setupMessage)
      return
    }

    if (authPlatform !== 'android') {
      Alert.alert('Unsupported platform', 'Google sign-in is currently enabled only for Android.')
      return
    }

    if (!isGoogleAuthConfigured(authPlatform)) {
      Alert.alert('Google sign-in unavailable', 'Google sign-in is not configured yet.')
      return
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const response = await GoogleSignin.signIn()

      if (isCancelledResponse(response)) {
        return
      }

      if (!isSuccessResponse(response)) {
        Alert.alert('Google sign-in failed', 'The sign-in flow did not complete successfully.')
        return
      }

      const idToken = response.data.idToken
      if (!idToken) {
        Alert.alert('Google sign-in failed', 'No ID token was returned. Check that the web client ID is correct.')
        return
      }

      const result = await signInWithGoogleIdToken(idToken)
      if (!result.ok) {
        Alert.alert('Google sign-in failed', result.message)
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            return
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Google Play Services required', 'Google Play Services is unavailable or outdated on this device.')
            return
          default:
            Alert.alert('Google sign-in failed', error.message || 'Please verify your Google client setup.')
            return
        }
      }

      Alert.alert('Google sign-in failed', 'Please verify your Google client setup.')
    }
  }

  async function handlePickProfileAvatar() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo library access to choose a profile picture.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.25,
        base64: true,
      })

      if (result.canceled || !result.assets?.[0]) {
        return
      }

      const asset = result.assets[0]
      if (!asset.base64) {
        Alert.alert('Image not saved', 'Please try selecting the image again.')
        return
      }

      const mimeType = asset.mimeType || 'image/jpeg'
      await updateSettings({
        avatarDataUrl: `data:${mimeType};base64,${asset.base64}`,
      })
    } catch (error) {
      console.warn('Profile avatar picker failed', error)
      Alert.alert('Profile photo failed', 'Could not open the gallery. Please try again.')
    }
  }

  async function handleMessage(raw: string) {
    try {
      const message = JSON.parse(raw) as Record<string, unknown>
      const type = String(message.type ?? '')

      if (type === 'navigate') {
        const route = String(message.route) as StitchRoute
        const params: Record<string, string> = {}
        if (message.id) params.id = String(message.id)
        if (message.params && typeof message.params === 'object' && !Array.isArray(message.params)) {
          Object.entries(message.params as Record<string, unknown>).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params[key] = String(value)
            }
          })
        }
        navigate(route, params)
        return
      }

      if (type === 'back') {
        goBack()
        return
      }

      if (type === 'auth.switch') {
        setAuthRoute(String(message.mode) === 'signup' ? 'signup' : 'signin')
        return
      }

      if (type === 'auth.google') {
        await handleNativeGoogleSignIn()
        return
      }

      if (type === 'signout') {
        if (authPlatform === 'android') {
          try {
            await GoogleSignin.signOut()
          } catch {}
        }
        await signOut()
        setAuthRoute('signin')
        return
      }

      if (type === 'profile.avatar.pick') {
        console.log('[Bridge] profile.avatar.pick')
        await handlePickProfileAvatar()
        return
      }

      if (type === 'transaction.create' && currentAccount) {
        const transactionType = String(message.transactionType) === 'income' ? 'income' : 'expense'
        const categoryId = resolveCategoryId(String(message.category ?? ''), transactionType)
        
        // Optimistic Navigation: Start background task and navigate immediately
        void addTransaction({
          amount: Number(message.amount ?? 0),
          categoryId,
          note: String(message.note ?? ''),
          date: String(message.date ?? new Date().toISOString()),
          type: transactionType,
          paymentMethod: 'UPI',
          recurring: false,
        }).catch(err => {
          Alert.alert('Save Failed', 'Could not save transaction. Please try again.')
          console.error('[Bridge] addTransaction failed:', err)
        })

        setRouteStack(['transactions'])
        return
      }

      if (type === 'transaction.delete') {
        const id = String(message.id ?? '')
        if (!id || id === 'undefined') {
          Alert.alert('Error', 'Missing transaction ID.')
          return
        }
        void deleteTransaction(id).catch(err => {
          Alert.alert('Delete Failed', 'Could not delete transaction.')
          console.error('[Bridge] deleteTransaction failed:', err)
        })
        return
      }

      if (type === 'category.create') {
        const name = String(message.name ?? '').trim()
        if (!name) {
          Alert.alert('Missing name', 'Please enter a category name.')
          return
        }
        
        // Optimistic Navigation
        void addCategory({
          name,
          icon: String(message.icon ?? 'category'),
          color: String(message.color ?? '#1A237E'),
          type: String(message.categoryType ?? 'expense') === 'income' ? 'income' : 'expense',
        }).catch(err => {
          Alert.alert('Save Failed', 'Could not create category.')
          console.error('[Bridge] addCategory failed:', err)
        })

        setRouteStack(['categories'])
        return
      }

      if (type === 'category.update') {
        const id = String(message.id ?? '')
        const name = String(message.name ?? '').trim()
        if (!id || !name) {
          Alert.alert('Error', 'Invalid category data.')
          return
        }
        
        // Optimistic Navigation
        void updateCategory(id, {
          name,
          icon: String(message.icon ?? 'category'),
          color: String(message.color ?? '#1A237E'),
          type: String(message.categoryType ?? 'expense') === 'income' ? 'income' : 'expense',
        }).catch(err => {
          Alert.alert('Update Failed', 'Could not update category.')
          console.error('[Bridge] updateCategory failed:', err)
        })

        setRouteStack(['categories'])
        return
      }

      if (type === 'category.reorder' && message.ids) {
        reorderCategories(message.ids as string[])
        return
      }

      if (type === 'category.delete') {
        const id = String(message.id ?? '')
        console.log('[Bridge] Deleting category:', id)
        if (!id || id === 'undefined') {
          Alert.alert('Error', 'Missing category ID or invalid data.')
          return
        }
        const result = await deleteCategory(id)
        if (!result.ok) {
          Alert.alert('Cannot delete', result.message)
        }
        return
      }

      if (type === 'settings.profile.save') {
        // Optimistic Navigation
        void updateSettings({
          fullName: String(message.fullName ?? ''),
          email: String(message.email ?? ''),
          phoneNumber: String(message.phoneNumber ?? ''),
          dob: String(message.dob ?? ''),
        }).catch(err => {
          Alert.alert('Save Failed', 'Could not update profile.')
          console.error('[Bridge] updateSettings Profile failed:', err)
        })
        goBack()
        return
      }

      if (type === 'settings.budget.save') {
        // Optimistic Navigation
        void updateSettings({
          monthlyBudget: Number(message.monthlyBudget ?? 0),
          categoryBudgets: Array.isArray(message.categoryBudgets)
            ? message.categoryBudgets as Array<{ categoryId: string; amount: number }>
            : undefined,
        }).catch(err => {
          Alert.alert('Save Failed', 'Could not update budget.')
          console.error('[Bridge] updateSettings Budget failed:', err)
        })
        goBack()
        return
      }

      if (type === 'settings.notifications.save') {
        await updateSettings({
          notifications: {
            billReminders: Boolean(message.billReminders),
            weeklyDigest: Boolean(message.weeklyDigest),
            unusualSpendAlerts: Boolean(message.unusualSpendAlerts),
          },
        })
        goBack()
      }
    } catch (error) {
      Alert.alert('Something went wrong', 'The requested action could not be completed.')
      console.warn('Failed to handle Stitch message', error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.webviewWrap}>
          <WebView
            key={webViewKey}
            originWhitelist={['*']}
            source={{ html, baseUrl: 'https://stitch.withgoogle.com' }}
            javaScriptEnabled
            domStorageEnabled
            onLoadStart={() => {}}
            onLoadEnd={() => {}}
            onMessage={(event) => {
              void handleMessage(event.nativeEvent.data)
            }}
            setSupportMultipleWindows={false}
            style={styles.webview}
            containerStyle={{ backgroundColor: '#F5F5F5' }}
            androidLayerType="hardware"
            androidHardwareAccelerationDisabled={false}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webviewWrap: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
})
