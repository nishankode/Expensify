import { stitchHtml } from '../stitchHtml'
import type { Account } from '../types'
import { addCategoryScript, addExpenseScript } from './scripts/actionScreens'
import { analyticsScript } from './scripts/analytics'
import { authScript } from './scripts/auth'
import { categoriesScript } from './scripts/categories'
import { dashboardScript } from './scripts/dashboard'
import { profileScript } from './scripts/profile'
import { budgetScript, helpSupportScript, notificationsScript, personalInfoScript } from './scripts/settings'
import { sharedScript } from './scripts/shared'
import { transactionsScript } from './scripts/transactions'
import type { StitchRoute } from './routes'
import { buildAddExpensePayload } from './payloads/addExpense'
import { buildAnalyticsPayload } from './payloads/analytics'
import { buildEditCategoryPayload, buildCategoriesPayload } from './payloads/categories'
import { buildDashboardPayload } from './payloads/dashboard'
import { buildBudgetPayload, buildNotificationsPayload, buildProfilePayload } from './payloads/settings'
import { buildTransactionsPayload } from './payloads/transactions'

type RouteConfig = {
  html: string
  script: () => string
  payload?: (account?: Account, params?: Record<string, string>) => unknown
}

const routeConfig: Record<StitchRoute, RouteConfig> = {
  signin: {
    html: stitchHtml.signIn,
    script: () => authScript('signin'),
  },
  signup: {
    html: stitchHtml.signUp,
    script: () => authScript('signup'),
  },
  dashboard: {
    html: stitchHtml.dashboard,
    script: dashboardScript,
    payload: buildDashboardPayload,
  },
  transactions: {
    html: stitchHtml.transactions,
    script: transactionsScript,
    payload: buildTransactionsPayload,
  },
  analytics: {
    html: stitchHtml.analytics,
    script: analyticsScript,
    payload: buildAnalyticsPayload,
  },
  addExpense: {
    html: stitchHtml.addExpense,
    script: addExpenseScript,
    payload: buildAddExpensePayload,
  },
  profile: {
    html: stitchHtml.profile,
    script: profileScript,
    payload: buildProfilePayload,
  },
  categories: {
    html: stitchHtml.categories,
    script: categoriesScript,
    payload: buildCategoriesPayload,
  },
  addCategory: {
    html: stitchHtml.addCategory,
    script: addCategoryScript,
  },
  editCategory: {
    html: stitchHtml.addCategory,
    script: addCategoryScript,
    payload: buildEditCategoryPayload as any,
  },
  personalInfo: {
    html: stitchHtml.personalInfo,
    script: personalInfoScript,
    payload: buildProfilePayload,
  },
  budget: {
    html: stitchHtml.budget,
    script: budgetScript,
    payload: buildBudgetPayload,
  },
  notifications: {
    html: stitchHtml.notifications,
    script: notificationsScript,
    payload: buildNotificationsPayload,
  },
  helpSupport: {
    html: stitchHtml.helpSupport,
    script: helpSupportScript,
    payload: buildProfilePayload,
  },
  welcome: {
    html: stitchHtml.welcome,
    script: sharedScript,
  },
}

export function getRouteConfig(route: StitchRoute) {
  return routeConfig[route] ?? routeConfig.dashboard
}
