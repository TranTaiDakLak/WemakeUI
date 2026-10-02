<script setup lang="ts">
/**
 * BaseOptionRow — hàng chọn bật/tắt trong panel (danh sách cột, tuỳ chọn nạp lại…).
 * Port từ `wm-panel-item` + `wm-toggle` + `wm-radio` + `wm-panel-required` của MindAds.
 *
 * Cả hàng là vùng bấm; slot `leading` / `trailing` tự chặn click để không bật/tắt nhầm
 * (tay kéo, nút ghim…). Bàn phím: Space / Enter.
 *
 * indicator:
 *   - 'toggle' (mặc định): công tắc 36×20 ở cuối hàng, role="switch"
 *   - 'radio'  : chấm tròn ở đầu hàng (lựa chọn loại trừ — host tự bỏ chọn hàng khác), role="radio"
 *   - 'check'  : ô vuông tích ở đầu hàng, role="checkbox"
 *   - 'none'   : hàng chỉ hiển thị, không tương tác
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  description?: string
  indicator?: 'toggle' | 'radio' | 'check' | 'none'
  disabled?: boolean
  /** nhấn mạnh hàng (vd cột đã ghim): nền xanh nhạt + vạch trái 3px */
  highlight?: boolean
  /** nhãn nhỏ cạnh tên, kiểu "Bắt buộc" (ấm, viết hoa) */
  badge?: string
}>(), {
  modelValue: false,
  indicator: 'toggle',
  disabled: false,
  highlight: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const interactive = computed(() => props.indicator !== 'none' && !props.disabled)
const role = computed(() => {
  if (props.indicator === 'toggle') return 'switch'
  if (props.indicator === 'radio') return 'radio'
  if (props.indicator === 'check') return 'checkbox'
  return undefined
})

function toggle() {
  if (!interactive.value) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="wx-option-row"
    :class="{
      'wx-option-row--checked': modelValue,
      'wx-option-row--disabled': disabled,
      'wx-option-row--highlight': highlight,
      'wx-option-row--static': indicator === 'none',
    }"
    :role="role"
    :aria-checked="role ? modelValue : undefined"
    :aria-disabled="role && disabled ? true : undefined"
    :tabindex="interactive ? 0 : undefined"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
  >
    <span v-if="$slots.leading" class="wx-option-row__slot" @click.stop @keydown.stop>
      <slot name="leading" />
    </span>

    <span v-if="indicator === 'radio'" class="wx-option-row__radio" aria-hidden="true" />
    <span v-else-if="indicator === 'check'" class="wx-option-row__check" aria-hidden="true">
      <svg v-if="modelValue" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="2 6 5 9 10 3" />
      </svg>
    </span>

    <span class="wx-option-row__body">
      <span class="wx-option-row__label">
        <slot>
          <span class="wx-option-row__name">{{ label }}</span>
        </slot>
        <span v-if="badge" class="wx-option-row__badge">{{ badge }}</span>
      </span>
      <span v-if="description" class="wx-option-row__desc">{{ description }}</span>
    </span>

    <span v-if="$slots.trailing" class="wx-option-row__slot" @click.stop @keydown.stop>
      <slot name="trailing" />
    </span>

    <span v-if="indicator === 'toggle'" class="wx-option-row__toggle" aria-hidden="true" />
  </div>
</template>

<style scoped>
.wx-option-row {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: var(--wx-radius-ctrl);
  font-family: var(--wx-font-primary);
  cursor: pointer;
  user-select: none;
  transition:
    background var(--wx-d-fast) var(--wx-ease-standard),
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    transform var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-option-row:hover:not(.wx-option-row--disabled):not(.wx-option-row--static) {
  background: color-mix(in srgb, var(--wx-text-secondary) 4%, var(--wx-surface-elevated));
  border-color: var(--wx-border-default);
}
.wx-option-row:active:not(.wx-option-row--disabled):not(.wx-option-row--static) { transform: scale(0.99); }
.wx-option-row:focus-visible { outline: 2px solid var(--wx-brand-focus); outline-offset: -2px; }
.wx-option-row--static { cursor: default; }
.wx-option-row--disabled { opacity: 0.5; cursor: not-allowed; }

.wx-option-row--highlight {
  background: linear-gradient(90deg, color-mix(in srgb, var(--wx-brand-500) 9%, transparent) 0%, transparent 100%);
  border-color: var(--wx-selected-border);
  border-left: 3px solid var(--wx-brand-500);
}
.wx-option-row--highlight:hover:not(.wx-option-row--disabled) {
  background: linear-gradient(90deg, color-mix(in srgb, var(--wx-brand-500) 16%, transparent) 0%, color-mix(in srgb, var(--wx-brand-500) 3%, transparent) 100%);
  border-color: var(--wx-selected-border-hover);
}

.wx-option-row__slot { display: inline-flex; align-items: center; flex-shrink: 0; }

.wx-option-row__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.wx-option-row__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-secondary);
  min-width: 0;
}
.wx-option-row__name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wx-option-row--checked .wx-option-row__label { color: var(--wx-text-primary); }
.wx-option-row__desc { font-size: var(--wx-fs-11); color: var(--wx-text-light); line-height: 1.35; }

/* nhãn "Bắt buộc" — ấm, viết hoa, có viền (wm-panel-required) */
.wx-option-row__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: var(--wx-radius-full);
  border: 1px solid var(--wx-warning-border);
  background: var(--wx-warning-bg);
  color: var(--wx-warning-text);
  font-size: 9.5px;
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── toggle 36×20, tay cầm 14px ── */
.wx-option-row__toggle {
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 20px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-border-control);
  box-shadow: var(--wx-shadow-inset);
  transition: background var(--wx-d-normal) var(--wx-ease-standard), box-shadow var(--wx-d-normal) var(--wx-ease-standard);
}
.wx-option-row__toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--wx-text-on-brand);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.28);   /* bóng núm gạt: đậm hơn --wx-shadow-sm để núm trắng nổi trên nền xám */
  transition: transform var(--wx-d-normal) var(--wx-ease-bounce);
}
.wx-option-row--checked .wx-option-row__toggle {
  background: var(--wx-gradient-primary);
  box-shadow: var(--wx-shadow-btn), inset 0 1px 1px color-mix(in srgb, var(--wx-text-on-brand) 25%, transparent);
}
.wx-option-row--checked .wx-option-row__toggle::after { transform: translateX(16px); }

/* ── radio 16px ── */
.wx-option-row__radio {
  flex-shrink: 0;
  display: inline-grid;
  place-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--wx-border-control);
  background: var(--wx-surface-elevated);
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-option-row__radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wx-brand-600);
  transform: scale(0);
  transition: transform var(--wx-d-fast) var(--wx-ease-bounce);
}
.wx-option-row--checked .wx-option-row__radio { border-color: var(--wx-brand-600); }
.wx-option-row--checked .wx-option-row__radio::after { transform: scale(1); }

/* ── check 16px ── */
.wx-option-row__check {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: var(--wx-radius-sm);
  border: 1.5px solid var(--wx-border-control);
  background: var(--wx-surface-elevated);
  color: var(--wx-text-on-brand);
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-option-row--checked .wx-option-row__check {
  border-color: var(--wx-brand-600);
  background: var(--wx-gradient-primary);
}

@media (prefers-reduced-motion: reduce) {
  .wx-option-row,
  .wx-option-row__toggle,
  .wx-option-row__toggle::after,
  .wx-option-row__radio::after { transition: none; }
}
</style>
