import { onMounted, onBeforeUnmount } from 'vue'

type KeyHandler = (e: KeyboardEvent) => void

interface ShortcutEntry {
  combo: string
  handler: KeyHandler
}

const globalShortcuts: ShortcutEntry[] = []
let listenerAttached = false

function normalizeCombo(combo: string): string {
  return combo
    .toLowerCase()
    .split('+')
    .map(k => k.trim())
    .sort()
    .join('+')
}

function matchesCombo(e: KeyboardEvent, combo: string): boolean {
  const parts = combo.split('+')
  const needCtrl = parts.includes('ctrl') || parts.includes('meta')
  const needShift = parts.includes('shift')
  const needAlt = parts.includes('alt')
  const key = parts.find(p => !['ctrl', 'meta', 'shift', 'alt'].includes(p)) ?? ''

  if (needCtrl && !(e.ctrlKey || e.metaKey)) return false
  if (!needCtrl && (e.ctrlKey || e.metaKey)) return false
  if (needShift && !e.shiftKey) return false
  if (!needShift && e.shiftKey) return false
  if (needAlt && !e.altKey) return false
  if (!needAlt && e.altKey) return false

  return e.key.toLowerCase() === key || e.code.toLowerCase() === key
}

function globalHandler(e: KeyboardEvent) {
  for (const entry of globalShortcuts) {
    if (matchesCombo(e, entry.combo)) {
      entry.handler(e)
    }
  }
}

function attachGlobalListener() {
  if (!listenerAttached) {
    document.addEventListener('keydown', globalHandler)
    listenerAttached = true
  }
}

function detachIfEmpty() {
  if (globalShortcuts.length === 0 && listenerAttached) {
    document.removeEventListener('keydown', globalHandler)
    listenerAttached = false
  }
}

export function useKeyboard() {
  const localEntries: ShortcutEntry[] = []

  function registerShortcut(combo: string, handler: KeyHandler) {
    const normalized = normalizeCombo(combo)
    const entry: ShortcutEntry = { combo: normalized, handler }
    globalShortcuts.push(entry)
    localEntries.push(entry)
    attachGlobalListener()
  }

  function unregisterShortcut(combo: string) {
    const normalized = normalizeCombo(combo)
    // Remove from global
    for (let i = globalShortcuts.length - 1; i >= 0; i--) {
      if (globalShortcuts[i].combo === normalized) {
        globalShortcuts.splice(i, 1)
      }
    }
    // Remove from local
    for (let i = localEntries.length - 1; i >= 0; i--) {
      if (localEntries[i].combo === normalized) {
        localEntries.splice(i, 1)
      }
    }
    detachIfEmpty()
  }

  // Auto cleanup on component unmount
  onMounted(() => attachGlobalListener())
  onBeforeUnmount(() => {
    for (const entry of localEntries) {
      const idx = globalShortcuts.indexOf(entry)
      if (idx !== -1) globalShortcuts.splice(idx, 1)
    }
    localEntries.length = 0
    detachIfEmpty()
  })

  return { registerShortcut, unregisterShortcut }
}
