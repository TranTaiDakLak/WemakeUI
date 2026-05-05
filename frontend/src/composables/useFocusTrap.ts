import { onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.tabIndex !== -1 &&
      (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement),
  )
}

export interface UseFocusTrapOptions {
  /** auto focus phần tử focusable đầu tiên khi active. default true */
  autoFocus?: boolean
  /** restore focus về trigger khi inactive. default true */
  restoreFocus?: boolean
  /** esc đóng → emit qua callback (không tự đóng) */
  onEscape?: () => void
}

/**
 * useFocusTrap — giữ focus trong phạm vi 1 element (modal / drawer / palette).
 * Pass ref tới HTMLElement + ref boolean active. Khi active → trap; khi inactive → restore.
 */
export function useFocusTrap(
  rootRef: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  options: UseFocusTrapOptions = {},
) {
  const { autoFocus = true, restoreFocus = true, onEscape } = options
  let previouslyFocused: HTMLElement | null = null

  function onKeydown(e: KeyboardEvent) {
    if (!rootRef.value) return
    if (e.key === 'Escape' && onEscape) {
      onEscape()
      return
    }
    if (e.key !== 'Tab') return
    const items = getFocusable(rootRef.value)
    if (items.length === 0) {
      e.preventDefault()
      rootRef.value.focus()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    const current = document.activeElement as HTMLElement | null
    if (e.shiftKey) {
      if (current === first || !rootRef.value.contains(current)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (current === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function activate() {
    if (!rootRef.value) return
    previouslyFocused = (document.activeElement as HTMLElement) ?? null
    document.addEventListener('keydown', onKeydown, true)
    if (autoFocus) {
      const items = getFocusable(rootRef.value)
      if (items.length) items[0].focus()
      else {
        rootRef.value.tabIndex = -1
        rootRef.value.focus()
      }
    }
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown, true)
    if (restoreFocus && previouslyFocused) {
      previouslyFocused.focus?.()
    }
    previouslyFocused = null
  }

  watch(
    active,
    (v) => {
      if (v) activate()
      else deactivate()
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => deactivate())

  return { activate, deactivate }
}
