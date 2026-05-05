/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Responsive Breakpoint Composable
 *
 *  Usage:
 *    const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint()
 * ═══════════════════════════════════════════════════════════════
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

const breakpoint = ref<Breakpoint>('lg')
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

function calcBreakpoint(w: number): Breakpoint {
  if (w >= 1536) return '2xl'
  if (w >= 1280) return 'xl'
  if (w >= 1024) return 'lg'
  if (w >= 768) return 'md'
  if (w >= 640) return 'sm'
  return 'xs'
}

let initialized = false

export function useBreakpoint() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(true)

  function update() {
    width.value = window.innerWidth
    breakpoint.value = calcBreakpoint(width.value)
    isMobile.value = width.value < 768
    isTablet.value = width.value >= 768 && width.value < 1024
    isDesktop.value = width.value >= 1024
  }

  onMounted(() => {
    update()
    if (!initialized) {
      window.addEventListener('resize', update, { passive: true })
      initialized = true
    }
  })

  onBeforeUnmount(() => {
    // Keep listener alive for app lifetime
  })

  return { breakpoint, width, isMobile, isTablet, isDesktop, BREAKPOINTS }
}
