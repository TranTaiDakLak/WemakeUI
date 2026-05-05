<script setup lang="ts">
/**
 * RetryButton — nút "thử lại" với spinner inline + dropdown options.
 * theo §5.4: retry chính + dropdown "thử lại từ bước cuối thất bại".
 *
 *   <RetryButton :loading="busy" @retry="run()" :options="[
 *     { value: 'last',   label: 'thử lại từ bước cuối thất bại' },
 *     { value: 'all',    label: 'chạy lại từ đầu' },
 *   ]" @retry-with="onRetryWith" />
 */
import { ref } from 'vue'

interface RetryOption {
  value: string
  label: string
  description?: string
}

interface Props {
  loading?: boolean
  disabled?: boolean
  label?: string
  options?: RetryOption[]
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  label: 'thử lại',
  size: 'md',
})

const emit = defineEmits<{
  retry: []
  'retry-with': [value: string]
}>()

const open = ref(false)
function toggle() { open.value = !open.value }
function pick(o: RetryOption) {
  open.value = false
  emit('retry-with', o.value)
}
function close() { open.value = false }
</script>

<template>
  <div class="wx-retry" :data-size="size" @keydown.esc="close">
    <button
      type="button"
      class="wx-retry__main"
      :disabled="disabled || loading"
      @click="$emit('retry')"
    >
      <span v-if="loading" class="wx-retry__spinner" aria-hidden="true" />
      <span v-else class="wx-retry__icon" aria-hidden="true">↻</span>
      <span class="wx-retry__label">{{ label }}</span>
    </button>
    <button
      v-if="options && options.length"
      type="button"
      class="wx-retry__caret"
      :disabled="disabled || loading"
      :aria-expanded="open"
      :aria-label="'thêm tuỳ chọn thử lại'"
      @click="toggle"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2 4 L5 7 L8 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul v-if="open && options && options.length" class="wx-retry__menu" role="menu">
      <li v-for="o in options" :key="o.value">
        <button type="button" class="wx-retry__item" role="menuitem" @click="pick(o)">
          <span class="wx-retry__item-label">{{ o.label }}</span>
          <span v-if="o.description" class="wx-retry__item-desc">{{ o.description }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wx-retry {
  display: inline-flex;
  position: relative;
  font-family: var(--wx-font-primary);
}

.wx-retry__main,
.wx-retry__caret {
  display: inline-flex;
  align-items: center;
  gap: var(--wx-space-1);
  padding: 6px 12px;
  font-size: var(--wx-fs-13);
  font-weight: var(--wx-fw-medium);
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border: none;
  cursor: pointer;
  transition:
    background var(--wx-d-micro) var(--wx-ease-standard),
    transform var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-retry__main {
  border-radius: var(--wx-radius-md) 0 0 var(--wx-radius-md);
}
.wx-retry__caret {
  border-radius: 0 var(--wx-radius-md) var(--wx-radius-md) 0;
  border-left: 1px solid color-mix(in srgb, var(--wx-text-inverse) 25%, transparent);
  padding: 6px 8px;
}
.wx-retry__main:only-child {
  border-radius: var(--wx-radius-md);
}

.wx-retry[data-size='sm'] .wx-retry__main,
.wx-retry[data-size='sm'] .wx-retry__caret { padding: 4px 10px; font-size: var(--wx-fs-12); }

.wx-retry__main:hover,
.wx-retry__caret:hover { filter: brightness(0.95); }
.wx-retry__main:active { transform: scale(0.98); }
.wx-retry__main:focus-visible,
.wx-retry__caret:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 2px;
  z-index: 1;
}
.wx-retry__main:disabled,
.wx-retry__caret:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.wx-retry__icon {
  display: inline-block;
  font-size: 14px;
  line-height: 1;
}
.wx-retry__spinner {
  width: 12px;
  height: 12px;
  border-radius: var(--wx-radius-full);
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: wx-retry-spin 0.8s linear infinite;
}

.wx-retry__menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  list-style: none;
  margin: 0;
  padding: var(--wx-space-1);
  min-width: 220px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-lg);
  z-index: var(--wx-z-dropdown);
}
.wx-retry__item {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  background: transparent;
  border: none;
  border-radius: var(--wx-radius-sm);
  cursor: pointer;
  font-family: inherit;
  color: var(--wx-text-primary);
  transition: background var(--wx-d-micro) var(--wx-ease-standard);
}
.wx-retry__item:hover { background: var(--wx-hover-bg); }
.wx-retry__item:focus-visible {
  outline: 2px solid var(--wx-border-focus);
  outline-offset: 1px;
}
.wx-retry__item-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); }
.wx-retry__item-desc  { font-size: var(--wx-fs-12); color: var(--wx-text-secondary); margin-top: 2px; }

@keyframes wx-retry-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .wx-retry__spinner { animation-duration: 1.6s; }
}
</style>
