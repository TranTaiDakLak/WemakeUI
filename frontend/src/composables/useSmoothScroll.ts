import Lenis from 'lenis'
import type { LenisOptions } from 'lenis'

/**
 * Cuộn trang có độ trễ mượt (momentum/inertia) — chỉ áp dụng cho scroll của
 * window/document. Các vùng cuộn nội bộ (modal, drawer, dropdown, DataGrid,
 * sidebar…) tự động được bỏ qua qua `prevent`, giữ nguyên cảm giác cuộn
 * native — không cần gắn thủ công vào từng component.
 *
 * Cố ý BỎ QUA prefers-reduced-motion theo mặc định (`lerp` khá cao → gần
 * native, ít rủi ro say chuyển động hơn parallax/slide lớn) — app tiêu thụ có
 * thể tự truyền `lerp` thấp hơn/cao hơn hoặc tự thêm check reduced-motion
 * quanh lời gọi này nếu cần.
 *
 * Dùng trong app (không export qua component nào) — gọi 1 lần lúc bootstrap:
 *
 *   let stop = () => {}
 *   onMounted(() => { stop = useSmoothScroll({ lerp: 0.3 }) })
 *   onUnmounted(() => stop())
 */
function hasNativeScroll(node: HTMLElement): boolean {
  let el: HTMLElement | null = node
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el)
    const scrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight
    const scrollableX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth
    if (scrollableY || scrollableX) return true
    el = el.parentElement
  }
  return false
}

export function useSmoothScroll(options: Partial<LenisOptions> = {}) {
  if (typeof window === 'undefined') return () => {}

  const lenis = new Lenis({
    lerp: 0.3,
    smoothWheel: true,
    syncTouch: false,
    prevent: hasNativeScroll,
    ...options,
  })

  let rafId = 0
  function raf(time: number) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return () => {
    cancelAnimationFrame(rafId)
    lenis.destroy()
  }
}
