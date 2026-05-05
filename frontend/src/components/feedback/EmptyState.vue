<script setup lang="ts">
/**
 * EmptyState — 3 biến thể (zero / filtered / search) theo §3.3 state catalog.
 *
 *  - zero:     "chưa có dữ liệu lần đầu" → CTA chính tạo mới.
 *  - filtered: "bộ lọc không khớp"        → action xoá filter.
 *  - search:   "tìm kiếm không kết quả"   → gợi ý sửa từ khoá.
 *
 *  Anatomy: root → icon → title → description → cta(primary, secondary)
 */
import { computed } from 'vue'

interface Props {
  variant?: 'zero' | 'filtered' | 'search'
  title?: string
  description?: string
  /** unicode/emoji/svg slot — fallback theo variant */
  icon?: string
  /** label CTA chính */
  ctaLabel?: string
  /** label CTA phụ */
  secondaryLabel?: string
  /** ép full size (chiếm toàn bộ container) */
  size?: 'sm' | 'md' | 'lg'
  /** hiển thị cụm "search query" — hiện trong variant=search */
  query?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'zero',
  size: 'md',
})

defineEmits<{
  cta: []
  secondary: []
}>()

const fallback = computed(() => {
  switch (props.variant) {
    case 'filtered':
      return {
        icon: '🧮',
        title: props.title ?? 'không có kết quả khớp bộ lọc',
        description:
          props.description ??
          'thử nới rộng bộ lọc hoặc xoá điều kiện để xem nhiều dữ liệu hơn.',
        cta: props.ctaLabel ?? 'xoá bộ lọc',
        secondary: props.secondaryLabel ?? null,
      }
    case 'search':
      return {
        icon: '🔍',
        title:
          props.title ??
          (props.query
            ? `không tìm thấy "${props.query}"`
            : 'không tìm thấy kết quả'),
        description:
          props.description ??
          'kiểm tra lại chính tả, hoặc thử từ khoá ngắn gọn hơn.',
        cta: props.ctaLabel ?? 'xoá tìm kiếm',
        secondary: props.secondaryLabel ?? null,
      }
    default:
      return {
        icon: '📭',
        title: props.title ?? 'chưa có dữ liệu',
        description:
          props.description ??
          'tạo mục đầu tiên để bắt đầu — bạn có thể chỉnh sau.',
        cta: props.ctaLabel ?? 'tạo mới',
        secondary: props.secondaryLabel ?? null,
      }
  }
})
</script>

<template>
  <div
    class="wx-empty"
    :data-variant="variant"
    :data-size="size"
    role="status"
    aria-live="polite"
  >
    <div class="wx-empty__icon" aria-hidden="true">
      <slot name="icon">{{ icon ?? fallback.icon }}</slot>
    </div>
    <h3 class="wx-empty__title">
      <slot name="title">{{ fallback.title }}</slot>
    </h3>
    <p class="wx-empty__desc">
      <slot name="description">{{ fallback.description }}</slot>
    </p>
    <div v-if="$slots.actions || fallback.cta" class="wx-empty__actions">
      <slot name="actions">
        <button
          v-if="fallback.cta"
          type="button"
          class="wx-empty__cta"
          @click="$emit('cta')"
        >
          {{ fallback.cta }}
        </button>
        <button
          v-if="fallback.secondary"
          type="button"
          class="wx-empty__secondary"
          @click="$emit('secondary')"
        >
          {{ fallback.secondary }}
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.wx-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--wx-space-3);
  padding: var(--wx-space-8) var(--wx-space-5);
  border-radius: var(--wx-radius-lg);
  color: var(--wx-text-primary);
  background: transparent;
  font-family: var(--wx-font-primary);
}
.wx-empty[data-size='sm'] { padding: var(--wx-space-5) var(--wx-space-4); gap: var(--wx-space-2); }
.wx-empty[data-size='lg'] { padding: var(--wx-space-9) var(--wx-space-6); gap: var(--wx-space-4); }

.wx-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-secondary);
  font-size: 28px;
  margin-bottom: var(--wx-space-1);
}
.wx-empty[data-size='lg'] .wx-empty__icon { width: 72px; height: 72px; font-size: 36px; }
.wx-empty[data-size='sm'] .wx-empty__icon { width: 40px; height: 40px; font-size: 20px; }

.wx-empty__title {
  margin: 0;
  font-size: var(--wx-fs-18);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
  line-height: var(--wx-lh-snug);
}
.wx-empty[data-size='lg'] .wx-empty__title { font-size: var(--wx-fs-24); }
.wx-empty[data-size='sm'] .wx-empty__title { font-size: var(--wx-fs-15); }

.wx-empty__desc {
  margin: 0;
  max-width: 56ch;
  font-size: var(--wx-fs-14);
  line-height: var(--wx-lh-normal);
  color: var(--wx-text-secondary);
}

.wx-empty__actions {
  display: flex;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-2);
  flex-wrap: wrap;
  justify-content: center;
}

.wx-empty__cta,
.wx-empty__secondary {
  font-family: inherit;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  border: 1px solid transparent;
  border-radius: var(--wx-radius-md);
  padding: 8px 16px;
  cursor: pointer;
  transition:
    background var(--wx-d-micro) var(--wx-ease-standard),
    transform var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-empty__cta {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
}
.wx-empty__cta:hover { transform: translateY(-1px); }
.wx-empty__cta:active { transform: scale(0.98); }
.wx-empty__cta:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

.wx-empty__secondary {
  background: var(--wx-surface-base);
  color: var(--wx-text-primary);
  border-color: var(--wx-border-default);
}
.wx-empty__secondary:hover { background: var(--wx-hover-bg); }
.wx-empty__secondary:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .wx-empty__cta,
  .wx-empty__secondary { transition: none; transform: none !important; }
}
</style>
