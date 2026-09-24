import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

/**
 * Loads the plugin's client half the way the Harness module loader does and
 * captures what `apply` registers, so the slot contract can be asserted without
 * a browser.
 */
function loadClient() {
  let client
  const source = readFileSync(
    new URL('../packages/dsh-desktop-data-location/client.js', import.meta.url),
    'utf8'
  )
  runInNewContext(source, {
    window: {
      __ModuleLoader__: {
        load(entry) {
          client = entry.factory(createRequire(import.meta.url))
        }
      }
    },
    document: {
      getElementById: () => null,
      createElement: () => ({ id: '', dataset: {}, style: {}, textContent: '' }),
      head: { appendChild() {} }
    }
  })
  return client
}

function applyAndCapture() {
  const client = loadClient()
  let dictionaries
  let registration
  client.apply({
    effect(callback) {
      callback()
    },
    locale: {
      register(_namespace, next) {
        dictionaries = next
      },
      bind: () => (key) => key
    },
    slots: {
      inject(_name, callback) {
        callback()
      },
      register(options) {
        registration = options
      }
    }
  })
  return { client, dictionaries, registration }
}

describe('data directory settings section', () => {
  it('registers one settings section and no other slot', () => {
    const { registration } = applyAndCapture()

    expect(registration).toMatchObject({
      name: 'settings.section',
      id: 'data-location',
      locale: 'settings.desktopDataLocation'
    })
    // After General (0) and the market placeholder (40) so the ordering stays
    // stable no matter which rows are composed.
    expect(registration.order).toBe(45)
  })

  it('injects only the slots and locale services it uses', () => {
    const { client } = applyAndCapture()

    expect(client.inject).toEqual(['slots', 'locale'])
  })

  it('keeps the zh and en dictionaries in step', () => {
    const { dictionaries } = applyAndCapture()

    const en = Object.keys(dictionaries.en).sort()
    const zh = Object.keys(dictionaries.zh).sort()

    // The project requires both languages in the same change; a key present in
    // only one is treated as an incomplete translation, not a fallback.
    expect(zh).toEqual(en)
    expect(en.length).toBeGreaterThan(0)
  })

  it('covers every failure reason the main process can report', () => {
    const { dictionaries } = applyAndCapture()
    const reasons = ['not-absolute', 'create-failed', 'not-a-directory', 'not-writable']

    const source = readFileSync(
      new URL('../packages/dsh-desktop-data-location/client.js', import.meta.url),
      'utf8'
    )
    for (const reason of reasons) {
      // Each reason has to map to a translated sentence, otherwise the UI would
      // surface a raw code when a directory cannot be used.
      expect(source).toContain(`'${reason}':`)
    }
    expect(Object.keys(dictionaries.en).length).toBeGreaterThan(reasons.length)
  })

  it('namespaces its styles so they cannot leak into other plugins', () => {
    const source = readFileSync(
      new URL('../packages/dsh-desktop-data-location/client.js', import.meta.url),
      'utf8'
    )

    const classNames = [...source.matchAll(/\.([a-zA-Z][a-zA-Z0-9]*)\{/g)].map((match) => match[1])
    expect(classNames.length).toBeGreaterThan(0)
    for (const name of classNames) {
      expect(name.startsWith('dshDesktopDataLocation')).toBe(true)
    }
  })
})
