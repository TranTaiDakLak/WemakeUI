<script setup lang="ts">
/**
 * ErrorState — 4 surface theo §3.3:
 *   - inline    : nhỏ, embed trong form/section
 *   - banner    : full width sticky-able
 *   - toast     : (dùng useToast — không phải component này)
 *   - full-page : 5xx / 403 page (variant=fullpage)
 *
 *   <ErrorState
 *     surface="banner"
 *     title="không thể tải dữ liệu"
 *     description="máy chủ không phản hồi. thử lại sau ít phút."
 *     :retry="onRetry"
 *   />
 *
 * Severity (intent): danger (default), warning. mỗi cái đổi màu border + icon.
 */
import { computed } from 'vue'

interface Props {
  surface?: 'inline' | 'banner' | 'fullpage'
  intent?: 'danger' | 'warning'
  title?: string
  description?: string
  /** mã lỗi hiển thị mono (vd "500", "ECONNREFUSED") */
  code?: string | number
  /** hiển thị nút thử lại — gắn handler qua @retry */
  retryLabel?: string
  /** hiển thị nút phụ — gắn handler qua @secondary */
  secondaryLabel?: string
  /** ẩn icon */
  hideIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  surface: 'inline',
  intent: 'danger',
})

defineEmits<{
  retry: []
  secondary: []
}>()

const fallbackIcon = computed(() => (props.intent === 'warning' ? '⚠️' : '⛔'))
const fallbackTitle = computed(() => {
  if (props.title) return props.title
  if (props.surface === 'fullpage') {
    if (props.code === 403 || props.code === '403') return 'không có quyền truy cập'
    if (props.code === 404 || props.code === '404') return 'không tìm thấy trang'
    if (props.code === 500 || props.code === '500') return 'máy chủ gặp lỗi'
    return 'có lỗi xảy ra'
  }
  return 'có lỗi xảy ra'
})
const fallbackDesc = computed(() => {
  if (props.description) return props.description
  return 'thử lại sau ít phút. nếu vẫn lỗi, liên hệ quản trị viên.'
})
</script>

<template>
  <div
    class="wx-error"
    :data-surface="surface"
    :data-intent="intent"
    role="alert"
    aria-live="assertive"
  >
    <div v-if="!hideIcon" class="wx-error__icon" aria-hidden="true">
      <slot name="icon">{{ fallbackIcon }}</slot>
    </div>
    <div class="wx-error__body">
      <div class="wx-error__head">
        <h3 class="wx-error__title">
          <slot name="title">{{ fallbackTitle }}</slot>
        </h3>
        <span v-if="code != null" class="wx-error__code">{{ code }}</span>
      </div>
      <p class="wx-error__desc">
        <slot name="description">{{ fallbackDesc }}</slot>
      </p>
      <div v-if="$slots.actions || retryLabel || secondaryLabel" class="wx-error__actions">
        <slot name="actions">
          <button
            v-if="retryLabel"
            type="button"
            class="wx-error__retry"
            @click="$emit('retry')"
          >
            {{ retryLabel }}
          </button>
          <button
            v-if="secondaryLabel"
            type="button"
            class="wx-error__secondary"
            @click="$emit('secondary')"
          >
            {{ secondaryLabel }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wx-error {
  display: flex;
  gap: var(--wx-space-3);
  align-items: flex-start;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
}

/* surface variants */
.wx-error[data-surface='inline'] {
  padding: var(--wx-space-3) var(--wx-space-4);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-danger-border);
  background: var(--wx-danger-bg);
}
.wx-error[data-surface='banner'] {
  padding: var(--wx-space-3) var(--wx-space-5);
  border-radius: var(--wx-radius-md);
  border: 1px solid var(--wx-danger-border);
  background: var(--wx-danger-bg);
  box-shadow: var(--wx-shadow-sm);
}
.wx-error[data-surface='fullpage'] {
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--wx-space-10) var(--wx-space-5);
  gap: var(--wx-space-4);
  background: transparent;
  border: none;
}

.wx-error[data-intent='warning'] {
  border-color: var(--wx-warning-border);
  background: var(--wx-warning-bg);
}

/* icon */
.wx-error__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-surface-base);
  font-size: 16px;
  flex-shrink: 0;
}
.wx-error[data-surface='fullpage'] .wx-error__icon {
  width: 72px;
  height: 72px;
  font-size: 36px;
}

.wx-error__body {
  flex: 1;
  min-width: 0;
}
.wx-error[data-surface='fullpage'] .wx-error__body {
  max-width: 480px;
}

.wx-error__head {
  display: flex;
  align-items: baseline;
  gap: var(--wx-space-2);
  flex-wrap: wrap;
}

.wx-error__title {
  margin: 0;
  font-size: var(--wx-fs-15);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-danger-text);
  letter-spacing: var(--wx-tracking-tight);
}
.wx-error[data-intent='warning'] .wx-error__title { color: var(--wx-warning-text); }
.wx-error[data-surface='fullpage'] .wx-error__title { font-size: var(--wx-fs-28); }

.wx-error__code {
  font-family: var(--wx-font-mono);
  font-size: var(--wx-fs-12);
  padding: 2px 8px;
  border-radius: var(--wx-radius-sm);
  background: rgba(0, 0, 0, 0.06);
  color: var(--wx-text-secondary);
  letter-spacing: var(--wx-tracking-wide);
}

.wx-error__desc {
  margin: 4px 0 0;
  font-size: var(--wx-fs-14);
  line-height: var(--wx-lh-normal);
  color: var(--wx-text-secondary);
}
.wx-error[data-surface='fullpage'] .wx-error__desc { font-size: var(--wx-fs-15); }

.wx-error__actions {
  display: flex;
  gap: var(--wx-space-2);
  margin-top: var(--wx-space-3);
  flex-wrap: wrap;
}
.wx-error[data-surface='fullpage'] .wx-error__actions {
  justify-content: center;
}

.wx-error__retry,
.wx-error__secondary {
  font-family: inherit;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  border-radius: var(--wx-radius-md);
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-error__retry {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
}
.wx-error__retry:hover { filter: brightness(0.95); }
.wx-error__secondary {
  background: transparent;
  color: var(--wx-text-primary);
  border-color: var(--wx-border-default);
}
.wx-error__secondary:hover { background: var(--wx-hover-bg); }

.wx-error__retry:focus-visible,
.wx-error__secondary:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
</style>
