import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  DATA_LOCATION_FILENAME,
  bootstrapDirectory,
  clearDataLocationRecord,
  dataLocationFilePath,
  parseDataLocation,
  readDataLocationRecord,
  resolveDataLocation,
  validateDataDirectory,
  writeDataLocationRecord
} from '../src/main/state/data-location'

const temporaryRoots: string[] = []

function temporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'dsh-data-location-'))
  temporaryRoots.push(root)
  return root
}

/**
 * Each case gets its own appData root, so the pointer file for the installed
 * build and the development build never collide across tests.
 */
function bootstrap(development = false): string {
  return bootstrapDirectory(temporaryRoot(), development)
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

describe('data location pointer', () => {
  it('falls back to the bootstrap directory when no pointer exists', () => {
    const dir = bootstrap()
    const resolved = resolveDataLocation(dir)

    expect(resolved.userDataPath).toBe(dir)
    expect(resolved.custom).toBe(false)
    expect(resolved.warning).toBeUndefined()
  })

  it('keeps the pointer inside the bootstrap directory, not the configured one', () => {
    const dir = bootstrap()
    const custom = join(temporaryRoot(), 'elsewhere')

    // The pointer has to live somewhere the app can read before it knows where
    // the data is, otherwise reading the configuration is circular.
    expect(dataLocationFilePath(dir)).toBe(join(dir, DATA_LOCATION_FILENAME))
    expect(dir.endsWith('dsh-desktop')).toBe(true)
    expect(custom).not.toBe(dir)
  })

  it('separates the development bootstrap directory from the installed one', () => {
    const appData = temporaryRoot()

    // A dev session must not read or overwrite the installed app's choice.
    expect(bootstrapDirectory(appData, false)).toBe(join(appData, 'dsh-desktop'))
    expect(bootstrapDirectory(appData, true)).toBe(join(appData, 'dsh-desktop-dev'))
    expect(bootstrapDirectory(appData, false)).not.toBe(bootstrapDirectory(appData, true))
  })

  it('round-trips a configured directory', async () => {
    const dir = bootstrap()
    const custom = join(temporaryRoot(), 'data')

    await writeDataLocationRecord(dir, custom)
    const resolved = resolveDataLocation(dir)

    expect(resolved.userDataPath).toBe(custom)
    expect(resolved.custom).toBe(true)
    expect(resolved.warning).toBeUndefined()
  })

  it('creates the configured directory on first use', async () => {
    const dir = bootstrap()
    const custom = join(temporaryRoot(), 'nested', 'data')

    await writeDataLocationRecord(dir, custom)

    // resolveDataLocation validates, which is what materializes a fresh choice.
    expect(resolveDataLocation(dir).custom).toBe(true)
    expect(validateDataDirectory(custom).ok).toBe(true)
  })

  it('treats the bootstrap directory itself as not custom', async () => {
    const dir = bootstrap()

    await writeDataLocationRecord(dir, dir)

    const resolved = resolveDataLocation(dir)
    expect(resolved.custom).toBe(false)
    expect(resolved.userDataPath).toBe(dir)
  })

  it('clears the pointer so the bootstrap directory is used again', async () => {
    const dir = bootstrap()
    await writeDataLocationRecord(dir, join(temporaryRoot(), 'data'))

    await clearDataLocationRecord(dir)

    expect(readDataLocationRecord(dir)).toBeUndefined()
    expect(resolveDataLocation(dir).custom).toBe(false)
  })

  describe('parseDataLocation', () => {
    it('rejects malformed records rather than throwing', () => {
      expect(parseDataLocation('not json')).toBeUndefined()
      expect(parseDataLocation('null')).toBeUndefined()
      expect(parseDataLocation('[]')).toBeUndefined()
      expect(parseDataLocation('{"version":2,"dataDir":"E:\\\\x"}')).toBeUndefined()
      expect(parseDataLocation('{"version":1}')).toBeUndefined()
      expect(parseDataLocation('{"version":1,"dataDir":42}')).toBeUndefined()
      expect(parseDataLocation('{"version":1,"dataDir":"   "}')).toBeUndefined()
    })

    it('rejects a relative path', () => {
      expect(parseDataLocation('{"version":1,"dataDir":"relative\\\\data"}')).toBeUndefined()
    })

    it('accepts and trims an absolute path', () => {
      const absolute = join(temporaryRoot(), 'data')
      const parsed = parseDataLocation(JSON.stringify({ version: 1, dataDir: `  ${absolute}  ` }))
      expect(parsed?.dataDir).toBe(absolute)
    })
  })

  describe('validateDataDirectory', () => {
    it('rejects a relative path', () => {
      expect(validateDataDirectory('relative\\path')).toEqual({ ok: false, reason: 'not-absolute' })
    })

    it('rejects a file', () => {
      const root = temporaryRoot()
      const file = join(root, 'a-file.txt')
      writeFileSync(file, 'x', 'utf8')
      expect(validateDataDirectory(file)).toEqual({ ok: false, reason: 'not-a-directory' })
    })

    it('accepts an existing directory', () => {
      const root = temporaryRoot()
      expect(validateDataDirectory(root)).toEqual({ ok: true, path: root })
    })
  })

  it('falls back with a warning when the configured directory is unusable', async () => {
    const dir = bootstrap()
    const unusable = join(temporaryRoot(), 'a-file.txt')
    writeFileSync(unusable, 'x', 'utf8')

    // Written directly: writeDataLocationRecord resolves the path but does not
    // validate it, which is what lets a later failure be reported instead of
    // being rejected at write time.
    mkdirSync(dir, { recursive: true })
    writeFileSync(dataLocationFilePath(dir), JSON.stringify({ version: 1, dataDir: unusable }), 'utf8')

    const resolved = resolveDataLocation(dir)

    expect(resolved.custom).toBe(false)
    expect(resolved.userDataPath).toBe(dir)
    expect(resolved.warning).toEqual({ configuredPath: unusable, failure: 'not-a-directory' })
  })

  it('writes atomically and leaves no temporary file behind', async () => {
    const dir = bootstrap()
    await writeDataLocationRecord(dir, join(temporaryRoot(), 'data'))

    const contents = JSON.parse(readFileSync(dataLocationFilePath(dir), 'utf8'))
    expect(contents).toMatchObject({ version: 1 })
    expect(contents.dataDir).toBeTypeOf('string')

    const leftovers = readdirSync(dir).filter((name) => name.endsWith('.tmp'))
    expect(leftovers).toEqual([])
  })
})
