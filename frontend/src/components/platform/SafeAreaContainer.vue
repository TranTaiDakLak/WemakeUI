<script setup lang="ts">
/**
 * SafeAreaContainer — bù safe-area cho mobile / desktop wrapper.
 * Phase 3 — layout shells (mobile pattern).
 *
 * dùng `env(safe-area-inset-*)` (iOS notch / Android nav bar / Wails titlebar zone).
 * có thể chỉ định cạnh nào cần bù qua prop `edges`.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** cạnh cần bù safe-area. mặc định 'all' */
  edges?: 'all' | 'top' | 'bottom' | 'horizontal' | 'vertical' | Array<'top' | 'bottom' | 'left' | 'right'>
  /** padding base cộng thêm vào safe-area (px hoặc token) */
  padding?: string | number
  /** element type */
  as?: keyof HTMLElementTagNameMap
  /** flex layout */
  flex?: boolean
  /** scroll y bên trong */
  scrollY?: boolean
}>(), {
  edges: 'all',
  padding: 0,
  as: 'div',
  flex: false,
  scrollY: false,
})

function pad(side: 'top' | 'bottom' | 'left' | 'right'): string {
  const base = typeof props.padding === 'number' ? `${props.padding}px` : (props.padding || '0px')
  return `calc(${base} + env(safe-area-inset-${side}, 0px))`
}

const styles = computed<Record<string, string>>(() => {
  const e = props.edges
  const arr: Array<'top' | 'bottom' | 'left' | 'right'> = (() => {
    if (Array.isArray(e)) return e
    if (e === 'all') return ['top', 'bottom', 'left', 'right']
    if (e === 'top') return ['top']
    if (e === 'bottom') return ['bottom']
    if (e === 'horizontal') return ['left', 'right']
    if (e === 'vertical') return ['top', 'bottom']
    return []
  })()

  const out: Record<string, string> = {}
  if (arr.includes('top')) out.paddingTop = pad('top')
  if (arr.includes('bottom')) out.paddingBottom = pad('bottom')
  if (arr.includes('left')) out.paddingLeft = pad('left')
  if (arr.includes('right')) out.paddingRight = pad('right')
  return out
})
</script>

<template>
  <component
    :is="as"
    class="wx-safe-area"
    :class="{ 'wx-safe-area--flex': flex, 'wx-safe-area--scroll': scrollY }"
    :style="styles"
    data-part="root"
  >
    <slot />
  </component>
</template>

<style scoped>
.wx-safe-area {
  box-sizing: border-box;
}
.wx-safe-area--flex {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.wx-safe-area--scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
