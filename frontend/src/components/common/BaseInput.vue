<script lang="ts">
let _idCounter = 0
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  modelValue?: string | number
  type?: 'text' | 'number' | 'password' | 'email' | 'search' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  /** error styling without message text — complementary to FormField :error */
  invalid?: boolean
  /** success state with check icon */
  success?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md'
  /** text alignment inside the input */
  align?: 'left' | 'center' | 'right'
}>()

const inputId = `base-input-${++_idCounter}`
const errorId = `${inputId}-error`

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  return props.type ?? 'text'
})

const hasError = computed(() => Boolean(props.error) || props.invalid)
</script>

<template>
  <div class="base-input" :class="[`base-input--${size ?? 'md'}`]">
    <label v-if="label" :for="inputId" class="base-input__label">{{ label }}</label>
    <div
      class="base-input__wrapper"
      :class="{
        'base-input__wrapper--error': hasError,
        'base-input__wrapper--success': success && !hasError,
        'base-input__wrapper--disabled': disabled,
      }"
    >
      <!-- leading slot: icon/nội dung ngắn ở đầu ô (xem chú thích CSS `.base-input__prefix`) -->
      <span v-if="$slots.prefix" class="base-input__prefix">
        <slot name="prefix" />
      </span>

      <input
        v-bind="$attrs"
        :id="inputId"
        class="base-input__field"
        :class="{
          'base-input__field--has-prefix': !!$slots.prefix,
          'base-input__field--has-toggle': type === 'password',
          'base-input__field--has-icon': success && !hasError,
          [`base-input__field--align-${align ?? (type === 'number' ? 'center' : 'left')}`]: true,
        }"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <!-- success check -->
      <span v-if="success && !hasError" class="base-input__icon base-input__icon--success" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>

      <!-- password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="base-input__eye"
        tabindex="-1"
        :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        @click="showPassword = !showPassword"
      >
        <!-- eye open -->
        <svg v-if="showPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <!-- eye off -->
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      </button>
    </div>
    <span v-if="error" :id="errorId" role="alert" class="base-input__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}

.base-input__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-secondary);
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Control chuẩn nguồn: cao 34px (token), viền slate-300, bo 9px, chữ 13px.
   Hover đậm viền một bậc; focus = viền xanh + vòng 3px. */
.base-input__field {
  width: 100%;
  min-height: var(--wx-control-h-md);
  padding: 0 var(--wx-control-px);
  border: 1px solid var(--wx-border-control);
  border-radius: var(--wx-radius-ctrl);
  background: var(--wx-surface-elevated);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-control-fs);
  transition:
    border-color var(--wx-duration-fast) var(--wx-ease-standard),
    box-shadow var(--wx-duration-fast) var(--wx-ease-standard),
    background var(--wx-duration-fast) var(--wx-ease-standard);
}

.base-input__field::placeholder { color: var(--wx-text-placeholder); }

.base-input__field:hover:not(:disabled):not(:focus):not([readonly]) {
  border-color: var(--wx-border-control-hover);
}

.base-input__field:focus {
  outline: none;
  border-color: var(--wx-border-focus);
  box-shadow: var(--wx-ring-focus);
}

.base-input__field[readonly] { background: var(--wx-surface-sunken); }

.base-input__field--has-toggle { padding-right: 36px; }
.base-input__field--has-icon   { padding-right: 36px; }

/* error state */
.base-input__wrapper--error .base-input__field {
  border-color: var(--wx-danger-solid);
}
.base-input__wrapper--error .base-input__field:focus {
  border-color: var(--wx-danger-solid);
  box-shadow: var(--wx-ring-danger);
}

/* success state */
.base-input__wrapper--success .base-input__field {
  border-color: var(--wx-success-solid);
}
.base-input__wrapper--success .base-input__field:focus {
  box-shadow: var(--wx-ring-success);
}

/* disabled — nguồn dùng nền xám + chữ nhạt thay vì chỉ giảm opacity */
.base-input__wrapper--disabled .base-input__field {
  background: var(--wx-disabled-bg);
  color: var(--wx-disabled-text);
  border-color: var(--wx-border-default);
  cursor: not-allowed;
}

/* leading slot (#prefix) — icon ở đầu ô, đối xứng với icon bên phải (left 8px, hộp 24px).
   Bề rộng hộp chỉnh được qua custom property --wx-input-prefix-w (đặt ở phần tử cha) nếu
   nội dung rộng hơn icon thường. Mặc định pointer-events: none để bấm vào icon vẫn focus input;
   phần tử tương tác (button/a) bên trong được bật lại bên dưới. */
.base-input__prefix {
  position: absolute;
  left: var(--wx-space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--wx-input-prefix-w, 24px);
  height: 24px;
  color: var(--wx-text-muted);
  pointer-events: none;
  transition: color var(--wx-duration-fast);
}
.base-input__prefix :deep(:is(button, a, [role="button"])) { pointer-events: auto; }
.base-input__wrapper:focus-within .base-input__prefix { color: var(--wx-brand-primary); }
.base-input__wrapper--error .base-input__prefix,
.base-input__wrapper--error:focus-within .base-input__prefix { color: var(--wx-danger-text); }
.base-input__wrapper--disabled .base-input__prefix,
.base-input__wrapper--disabled:focus-within .base-input__prefix { color: var(--wx-disabled-text); }

/* right icons */
.base-input__eye,
.base-input__icon {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.base-input__eye {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--wx-text-muted);
  padding: 0;
  border-radius: var(--wx-radius-sm);
  transition: color var(--wx-duration-fast);
}
.base-input__eye:hover { color: var(--wx-text-primary); }

.base-input__icon--success {
  color: var(--wx-success-text);
  animation: icon-pop var(--wx-duration-fast) var(--wx-ease-decelerate);
}
@keyframes icon-pop {
  from { opacity: 0; transform: scale(.6); }
  to   { opacity: 1; transform: scale(1); }
}

.base-input__error {
  font-size: 11px;
  color: var(--wx-danger-text);
}

/* ── Size sm ── */
.base-input--sm .base-input__field {
  min-height: var(--wx-control-h-sm);
  padding-left: calc(var(--wx-control-px) - 2px);
  font-size: 12px;
  border-radius: var(--wx-radius-ctrl-sm);
}
.base-input--sm .base-input__field:not(.base-input__field--has-toggle):not(.base-input__field--has-icon) {
  padding-right: calc(var(--wx-control-px) - 2px);
}
.base-input--sm .base-input__label { font-size: 11px; }

/* Chừa chỗ cho #prefix — đặt SAU khối size sm để thắng padding-left của sm (cùng specificity, sau thắng) */
.base-input .base-input__field--has-prefix {
  padding-left: calc(var(--wx-space-2) + var(--wx-input-prefix-w, 24px) + var(--wx-space-1));
}

/* text alignment */
.base-input__field--align-left   { text-align: left; }
.base-input__field--align-center { text-align: center; }
.base-input__field--align-right  { text-align: right; }

/* hide number spinner arrows */
.base-input__field[type="number"]::-webkit-inner-spin-button,
.base-input__field[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.base-input__field[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

@media (prefers-reduced-motion: reduce) {
  .base-input__field {
    transition: none;
  }
  .base-input__icon--success { animation: none; }
}
</style>
