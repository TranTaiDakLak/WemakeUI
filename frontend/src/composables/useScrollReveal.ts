import { ref, onUnmounted } from 'vue'

export interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -48px 0px', once = true } = options
  const revealed = ref(false)
  let observer: IntersectionObserver | null = null

  /** Nhận Element hoặc instance component (template ref trỏ vào component → lấy `$el`). */
  function observe(target: Element | { $el?: unknown } | null | undefined) {
    const raw = target && !(target instanceof Element) ? (target as { $el?: unknown }).$el : target
    // Không phải Element (ref rỗng / component fragment) → hiện luôn thay vì ném lỗi và bị ẩn vĩnh viễn
    if (typeof IntersectionObserver === 'undefined' || !(raw instanceof Element)) {
      revealed.value = true
      return
    }
    const el: Element = raw
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed.value = true
            if (once) observer?.disconnect()
          } else if (!once) {
            revealed.value = false
          }
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
  }

  onUnmounted(() => observer?.disconnect())

  return { revealed, observe }
}
