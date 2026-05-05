import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * useHoverable — phát hiện thiết bị có hỗ trợ hover hay không (touch vs pointer).
 *
 * desktop / pointer chuột: hoverable = true
 * mobile / touch only:     hoverable = false
 *
 * Dùng để swap UI: tooltip → long-press popover, kebab menu hover-only → luôn visible touch.
 */
export function useHoverable() {
  const hoverable = ref(true)

  let mq: MediaQueryList | null = null
  function update() {
    if (!mq) return
    hoverable.value = mq.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    hoverable.value = mq.matches
    if (mq.addEventListener) mq.addEventListener('change', update)
    else mq.addListener?.(update)
  })

  onBeforeUnmount(() => {
    if (!mq) return
    if (mq.removeEventListener) mq.removeEventListener('change', update)
    else mq.removeListener?.(update)
    mq = null
  })

  return { hoverable }
}
