<script lang="ts">
let _segIdCounter = 0
</script>

<script setup lang="ts" generic="T extends string | number = string | number">
/**
 * BaseSegmented — nhóm nút chọn 1 trong N (đổi ngôn ngữ, chế độ xem, bộ lọc nhanh).
 * Port từ LanguageSwitcher / SelectButton của MindAds: rãnh sunken có viền + mục đang chọn là khối nổi.
 *
 *  - tone="primary" (mặc định): mục chọn = xanh đặc + chữ trắng (như nút VI/EN của nguồn)
 *  - tone="neutral"           : mục chọn = thẻ trắng nổi nhẹ (kiểu iOS), hợp thanh công cụ dày đặc
 *
 * Truy cập: role="radiogroup" + roving tabindex, phím ← → ↑ ↓ Home End.
 */
import { computed, ref } from 'vue'
import type { SegmentedOption } from '../../types'

const props = withDefaults(defineProps<{
  modelValue?: T
  options: SegmentedOption<T>[]
  size?: 'sm' | 'md' | 'lg'
  tone?: 'primary' | 'neutral'
  /** giãn đều hết chiều ngang container */
  block?: boolean
  disabled?: boolean
  /** nhãn cho nhóm (screen reader) */
  ariaLabel?: string
}>(), {
  size: 'md',
  tone: 'primary',
  block: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const uid = ++_segIdCounter
const groupRef = ref<HTMLElement>()

const activeIndex = computed(() => props.options.findIndex(o => o.value === props.modelValue))
/** tabindex=0 cho mục đang chọn; chưa chọn gì thì mục đầu tiên còn dùng được */
const tabbableIndex = computed(() => {
  if (activeIndex.value >= 0 && !props.options[activeIndex.value].disabled) return activeIndex.value
  return props.options.findIndex(o => !o.disabled)
})

function select(opt: SegmentedOption<T>) {
  if (props.disabled || opt.disabled || opt.value === props.modelValue) return
  emit('update:modelValue', opt.value)
}

function move(from: number, dir: 1 | -1): number {
  const n = props.options.length
  let i = from
  for (let c = 0; c < n; c++) {
    i = (i + dir + n) % n
    if (!props.options[i].disabled) return i
  }
  return from
}

function focusIndex(i: number) {
  const el = groupRef.value?.querySelectorAll<HTMLElement>('[role="radio"]')[i]
  el?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled || !props.options.length) return
  const base = activeIndex.value >= 0 ? activeIndex.value : 0
  let target: number | null = null
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      target = move(base, 1); break
    case 'ArrowLeft':
    case 'ArrowUp':
      target = move(base, -1); break
    case 'Home':
      target = props.options.findIndex(o => !o.disabled); break
    case 'End': {
      const rev = [...props.options].reverse().findIndex(o => !o.disabled)
      target = rev < 0 ? null : props.options.length - 1 - rev
      break
    }
    default:
      return
  }
  e.preventDefault()
  if (target !== null && target >= 0) {
    select(props.options[target])
    focusIndex(target)
  }
}
</script>

<template>
  <div
    ref="groupRef"
    class="wx-segmented"
    :class="{ 'wx-segmented--block': block, 'wx-segmented--disabled': disabled }"
    :data-size="size"
    :data-tone="tone"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    @keydown="onKeydown"
  >
    <button
      v-for="(opt, i) in options"
      :id="`wx-seg-${uid}-${i}`"
      :key="String(opt.value)"
      type="button"
      role="radio"
      class="wx-segmented__item"
      :class="{ 'wx-segmented__item--active': i === activeIndex }"
      :aria-checked="i === activeIndex"
      :aria-label="!opt.label ? opt.title : undefined"
      :title="opt.title"
      :tabindex="i === tabbableIndex ? 0 : -1"
      :disabled="disabled || opt.disabled"
      @click="select(opt)"
    >
      <span v-if="opt.icon" class="wx-segmented__icon" aria-hidden="true" v-html="opt.icon" />
      <span v-if="opt.label" class="wx-segmented__label">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.wx-segmented {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  background: var(--wx-surface-sunken);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-item);
  font-family: var(--wx-font-primary);
}
.wx-segmented--block { display: flex; width: 100%; }
.wx-segmented--block .wx-segmented__item { flex: 1; }
.wx-segmented--disabled { opacity: 0.55; }

.wx-segmented__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: calc(var(--wx-control-h-md) - 6px);
  padding: 0 var(--wx-control-px);
  border: none;
  border-radius: var(--wx-radius-ctrl-sm);
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: inherit;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    color var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-segmented__item:disabled { cursor: not-allowed; opacity: 0.5; }
.wx-segmented__item:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: 1px; }
.wx-segmented__item:hover:not(:disabled):not(.wx-segmented__item--active) {
  background: var(--wx-surface-elevated);
  color: var(--wx-brand-primary);
}

.wx-segmented__icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* sizes */
.wx-segmented[data-size="sm"] .wx-segmented__item { min-height: calc(var(--wx-control-h-sm) - 4px); padding: 0 calc(var(--wx-control-px) - 4px); font-size: var(--wx-fs-11); }
.wx-segmented[data-size="lg"] .wx-segmented__item { min-height: calc(var(--wx-control-h-lg) - 6px); font-size: var(--wx-fs-13); }

/* tone: primary — khối xanh đặc */
.wx-segmented[data-tone="primary"] .wx-segmented__item--active {
  background: var(--wx-gradient-primary);
  color: var(--wx-text-on-brand);
  box-shadow: var(--wx-shadow-sm);
}

/* tone: neutral — thẻ trắng nổi nhẹ */
.wx-segmented[data-tone="neutral"] .wx-segmented__item--active {
  background: var(--wx-surface-elevated);
  color: var(--wx-text-primary);
  box-shadow: var(--wx-shadow-sm), 0 0 0 1px var(--wx-border-default);
}

@media (prefers-reduced-motion: reduce) {
  .wx-segmented__item { transition: none; }
}
</style>
