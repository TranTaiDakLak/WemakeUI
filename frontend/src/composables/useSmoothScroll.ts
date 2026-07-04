import Lenis from 'lenis'
import type { LenisOptions } from 'lenis'

/**
 * Cuộn có độ trễ mượt (momentum/inertia) — mặc định điều khiển scroll của
 * window/document, hoặc 1 phần tử cụ thể nếu truyền `wrapper` (dùng cho các
 * shell có vùng cuộn nội bộ riêng, ví dụ AppShell.vue). Các vùng cuộn nội bộ
 * lồng bên trong `wrapper` (modal, drawer, dropdown, DataGrid…) tự động được
 * bỏ qua qua `prevent`, giữ nguyên cảm giác cuộn native — không cần gắn thủ
 * công vào từng component.
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
 *
 * Hoặc scoped vào 1 phần tử cuộn riêng (vd AppShell's `.wx-shell__main`):
 *
 *   onMounted(() => { stop = useSmoothScroll({ wrapper: mainEl.value, content: contentEl.value }) })
 */
function makePrevent(root: Element) {
  return (node: HTMLElement): boolean => {
    let el: HTMLElement | null = node
    while (el && el !== root && el !== document.body && el !== document.documentElement) {
      const style = getComputedStyle(el)
      const scrollableY = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight
      const scrollableX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && el.scrollWidth > el.clientWidth
      if (scrollableY || scrollableX) return true
      el = el.parentElement
    }
    return false
  }
}

export function useSmoothScroll(options: Partial<LenisOptions> = {}) {
  if (typeof window === 'undefined') return () => {}

  const root = options.wrapper instanceof Element ? options.wrapper : document.body

  const lenis = new Lenis({
    lerp: 0.3,
    smoothWheel: true,
    syncTouch: false,
    prevent: makePrevent(root),
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
