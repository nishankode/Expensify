import { signUp } from './templates/auth/signUp'
import { signIn } from './templates/auth/signIn'
import { welcome } from './templates/main/welcome'
import { dashboard } from './templates/main/dashboard'
import { transactions } from './templates/main/transactions'
import { analytics } from './templates/main/analytics'
import { profile } from './templates/main/profile'
import { categories } from './templates/main/categories'
import { addExpense } from './templates/actions/addExpense'
import { addCategory } from './templates/actions/addCategory'
import { categoryPopup } from './templates/actions/categoryPopup'
import { personalInfo } from './templates/settings/personalInfo'
import { budget } from './templates/settings/budget'
import { notifications } from './templates/settings/notifications'
import { helpSupport } from './templates/settings/helpSupport'

export const stitchHtml = {
  signUp,
  signIn,
  welcome,
  dashboard,
  transactions,
  analytics,
  profile,
  categories,
  addExpense,
  addCategory,
  categoryPopup,
  personalInfo,
  budget,
  notifications,
  helpSupport,
} as const;
