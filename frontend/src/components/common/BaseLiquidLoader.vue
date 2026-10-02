<script setup lang="ts">
/**
 * BaseLiquidLoader — lớp phủ loading kiểu "liquid" của MindAds (LiquidLoading):
 * thẻ kính mờ, khối blob biến hình quanh logo, vòng sáng thở, chữ nảy từng ký tự, thanh laser chạy ngang.
 *
 * Chỉ phần nhìn: host điều khiển `show`. Logo truyền qua slot `logo` (img/svg); không có thì dùng
 * huy hiệu gradient mặc định.
 *
 * placement:
 *   - fullscreen (mặc định): fixed phủ cả viewport
 *   - false: absolute phủ container gần nhất có `position: relative`
 *
 * Reduced-motion: blob/bay/nảy dừng; thanh laser vẫn chạy chậm (đây là tín hiệu "đang tải" — chức năng).
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  show?: boolean
  /** dòng chữ chính; từng ký tự nảy lần lượt */
  text?: string
  /** nhỏ gọn (popup extension): thẻ 280px */
  compact?: boolean
  /** phủ cả viewport (fixed) hay chỉ container cha (absolute) */
  fullscreen?: boolean
}>(), {
  show: true,
  text: 'Đang tải dữ liệu',
  compact: false,
  fullscreen: true,
})

const chars = computed(() => Array.from(props.text))
</script>

<template>
  <Transition name="wx-liquid-fade">
    <div
      v-if="show"
      class="wx-liquid"
      :class="{ 'wx-liquid--fullscreen': fullscreen }"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="wx-liquid__card" :class="{ 'wx-liquid__card--compact': compact }">
        <span class="wx-liquid__light wx-liquid__light--a" aria-hidden="true" />
        <span class="wx-liquid__light wx-liquid__light--b" aria-hidden="true" />

        <div class="wx-liquid__stage" aria-hidden="true">
          <span class="wx-liquid__blob" />
          <span class="wx-liquid__ring" />
          <span class="wx-liquid__logo">
            <slot name="logo">
              <span class="wx-liquid__mark" />
            </slot>
          </span>
        </div>

        <!-- Đọc cả câu cho screen reader; từng ký tự chỉ là hiệu ứng -->
        <p class="wx-liquid__text">
          <span class="wx-liquid__sr">{{ text }}</span>
          <span aria-hidden="true">
            <span
              v-for="(c, i) in chars"
              :key="i"
              class="wx-liquid__char"
              :style="{ animationDelay: `${i * 0.08}s` }"
            >{{ c === ' ' ? ' ' : c }}</span>
          </span>
        </p>

        <div class="wx-liquid__track" aria-hidden="true">
          <span class="wx-liquid__scanner" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.wx-liquid {
  position: absolute;
  inset: 0;
  z-index: var(--wx-z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--wx-font-primary);
  background: color-mix(in srgb, var(--wx-backdrop-bg) 30%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: inherit;
}
.wx-liquid--fullscreen { position: fixed; z-index: var(--wx-z-topmost); border-radius: 0; }

.wx-liquid__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
  max-width: calc(100% - 32px);
  padding: var(--wx-space-6);
  overflow: hidden;
  background: color-mix(in srgb, var(--wx-surface-elevated) 90%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--wx-border-glass);
  border-radius: var(--wx-radius-4xl);
  box-shadow: 0 32px 60px -15px rgba(15, 23, 42, 0.15);   /* bóng trung tính nhẹ hơn --wx-shadow-2xl, giữ nguyên */
}
.wx-liquid__card--compact { width: 280px; padding: var(--wx-space-5); }

/* ánh sáng nền tạo chiều sâu */
.wx-liquid__light {
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  filter: blur(32px);
  pointer-events: none;
}
.wx-liquid__light--a { top: -48px; left: -48px; background: color-mix(in srgb, var(--wx-brand-accent) 12%, transparent); }
.wx-liquid__light--b { bottom: -48px; right: -48px; background: color-mix(in srgb, var(--wx-brand-500) 12%, transparent); }

.wx-liquid__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin-bottom: var(--wx-space-5);
}
.wx-liquid__blob {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top right,
    color-mix(in srgb, var(--wx-brand-accent) 25%, transparent),
    color-mix(in srgb, var(--wx-brand-400) 15%, transparent),
    color-mix(in srgb, var(--wx-brand-500) 20%, transparent)
  );
  filter: blur(2px);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: wx-liquid-morph 6s ease-in-out infinite, wx-liquid-spin 10s linear infinite;
}
.wx-liquid__ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--wx-brand-400) 30%, transparent);
  animation: wx-liquid-breathe 3s ease-in-out infinite;
}
.wx-liquid__logo {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  animation: wx-liquid-float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px color-mix(in srgb, var(--wx-brand-600) 20%, transparent));
}
.wx-liquid__logo :deep(img),
.wx-liquid__logo :deep(svg) { width: 100%; height: 100%; object-fit: contain; }

/* huy hiệu mặc định khi không truyền logo */
.wx-liquid__mark {
  width: 100%;
  height: 100%;
  border-radius: var(--wx-radius-xl);
  background: var(--wx-gradient-tile);
  box-shadow: var(--wx-shadow-tile);
}

.wx-liquid__text {
  position: relative;
  z-index: 1;
  margin: 0;
  display: flex;
  justify-content: center;
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-bold);
  letter-spacing: var(--wx-tracking-wide);
  color: var(--wx-text-primary);
  user-select: none;
  text-align: center;
}
.wx-liquid__char { display: inline-block; animation: wx-liquid-char 1.6s ease-in-out infinite; }
.wx-liquid__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* thanh laser — không hiển thị % */
.wx-liquid__track {
  position: relative;
  z-index: 1;
  width: 128px;
  height: 3px;
  margin-top: 20px;
  overflow: hidden;
  border-radius: var(--wx-radius-full);
  background: var(--wx-border-subtle);
  box-shadow: var(--wx-shadow-inset);
}
.wx-liquid__scanner {
  position: absolute;
  top: 0;
  left: -48px;
  width: 48px;
  height: 100%;
  border-radius: var(--wx-radius-full);
  background: var(--wx-gradient-scanner);
  box-shadow: 0 0 8px color-mix(in srgb, var(--wx-brand-accent) 60%, transparent);
  animation: wx-liquid-scan 2s ease-in-out infinite;
}

@keyframes wx-liquid-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%      { border-radius: 30% 60% 70% 30% / 50% 60% 30% 60%; }
}
@keyframes wx-liquid-spin   { to { transform: rotate(360deg); } }
@keyframes wx-liquid-breathe {
  0%, 100% { transform: scale(1);    opacity: 0.2; }
  50%      { transform: scale(1.15); opacity: 0.6; }
}
@keyframes wx-liquid-float  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes wx-liquid-char   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes wx-liquid-scan {
  0%, 100% { left: -48px; }
  50%      { left: 100%; }
}

.wx-liquid-fade-enter-active,
.wx-liquid-fade-leave-active { transition: opacity var(--wx-d-slow) var(--wx-ease-standard); }
.wx-liquid-fade-enter-from,
.wx-liquid-fade-leave-to { opacity: 0; }

/* Reduced-motion: dừng hiệu ứng trang trí; thanh laser (tín hiệu chức năng) được giữ chạy ở loading.css */
@media (prefers-reduced-motion: reduce) {
  .wx-liquid__blob,
  .wx-liquid__ring,
  .wx-liquid__logo,
  .wx-liquid__char { animation: none; }
}
</style>
