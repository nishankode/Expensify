import type { Account } from './types'
import { getRouteConfig } from './bridge/routeConfig'
import { inject } from './bridge/inject'
import { DEFAULT_COMIC_AVATAR } from './lib/avatars'

export type { StitchRoute } from './bridge/routes'
import type { StitchRoute } from './bridge/routes'

function resolveAvatarUrl(account?: Account) {
  const avatarUrl = String(account?.settings.avatarDataUrl || '').trim()
  if (!avatarUrl) {
    return DEFAULT_COMIC_AVATAR
  }

  // Large inline avatars can make WebView HTML updates unstable on Android.
  if (avatarUrl.startsWith('data:') && avatarUrl.length > 250_000) {
    return DEFAULT_COMIC_AVATAR
  }

  return avatarUrl
}

export function buildStitchHtml(route: StitchRoute, account?: Account, params?: Record<string, string>) {
  const config = getRouteConfig(route)
  const routePayload = config.payload ? config.payload(account, params) : {}
  const payload = {
    fullName: account?.settings.fullName ?? '',
    email: account?.settings.email ?? '',
    avatarUrl: resolveAvatarUrl(account),
    routeParams: params ?? {},
    ...(routePayload ?? {}),
  }
  return inject(
    config.html,
    config.script(),
    payload,
  )
}
