import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { createId, createInitialAccountData } from '../lib/finance'
import { auth, db, isFirebaseConfigured } from '../lib/firebase'
import type {
  Account,
  Category,
  CategoryDraft,
  Transaction,
  TransactionDraft,
  UserDocument,
  UserSettings,
} from '../types'

type AppContextValue = {
  currentAccount: Account | null
  isAuthenticated: boolean
  isReady: boolean
  signInWithGoogleIdToken: (idToken: string) => Promise<{ ok: boolean; message: string }>
  signOut: () => Promise<void>
  addTransaction: (draft: TransactionDraft) => Promise<void>
  updateTransaction: (transactionId: string, draft: TransactionDraft) => Promise<void>
  deleteTransaction: (transactionId: string) => Promise<void>
  addCategory: (draft: CategoryDraft) => Promise<void>
  updateCategory: (categoryId: string, draft: CategoryDraft) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<{ ok: boolean; message: string }>
  reorderCategories: (orderedIds: string[]) => Promise<void>
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error && 'code' in error && typeof error.code === 'string') {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Google sign-in failed because the returned credential was invalid.'
      case 'auth/user-disabled':
        return 'This Firebase user has been disabled.'
      case 'permission-denied':
        return 'Firestore rejected the request. Check your Firebase security rules.'
      default:
        break
    }
  }

  if (typeof error === 'object' && error && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return fallback
}

