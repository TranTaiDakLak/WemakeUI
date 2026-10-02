<script setup lang="ts">
/**
 * PageHeader — tiêu đề trang (đặt trên cùng nội dung).
 * Phase 3 — layout shells.
 *
 * defaults phần II:
 *  - sticky: false
 *  - back:   false
 *
 * Nâng cấp theo khuôn "panel head" của MindAds (tất cả tuỳ chọn, tương thích ngược):
 *  - icon     : SVG html → ô icon gradient bo góc đứng trước tiêu đề
 *  - eyebrow  : dòng nhỏ viết hoa phía trên tiêu đề
 *  - bordered : kẻ đường gradient mảnh phía dưới header
 *  - slots    : meta (chip/số liệu dưới mô tả) · tabs (hàng tab dưới cùng)
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  /** hiện nút back trái title — emit 'back' khi bấm */
  back?: boolean
  /** label cho nút back (ARIA) */
  backLabel?: string
  /** sticky top khi scroll — bám đỉnh content area */
  sticky?: boolean
  /** padding bên ngoài (cho responsive container) */
  padded?: boolean
  /** kích thước title */
  size?: 'sm' | 'md' | 'lg'
  /** SVG html cho ô icon */
  icon?: string
  /** dòng nhỏ viết hoa phía trên tiêu đề */
  eyebrow?: string
  /** kẻ đường gradient dưới header */
  bordered?: boolean
}>(), {
  back: false,
  backLabel: 'Quay lại',
  sticky: false,
  padded: false,
  size: 'md',
  bordered: false,
})

const emit = defineEmits<{
  back: []
}>()

const sizeClass = computed(() => `wx-page-header--${props.size}`)
</script>

<template>
  <div
    class="wx-page-header"
    :class="[sizeClass, { 'wx-page-header--sticky': sticky, 'wx-page-header--padded': padded, 'wx-page-header--bordered': bordered }]"
    data-part="root"
  >
    <div class="wx-page-header__row">
      <button
        v-if="back"
        type="button"
        class="wx-page-header__back"
        :aria-label="backLabel"
        @click="emit('back')"
      >
        <svg width="18" height="18" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <span v-if="icon" class="wx-page-header__icon" aria-hidden="true" v-html="icon" />

      <div class="wx-page-header__info" data-part="info">
        <span v-if="eyebrow" class="wx-page-header__eyebrow">{{ eyebrow }}</span>
        <div class="wx-page-header__title-row">
          <h2 class="wx-page-header__title" data-part="title">
            <slot name="title">{{ title }}</slot>
          </h2>
          <slot name="badge" />
        </div>
        <p
          v-if="description || $slots.description"
          class="wx-page-header__desc"
          data-part="description"
        >
          <slot name="description">{{ description }}</slot>
        </p>
        <div v-if="$slots.breadcrumb" class="wx-page-header__breadcrumb" data-part="breadcrumb">
          <slot name="breadcrumb" />
        </div>
        <div v-if="$slots.meta" class="wx-page-header__meta" data-part="meta">
          <slot name="meta" />
        </div>
      </div>

      <div
        v-if="$slots.actions"
        class="wx-page-header__actions"
        data-part="actions"
      >
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.tabs" class="wx-page-header__tabs" data-part="tabs">
      <slot name="tabs" />
    </div>
  </div>
</template>

<style scoped>
.wx-page-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  margin-bottom: var(--wx-space-5);
  font-family: var(--wx-font-primary);
  color: var(--wx-content-primary);
}
.wx-page-header__row {
  display: flex;
  align-items: flex-start;
  gap: var(--wx-space-3);
}
.wx-page-header--padded { padding: var(--wx-space-5); }

.wx-page-header--sticky {
  position: sticky;
  top: 0;
  z-index: var(--wx-z-sticky);
  background: color-mix(in srgb, var(--wx-surface-base) 92%, transparent);
  padding: var(--wx-space-3) var(--wx-space-5);
  margin: 0;
  border-bottom: 1px solid var(--wx-border-subtle);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Đường kẻ gradient mảnh (cùng ngôn ngữ "title-line" của dashboard MindAds) */
.wx-page-header--bordered::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  border-radius: var(--wx-radius-full);
  background: linear-gradient(to right, var(--wx-brand-accent), var(--wx-brand-primary) 40%, transparent);
  opacity: 0.55;
}
.wx-page-header--bordered.wx-page-header--padded::after { left: var(--wx-space-5); right: var(--wx-space-5); }
.wx-page-header--bordered:not(.wx-page-header--sticky) { padding-bottom: var(--wx-space-3); }

.wx-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-base);
  color: var(--wx-content-secondary);
  cursor: pointer;
  margin-top: var(--wx-space-1);
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard),
    transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-page-header__back:hover {
  background: var(--wx-surface-sunken);
  color: var(--wx-content-primary);
}
.wx-page-header__back:active { transform: scale(0.96); }
.wx-page-header__back:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

.wx-page-header__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--wx-shell-tile-gradient);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shell-tile-shadow);
}
.wx-page-header__icon :deep(svg) { width: 20px; height: 20px; }

.wx-page-header__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.wx-page-header__eyebrow {
  font-size: 11px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--wx-brand-primary);
}
.wx-page-header__title-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
}
.wx-page-header__title {
  margin: 0;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-content-primary);
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-tight);
}
.wx-page-header--sm .wx-page-header__title { font-size: var(--wx-fs-18); }
.wx-page-header--md .wx-page-header__title { font-size: var(--wx-fs-24); }
.wx-page-header--lg .wx-page-header__title { font-size: var(--wx-fs-32); }

.wx-page-header__desc {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
  line-height: var(--wx-lh-normal);
  margin-top: 2px;
}
.wx-page-header__breadcrumb {
  margin-top: var(--wx-space-1);
  font-size: var(--wx-fs-12);
  color: var(--wx-content-muted);
}
.wx-page-header__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-2);
}

.wx-page-header__actions {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}
.wx-page-header__tabs { margin-top: var(--wx-space-1); }

@media (max-width: 639px) {
  .wx-page-header__row { flex-wrap: wrap; }
  .wx-page-header__actions {
    width: 100%;
    justify-content: flex-end;
    /* Pages drop 2–3 action buttons in here (e.g. AdminNhanSu). Without
       flex-wrap they overflow the row at 375px and get clipped by the
       viewport. Allow wrapping so each button stays fully visible. */
    flex-wrap: wrap;
  }
}
</style>
