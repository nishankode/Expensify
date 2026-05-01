import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from 'firebase/app'
import {
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth'
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

type FirebaseEnv = {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
  androidClientId?: string
  iosClientId?: string
  webClientId?: string
}

type SupportedPlatform = 'android' | 'ios' | 'web'

function isMissingValue(value?: string) {
  if (!value) {
    return true
  }

  const normalized = value.trim().toLowerCase()
  return (
    normalized.length === 0 ||
    normalized.includes('your-') ||
    normalized.includes('placeholder')
  )
}

const firebaseEnv: FirebaseEnv = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  androidClientId: process.env.EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
}

export const missingFirebaseConfigKeys = [
  ['EXPO_PUBLIC_FIREBASE_API_KEY', firebaseEnv.apiKey],
  ['EXPO_PUBLIC_FIREBASE_PROJECT_ID', firebaseEnv.projectId],
  ['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', firebaseEnv.messagingSenderId],
  ['EXPO_PUBLIC_FIREBASE_APP_ID', firebaseEnv.appId],
]
  .filter(([, value]) => isMissingValue(value))
  .map(([key]) => key)

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0

const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseEnv.apiKey ?? '',
  authDomain: firebaseEnv.authDomain,
  projectId: firebaseEnv.projectId ?? '',
  storageBucket: firebaseEnv.storageBucket,
  messagingSenderId: firebaseEnv.messagingSenderId ?? '',
  appId: firebaseEnv.appId ?? '',
}

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

if (app) {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  })

  try {
    dbInstance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    })
  } catch {
    dbInstance = getFirestore(app)
  }
}

export const auth = authInstance
export const db = dbInstance

function getMissingGoogleClientIdKeys(platform: SupportedPlatform) {
  const keys = (() => {
    switch (platform) {
      case 'android':
        return [['EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID', firebaseEnv.webClientId]] as const
      case 'ios':
        return [['EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID', firebaseEnv.iosClientId]] as const
      case 'web':
        return [['EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID', firebaseEnv.webClientId]] as const
    }
  })()

  return keys
    .filter(([, value]) => isMissingValue(value))
    .map(([key]) => key)
}

export function isGoogleAuthConfigured(platform: SupportedPlatform) {
  return getMissingGoogleClientIdKeys(platform).length === 0
}

export function getFirebaseSetupMessage(platform: SupportedPlatform) {
  if (!isFirebaseConfigured) {
    return `Add these Firebase env vars to a .env file: ${missingFirebaseConfigKeys.join(', ')}.`
  }

  const missingGoogleClientIdKeys = getMissingGoogleClientIdKeys(platform)
  if (missingGoogleClientIdKeys.length > 0) {
    return `Add these Google OAuth client IDs to a .env file: ${missingGoogleClientIdKeys.join(', ')}.`
  }

  return ''
}

export function getGoogleNativeWebClientId() {
  return firebaseEnv.webClientId ?? ''
}
