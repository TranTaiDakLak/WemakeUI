/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — useViewMode
 *  Determines current rendering mode: 'compact' (extension popup)
 *  or 'default' (full web page). Generalizes the existing
 *  `isExtensionView` pattern found throughout the codebase.
 *
 *  Usage:
 *    import { useViewMode } from '@/ui-system/composables'
 *    const { isCompact, isDefault, mode } = useViewMode()
 *
 *    <div :class="isCompact ? 'text-xs' : 'text-sm'">
 * ═══════════════════════════════════════════════════════════════
 */

import { computed, ref } from 'vue'

export type ViewMode = 'compact' | 'default'

const currentMode = ref<ViewMode>('default')

/**
 * Set the global view mode. Call once at app initialization.
 * The WeExtension detects this via chrome.runtime.id check.
 */
export function setViewMode(mode: ViewMode) {
  currentMode.value = mode
}

/**
 * Returns reactive view mode state.
 */
export function useViewMode() {
  const mode = computed(() => currentMode.value)
  const isCompact = computed(() => currentMode.value === 'compact')
  const isDefault = computed(() => currentMode.value === 'default')

  return {
    mode,
    isCompact,
    isDefault,
    setViewMode,
  }
}
