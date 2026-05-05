import { onBeforeUnmount, onMounted } from 'vue'

/**
 * useShortcut — single-shortcut helper với auto map `mod` → `cmd` (mac) / `ctrl` (win/linux).
 * Bổ sung cho `useKeyboard()` (multi-shortcut) — useShortcut tập trung 1 combo + auto cleanup.
 *
 *   useShortcut('mod+k', () => openPalette())
 *   useShortcut('?', () => openHelp(), { allowInInput: false })
 */

export interface ShortcutOptions {
  /** chặn gõ shortcut khi đang focus input/textarea/contenteditable. default true */
  blockInInput?: boolean
  /** chặn gõ khi prop trả false. */
  enabled?: () => boolean
  /** preventDefault sau khi match. default true */
  preventDefault?: boolean
}

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform)

function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false
  if (t.isContentEditable) return true
  const tag = t.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return false
}

interface ParsedCombo {
  ctrl: boolean
  meta: boolean
  shift: boolean
  alt: boolean
  key: string
}

function parse(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim())
  const out: ParsedCombo = { ctrl: false, meta: false, shift: false, alt: false, key: '' }
  for (const p of parts) {
    if (p === 'mod') {
      if (isMac) out.meta = true
      else out.ctrl = true
    } else if (p === 'ctrl') out.ctrl = true
    else if (p === 'cmd' || p === 'meta') out.meta = true
    else if (p === 'shift') out.shift = true
    else if (p === 'alt' || p === 'option') out.alt = true
    else out.key = p
  }
  return out
}

function matches(e: KeyboardEvent, p: ParsedCombo): boolean {
  if (p.ctrl !== e.ctrlKey) return false
  if (p.meta !== e.metaKey) return false
  if (p.shift !== e.shiftKey) return false
  if (p.alt !== e.altKey) return false
  const k = e.key.toLowerCase()
  return k === p.key || e.code.toLowerCase() === p.key
}

export function useShortcut(
  combo: string,
  handler: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {},
) {
  const { blockInInput = true, enabled, preventDefault = true } = options
  const parsed = parse(combo)

  function onKey(e: KeyboardEvent) {
    if (enabled && !enabled()) return
    if (blockInInput && isEditableTarget(e.target)) {
      // cho phép esc và mod+key thoát qua
      if (!parsed.ctrl && !parsed.meta && parsed.key !== 'escape') return
    }
    if (!matches(e, parsed)) return
    if (preventDefault) e.preventDefault()
    handler(e)
  }

  onMounted(() => document.addEventListener('keydown', onKey))
  onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

  return {
    /** mô tả shortcut hiển thị cho user (vd "⌘ K" hoặc "Ctrl K") */
    label: formatLabel(parsed),
  }
}

function formatLabel(p: ParsedCombo): string {
  const parts: string[] = []
  if (p.meta) parts.push(isMac ? '⌘' : 'Win')
  if (p.ctrl) parts.push(isMac ? '⌃' : 'Ctrl')
  if (p.alt) parts.push(isMac ? '⌥' : 'Alt')
  if (p.shift) parts.push(isMac ? '⇧' : 'Shift')
  if (p.key) parts.push(p.key.length === 1 ? p.key.toUpperCase() : p.key)
  return parts.join(isMac ? '' : '+')
}
