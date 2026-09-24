/**
 * Host half for the browser-only data-directory settings section.
 *
 * Relocating `userData` is a main-process decision: Electron fixes the path
 * before the Harness process starts, and `app.setPath` is only callable there.
 * The section therefore reads and writes through the desktop's preload bridge
 * rather than through this package, so the host half has nothing to register.
 */
export function apply() {}
