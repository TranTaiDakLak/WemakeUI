import type { Directive } from 'vue'

/**
 * v-reveal — scroll reveal directive.
 * Element bắt đầu ẩn (opacity 0, translateY 50px).
 * Khi cuộn vào viewport → từ từ hiện ra (0.8s transition).
 *
 * Usage:
 *   <div v-reveal>Fade in khi cuộn tới</div>
 *   <div v-reveal="200">Delay 200ms</div>
 *   <div v-reveal.fade>Chỉ fade, không slide up</div>
 */

const observerMap = new WeakMap<Element, IntersectionObserver>()

export interface RevealConfig {
  /** % phần tử phải lọt viewport để kích hoạt reveal (0–1). Mặc định 0.15. */
  threshold: number
  /** Margin ảo quanh viewport khi tính giao nhau — số âm để kích hoạt sớm hơn. */
  rootMargin: string
}

const revealConfig: RevealConfig = {
  threshold: 0.15,
  rootMargin: '0px',
}

/**
 * configureReveal — chỉnh thời điểm kích hoạt v-reveal cho toàn app tiêu thụ
 * thư viện (gọi 1 lần lúc bootstrap, ví dụ trong main.ts). Tốc độ/khoảng cách
 * animation chỉnh qua CSS var --wx-reveal-* (tokens.css), không qua hàm này.
 *
 *   configureReveal({ threshold: 0.3, rootMargin: '0px 0px -10% 0px' })
 */
export function configureReveal(config: Partial<RevealConfig>) {
  Object.assign(revealConfig, config)
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    // Respect reduced motion — bỏ hiệu ứng trượt (chuyển động lớn, dễ gây khó chịu)
    // nhưng vẫn giữ fade opacity nhẹ để nội dung không "bụp" hiện ra trơ trọi.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Thêm class base (ẩn element)
    el.classList.add('wx-reveal')
    if (binding.modifiers.fade || reducedMotion) {
      el.classList.add('wx-reveal--fade')
    }
    if (reducedMotion) {
      el.classList.add('wx-reveal--reduced-motion')
    }

    // Set stagger delay
    if (typeof binding.value === 'number' && binding.value > 0) {
      el.style.setProperty('--stagger-delay', `${binding.value}ms`)
    }

    // Delay 1 frame để element đã paint ở trạng thái ẩn
    requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
              observer.unobserve(entry.target)
            }
          }
        },
        { threshold: revealConfig.threshold, rootMargin: revealConfig.rootMargin },
      )

      observer.observe(el)
      observerMap.set(el, observer)
    })
  },

  unmounted(el) {
    const observer = observerMap.get(el)
    if (observer) {
      observer.disconnect()
      observerMap.delete(el)
    }
  },
}
