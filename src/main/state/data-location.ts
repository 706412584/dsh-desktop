import { randomUUID } from 'node:crypto'
import { accessSync, constants, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'

/**
 * The directory Electron uses for `userData` when no custom location is
 * configured. Kept lowercase and stable across product-name and branding
 * changes: Harness stores workspaces, sessions, credentials, and custom presets
 * below it, so renaming it would make an ordinary upgrade look like a fresh
 * installation.
 */
export const DEFAULT_BOOTSTRAP_DIRECTORY = 'dsh-desktop'

/** The development build's directory, kept separate from the installed one. */
export const DEVELOPMENT_BOOTSTRAP_DIRECTORY = 'dsh-desktop-dev'

/**
 * Every function here takes the *bootstrap directory* — the default data
 * directory — rather than `appData`. That is where the pointer file lives, and
 * naming it explicitly is what keeps the development build's configuration
 * separate from the installed build's: both resolve under the same `appData`,
 * so an implicit default would let a dev session read and overwrite the
 * installed app's choice.
 */
export const DATA_LOCATION_FILENAME = 'data-location.json'

export interface DataLocationRecord {
  version: 1
  dataDir: string
}

export type DataLocationFailure =
  | 'not-absolute'
  | 'create-failed'
  | 'not-a-directory'
  | 'not-writable'

export interface DataLocationWarning {
  configuredPath: string
  failure: DataLocationFailure
}

export interface ResolvedDataLocation {
  userDataPath: string
  custom: boolean
  warning?: DataLocationWarning
}

/** The bootstrap directory for this launch, on the system drive. */
export function bootstrapDirectory(appDataPath: string, development: boolean): string {
  return join(
    appDataPath,
    development ? DEVELOPMENT_BOOTSTRAP_DIRECTORY : DEFAULT_BOOTSTRAP_DIRECTORY
  )
}

export function dataLocationFilePath(bootstrapDir: string): string {
  return join(bootstrapDir, DATA_LOCATION_FILENAME)
}

/**
 * Windows treats paths case-insensitively, so comparing a stored directory with
 * the bootstrap directory has to fold case there and only there.
 */
function isSamePath(left: string, right: string): boolean {
  const a = resolve(left)
  const b = resolve(right)
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b
}

/**
 * Parses the pointer file. Anything that is not a well-formed record is treated
 * as absent rather than as an error: a truncated or hand-edited file should send
 * the app to the default directory, not prevent it from starting.
 */
export function parseDataLocation(source: string): DataLocationRecord | undefined {
  let parsed: unknown
  try {
    parsed = JSON.parse(source)
  } catch {
    return undefined
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined

  const { version, dataDir } = parsed as { version?: unknown; dataDir?: unknown }
  if (version !== 1 || typeof dataDir !== 'string') return undefined

  const trimmed = dataDir.trim()
  if (trimmed.length === 0 || !isAbsolute(trimmed)) return undefined
  return { version: 1, dataDir: trimmed }
}

export function readDataLocationRecord(bootstrapDir: string): DataLocationRecord | undefined {
  try {
    return parseDataLocation(readFileSync(dataLocationFilePath(bootstrapDir), 'utf8'))
  } catch {
    return undefined
  }
}

/**
 * Checks that a directory can actually be used as `userData`. A path that does
 * not exist yet is created, because choosing a fresh directory is the normal
 * case and refusing it would make the setting unusable.
 */
export function validateDataDirectory(
  candidate: string
): { ok: true; path: string } | { ok: false; reason: DataLocationFailure } {
  const trimmed = candidate.trim()
  if (trimmed.length === 0 || !isAbsolute(trimmed)) return { ok: false, reason: 'not-absolute' }
  const target = resolve(trimmed)

  if (existsSync(target)) {
    let isDirectory = false
    try {
      isDirectory = statSync(target).isDirectory()
    } catch {
      return { ok: false, reason: 'not-a-directory' }
    }
    if (!isDirectory) return { ok: false, reason: 'not-a-directory' }
  } else {
    try {
      mkdirSync(target, { recursive: true })
    } catch {
      return { ok: false, reason: 'create-failed' }
    }
  }

  try {
    accessSync(target, constants.W_OK)
  } catch {
    return { ok: false, reason: 'not-writable' }
  }
  return { ok: true, path: target }
}

/**
 * Resolves the directory to hand to `app.setPath('userData')`.
 *
 * A configured directory that has become unusable (unplugged drive, revoked
 * permission) falls back to the default one but reports why. Falling back
 * silently would present an empty profile and read as data loss; refusing to
 * start would strand the user with no way back to the settings UI.
 */
export function resolveDataLocation(bootstrapDir: string): ResolvedDataLocation {
  const record = readDataLocationRecord(bootstrapDir)
  if (!record) return { userDataPath: bootstrapDir, custom: false }
  if (isSamePath(record.dataDir, bootstrapDir)) return { userDataPath: bootstrapDir, custom: false }

  const validated = validateDataDirectory(record.dataDir)
  if (!validated.ok) {
    return {
      userDataPath: bootstrapDir,
      custom: false,
      warning: { configuredPath: record.dataDir, failure: validated.reason }
    }
  }
  return { userDataPath: validated.path, custom: true }
}

/**
 * Persists the chosen directory. Written to a temporary file and renamed so an
 * interrupted write cannot leave a half-parsed pointer that would send the next
 * launch somewhere unintended.
 */
export async function writeDataLocationRecord(bootstrapDir: string, dataDir: string): Promise<void> {
  const filePath = dataLocationFilePath(bootstrapDir)
  const temporary = `${filePath}.${randomUUID()}.tmp`
  const record: DataLocationRecord = { version: 1, dataDir: resolve(dataDir) }
  await mkdir(bootstrapDir, { recursive: true })
  try {
    await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`, 'utf8')
    await rename(temporary, filePath)
  } finally {
    await rm(temporary, { force: true })
  }
}

/** Drops the pointer so the next launch returns to the default directory. */
export async function clearDataLocationRecord(bootstrapDir: string): Promise<void> {
  await rm(dataLocationFilePath(bootstrapDir), { force: true })
}