async function ensureUserBootstrap(user: User) {
  if (!db) {
    throw new Error('Firebase Firestore is not configured.')
  }

  const fullName = user.displayName?.trim() || user.email?.split('@')[0] || 'Xpensify User'
  const email = user.email ?? ''
  const seed = createInitialAccountData(fullName, email)
  const userRef = doc(db, 'users', user.uid)
  const categoriesRef = collection(userRef, 'categories')
  const transactionsRef = collection(userRef, 'transactions')

  const [userSnap, categoriesSnap, transactionsSnap] = await Promise.all([
    getDoc(userRef),
    getDocs(query(categoriesRef, limit(1))),
    getDocs(query(transactionsRef, limit(1))),
  ])

  const batch = writeBatch(db)

  if (!userSnap.exists()) {
    batch.set(userRef, {
      createdAt: seed.createdAt,
      settings: seed.settings,
      updatedAt: serverTimestamp(),
    })
  } else {
    const current = userSnap.data() as Partial<UserDocument>
    batch.set(
      userRef,
      {
        settings: {
          ...seed.settings,
          ...current.settings,
          email,
          budgetConfigured: current.settings?.budgetConfigured ?? false,
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  }

  if (categoriesSnap.empty) {
    for (const category of seed.categories) {
      batch.set(doc(categoriesRef, category.id), {
        ...category,
        createdAt: serverTimestamp(),
      })
    }
  }

  if (transactionsSnap.empty) {
    for (const transaction of seed.transactions) {
      batch.set(doc(transactionsRef, transaction.id), {
        ...transaction,
        createdAt: serverTimestamp(),
      })
    }
  }

  await batch.commit()
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured)
  const [dataReady, setDataReady] = useState(!isFirebaseConfigured)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null)
  const [categories, setCategories] = useState<Account['categories']>([])
  const [transactions, setTransactions] = useState<Account['transactions']>([])

  useEffect(() => {
    if (!auth) {
      setAuthReady(true)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      setAuthReady(true)
      if (!user) {
        setUserDoc(null)
        setCategories([])
        setTransactions([])
        setDataReady(true)
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!firebaseUser || !db) {
      if (authReady) {
        setDataReady(true)
      }
      return
    }

    setDataReady(false)

    let cancelled = false
    let pendingSnapshots = 3

    function markReady() {
      pendingSnapshots -= 1
      if (!cancelled && pendingSnapshots <= 0) {
        setDataReady(true)
      }
    }

    const userRef = doc(db, 'users', firebaseUser.uid)

    const unsubscribeUser = onSnapshot(
      userRef,
      (snapshot) => {
        setUserDoc(snapshot.exists() ? (snapshot.data() as UserDocument) : null)
        markReady()
      },
      (error) => {
        if (error.code === 'permission-denied') {
          console.warn('User listener: waiting for permissions...')
        } else {
          console.error('User listener failed', error)
        }
        markReady()
      },
    )

    const unsubscribeCategories = onSnapshot(
      collection(userRef, 'categories'),
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as any) } as Category))
        
        // Sort by 'order' if it exists, otherwise fallback to 'name'
        items.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
          }
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return a.name.localeCompare(b.name)
        })

        setCategories(items)
        markReady()
      },
      (error) => {
        if (error.code === 'permission-denied') {
          console.warn('Categories listener: waiting for permissions...')
          markReady()
        } else {
          console.error('Categories listener failed', error)
          markReady()
        }
      },
    )

    const unsubscribeTransactions = onSnapshot(
      query(collection(userRef, 'transactions'), orderBy('date', 'desc')),
      (snapshot) => {
        setTransactions(
          snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as any) } as Transaction)),
        )
        markReady()
      },
      (error) => {
        if (error.code === 'permission-denied') {
          console.warn('Transactions listener: waiting for permissions...')
        } else {
          console.error('Transactions listener failed', error)
        }
        markReady()
      },
    )

    return () => {
      cancelled = true
      unsubscribeUser()
      unsubscribeCategories()
      unsubscribeTransactions()
    }
  }, [authReady, firebaseUser])

  const currentAccount = useMemo<Account | null>(() => {
    if (!firebaseUser || !userDoc) {
      return null
    }

    return {
      id: firebaseUser.uid,
      createdAt: userDoc.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString(),
      settings: {
        ...userDoc.settings,
        budgetConfigured: userDoc.settings.budgetConfigured ?? false,
        email: firebaseUser.email ?? userDoc.settings.email,
      },
      categories,
      transactions,
    }
  }, [categories, firebaseUser, transactions, userDoc])

  const isReady = authReady && (!firebaseUser || dataReady)

  const value = useMemo<AppContextValue>(() => ({
    currentAccount,
    isAuthenticated: Boolean(currentAccount),
    isReady,
    async signInWithGoogleIdToken(idToken) {
      if (!auth) {
        return { ok: false, message: 'Firebase Auth is not configured yet.' }
      }

      try {
        const credential = GoogleAuthProvider.credential(idToken)
        const result = await signInWithCredential(auth, credential)
        await ensureUserBootstrap(result.user)
        return { ok: true, message: 'Signed in successfully.' }
      } catch (error) {
        return {
          ok: false,
          message: getErrorMessage(error, 'Google sign-in failed.'),
        }
      }
    },
    async signOut() {
      if (!auth) {
        return
      }
      await firebaseSignOut(auth)
    },
    async addTransaction(draft) {
      if (!currentAccount || !db) {
        return
      }

      const transactionId = createId()
      await setDoc(doc(db, 'users', currentAccount.id, 'transactions', transactionId), {
        ...draft,
        id: transactionId,
        updatedAt: serverTimestamp(),
      })
    },
    async updateTransaction(transactionId, draft) {
      if (!currentAccount || !db) {
        return
      }

      await updateDoc(doc(db, 'users', currentAccount.id, 'transactions', transactionId), {
        ...draft,
        updatedAt: serverTimestamp(),
      })
    },
    async deleteTransaction(transactionId) {
      if (!currentAccount || !db) {
        return
      }

      await deleteDoc(doc(db, 'users', currentAccount.id, 'transactions', transactionId))
    },
    async addCategory(draft) {
      if (!currentAccount || !db) {
        return
      }

      const categoryId = createId()
      await setDoc(doc(db, 'users', currentAccount.id, 'categories', categoryId), {
        ...draft,
        id: categoryId,
        order: currentAccount.categories.length,
        updatedAt: serverTimestamp(),
      })
    },
    async updateCategory(categoryId, draft) {
      if (!currentAccount || !db) {
        return
      }

      await updateDoc(doc(db, 'users', currentAccount.id, 'categories', categoryId), {
        ...draft,
        updatedAt: serverTimestamp(),
      })
    },
    async deleteCategory(categoryId) {
      if (!currentAccount) {
        return { ok: false, message: 'No active account.' }
      }

      if (!db) {
        return { ok: false, message: 'Database connection is missing. Please check your internet or Firebase config.' }
      }

      const inUse = currentAccount.transactions.some((tx) => tx.categoryId === categoryId)
      if (inUse) {
        return { ok: false, message: 'This category is used in existing transactions. Either delete those transactions or reassign them first.' }
      }

      try {
        await deleteDoc(doc(db, 'users', currentAccount.id, 'categories', categoryId))
        return { ok: true, message: 'Category deleted.' }
      } catch (error) {
        console.error('Firestore deleteCategory error:', error)
        return { ok: false, message: 'Failed to delete category: ' + (error as Error).message }
      }
    },
    async reorderCategories(orderedIds) {
      if (!currentAccount || !db) return

      try {
        const firestore = db
        const batch = writeBatch(firestore)
        orderedIds.forEach((id, index) => {
          const catRef = doc(firestore, 'users', currentAccount.id, 'categories', id)
          batch.update(catRef, { order: index, updatedAt: serverTimestamp() })
        })
        await batch.commit()
      } catch (error) {
        console.error('Failed to reorder categories:', error)
      }
    },
    async updateSettings(patch) {
      if (!currentAccount || !db) {
        return
      }

      const nextSettings = {
        ...currentAccount.settings,
        ...patch,
        budgetConfigured:
          patch.monthlyBudget !== undefined
            ? true
            : currentAccount.settings.budgetConfigured ?? false,
        email: auth?.currentUser?.email ?? currentAccount.settings.email,
        notifications: {
          ...currentAccount.settings.notifications,
          ...patch.notifications,
        },
      }

      await setDoc(
        doc(db, 'users', currentAccount.id),
        {
          settings: nextSettings,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      if (auth?.currentUser && patch.fullName && patch.fullName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: patch.fullName })
      }
    },
  }), [currentAccount, isReady])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }
  return context
}
