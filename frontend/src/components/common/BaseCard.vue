<script setup lang="ts">
/**
 * BaseCard — surface container with optional header/body/footer.
 * Phase 3 — form & layout shells.
 *
 * defaults theo phần II:
 *  - radius: lg (12px)
 *  - shadow: md
 *  - padded: true
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** tiêu đề header (text). nếu cần rich → dùng slot #header */
  title?: string
  /** mô tả nhỏ dưới title */
  subtitle?: string
  /** padding body. mặc định true */
  padded?: boolean
  /** mức shadow */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** radius */
  radius?: 'md' | 'lg' | 'xl' | '2xl'
  /** hover lift effect (translateY -2px + shadow +1) */
  hoverable?: boolean
  /** hiện viền — mặc định true */
  bordered?: boolean
  /** trạng thái selected (highlight) */
  selected?: boolean
  /** loading skeleton overlay */
  loading?: boolean
  /** disable interaction */
  disabled?: boolean
  /** click toàn card → emit click + cursor pointer */
  clickable?: boolean
}>(), {
  padded: true,
  shadow: 'md',
  radius: 'lg',
  hoverable: false,
  bordered: true,
  selected: false,
  loading: false,
  disabled: false,
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const hasHeader = computed(() => Boolean(props.title || props.subtitle))

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  if (props.clickable) emit('click', e)
}
</script>

<template>
  <div
    class="wx-card"
    :data-radius="radius"
    :data-shadow="shadow"
    :data-state="loading ? 'loading' : disabled ? 'disabled' : selected ? 'selected' : 'default'"
    :class="{
      'wx-card--padded': padded,
      'wx-card--hoverable': hoverable && !disabled,
      'wx-card--bordered': bordered,
      'wx-card--clickable': clickable && !disabled,
    }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : undefined"
    @click="onClick"
    @keydown.enter.space="clickable && !disabled ? $emit('click', $event as unknown as MouseEvent) : undefined"
  >
    <header v-if="hasHeader || $slots.header" class="wx-card__header" data-part="header">
      <slot name="header">
        <div class="wx-card__header-text">
          <h3 v-if="title" class="wx-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="wx-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="wx-card__actions" data-part="actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="wx-card__body" data-part="body">
      <slot name="body">
        <slot />
      </slot>
    </div>

    <footer v-if="$slots.footer" class="wx-card__footer" data-part="footer">
      <slot name="footer" />
    </footer>

    <div v-if="loading" class="wx-card__loading" aria-hidden="true">
      <span class="wx-card__loading-bar" />
      <span class="wx-card__loading-bar wx-card__loading-bar--short" />
    </div>
  </div>
</template>

<style scoped>
.wx-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--wx-surface-elevated);
  color: var(--wx-content-primary);
  font-family: var(--wx-font-primary);
  transition:
    transform var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard);
}

/* radius */
.wx-card[data-radius="md"]  { border-radius: var(--wx-radius-md); }
.wx-card[data-radius="lg"]  { border-radius: var(--wx-radius-lg); }
.wx-card[data-radius="xl"]  { border-radius: var(--wx-radius-xl); }
.wx-card[data-radius="2xl"] { border-radius: var(--wx-radius-2xl); }

/* shadow */
.wx-card[data-shadow="none"] { box-shadow: none; }
.wx-card[data-shadow="sm"]   { box-shadow: var(--wx-shadow-sm); }
.wx-card[data-shadow="md"]   { box-shadow: var(--wx-shadow-md); }
.wx-card[data-shadow="lg"]   { box-shadow: var(--wx-shadow-lg); }
.wx-card[data-shadow="xl"]   { box-shadow: var(--wx-shadow-xl); }

.wx-card--bordered {
  border: 1px solid var(--wx-border-default);
}

.wx-card--padded > .wx-card__body { padding: var(--wx-space-5); }
.wx-card--padded > .wx-card__header { padding: var(--wx-space-4) var(--wx-space-5); }
.wx-card--padded > .wx-card__footer { padding: var(--wx-space-4) var(--wx-space-5); }

.wx-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.wx-card__header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.wx-card__title {
  margin: 0;
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-content-primary);
  letter-spacing: var(--wx-tracking-normal);
  line-height: var(--wx-lh-snug);
}
.wx-card__subtitle {
  margin: 0;
  font-size: var(--wx-fs-13);
  color: var(--wx-content-muted);
  line-height: var(--wx-lh-normal);
}
.wx-card__actions {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  flex-shrink: 0;
}

.wx-card__body {
  flex: 1;
  min-width: 0;
}

.wx-card__footer {
  border-top: 1px solid var(--wx-border-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--wx-space-2);
  background: var(--wx-surface-sunken);
}

/* states */
.wx-card[data-state="selected"] {
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 1px var(--wx-brand-primary), var(--wx-shadow-md);
}
.wx-card[data-state="disabled"] {
  opacity: 0.55;
  pointer-events: none;
}

.wx-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--wx-shadow-lg);
  border-color: var(--wx-border-default);
}

.wx-card--clickable {
  cursor: pointer;
}
.wx-card--clickable:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
}
.wx-card--clickable:active:not([data-state="disabled"]) {
  transform: scale(0.995);
}

/* loading skeleton overlay (replaces body content visually) */
.wx-card__loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--wx-space-2);
  padding: var(--wx-space-5);
  background: var(--wx-surface-elevated);
  border-radius: inherit;
}
.wx-card__loading-bar {
  height: 12px;
  border-radius: var(--wx-radius-md);
  background: linear-gradient(
    90deg,
    var(--wx-surface-sunken) 0%,
    var(--wx-border-subtle) 50%,
    var(--wx-surface-sunken) 100%
  );
  background-size: 200% 100%;
  animation: wx-card-shimmer 1.4s infinite var(--wx-ease-standard);
}
.wx-card__loading-bar--short { width: 60%; }

@keyframes wx-card-shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .wx-card { transition: none; }
  .wx-card__loading-bar { animation: none; }
}
</style>
