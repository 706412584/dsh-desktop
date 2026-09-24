/**
 * Contract between the main process and the settings UI for relocating the
 * application data directory.
 *
 * Failure reasons travel as codes rather than sentences so the renderer
 * localizes them through its own dictionaries; the main process has no business
 * choosing the UI language.
 */
export const dataLocationFailureReasons = [
  'not-absolute',
  'create-failed',
  'not-a-directory',
  'not-writable'
] as const

export type DataLocationFailureReason = (typeof dataLocationFailureReasons)[number]

export interface DataLocationSnapshot {
  /** Directory `userData` currently resolves to. */
  currentPath: string
  /** Directory used when no custom location is configured. */
  defaultPath: string
  /** Whether a custom location is in effect for this launch. */
  custom: boolean
  /**
   * Set when a configured location could not be used and the default directory
   * was substituted, so the UI can explain why the setting appears ignored.
   */
  warning?: {
    configuredPath: string
    reason: DataLocationFailureReason
  }
}

export type DataLocationChoice =
  | { status: 'cancelled' }
  | { status: 'unchanged'; snapshot: DataLocationSnapshot }
  | { status: 'saved'; snapshot: DataLocationSnapshot; restartRequired: true }
  | { status: 'invalid'; reason: DataLocationFailureReason }
