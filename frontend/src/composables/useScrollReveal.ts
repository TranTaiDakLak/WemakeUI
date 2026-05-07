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

  function observe(el: Element) {
    if (typeof IntersectionObserver === 'undefined') {
      revealed.value = true
      return
    }
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
