/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — useCopyClipboard
 *  Reusable clipboard copy with auto-reset feedback state.
 *
 *  Usage:
 *    import { useCopyClipboard } from '@/ui-system/composables'
 *    const { copy, copied } = useCopyClipboard()
 *
 *    <button @click="copy(text)">
 *      {{ copied ? 'Copied!' : 'Copy' }}
 *    </button>
 * ═══════════════════════════════════════════════════════════════
 */

import { ref } from 'vue'

export function useCopyClipboard(resetDelay = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, resetDelay)

      return true
    } catch {
      copied.value = false
      return false
    }
  }

  return { copy, copied }
}
