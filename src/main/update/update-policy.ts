export const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1_000
export const UPDATE_STARTUP_DELAY_MS = 15_000
export const UPDATE_STARTUP_JITTER_MS = 15_000
export const AUTO_INSTALL_ON_APP_QUIT = false

export function supportsAutoUpdates(isPackaged: boolean, platform: NodeJS.Platform): boolean {
  return isPackaged && (platform === 'darwin' || platform === 'win32')
}

/**
 * Whether this build may talk to the upstream update feed.
 *
 * The feed URLs are compiled in, so a locally built copy would otherwise offer
 * to install the official release and replace the local changes with it. A
 * build that declares `dshDesktopUpdateFeed: "disabled"` stays quiet instead:
 * no startup check, no interval, and a manual check reports that this build
 * does not take upstream updates rather than failing obscurely.
 *
 * The default is enabled, so an ordinary upstream build is unaffected and a
 * missing or malformed marker never silently disables a user's updates.
 */
export function updatesEnabledForBuild(metadata: unknown): boolean {
  if (metadata === null || typeof metadata !== 'object') return true
  return (metadata as { dshDesktopUpdateFeed?: unknown }).dshDesktopUpdateFeed !== 'disabled'
}

export function shouldCheckAfterResume(lastCheckedAt: number, now = Date.now()): boolean {
  return now - lastCheckedAt >= UPDATE_CHECK_INTERVAL_MS
}
