<script setup lang="ts">
/**
 * AuthField — ô nhập cho các trang auth: nhãn viết hoa nhỏ + icon dẫn đầu +
 * nút hiện/ẩn mật khẩu + thông báo lỗi/gợi ý. Cao 46px như trang đăng nhập MindAds.
 *
 *   <AuthField v-model="email" label="Email" type="email" :icon="ICON.mail"
 *              placeholder="ban@congty.vn" :error="errors.email" required />
 *   <AuthField v-model="pw" label="Mật khẩu" type="password" :icon="ICON.lock">
 *     <template #label-extra><RouterLink to="/auth/forgot">Quên mật khẩu?</RouterLink></template>
 *   </AuthField>
 *
 * Giữ cục bộ trong views/_layouts (không đụng components/common).
 */
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  /** SVG html */
  icon?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  inputmode?: 'text' | 'email' | 'numeric' | 'tel' | 'url' | 'search' | 'decimal' | 'none'
  maxlength?: number
  name?: string
  /** căn giữa chữ (vd mã OTP) */
  center?: boolean
}>(), {
  modelValue: '',
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const uid = Math.random().toString(36).slice(2, 8)
const inputId = computed(() => `auth-field-${uid}`)
const errId = computed(() => `${inputId.value}-msg`)
const reveal = ref(false)

const ICON_EYE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
const ICON_EYE_OFF = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`

const isPassword = computed(() => props.type === 'password')
const nativeType = computed(() => (isPassword.value && reveal.value ? 'text' : props.type))

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="af" :class="{ 'af--invalid': !!error, 'af--disabled': disabled }">
    <div v-if="label || $slots['label-extra']" class="af__label-row">
      <label v-if="label" :for="inputId" class="af__label">
        {{ label }}<span v-if="required" class="af__req" aria-hidden="true"> *</span>
      </label>
      <span class="af__extra"><slot name="label-extra" /></span>
    </div>

    <div class="af__wrap">
      <span v-if="icon" class="af__icon" aria-hidden="true" v-html="icon" />
      <input
        :id="inputId"
        class="af__input"
        :class="{ 'af__input--icon': !!icon, 'af__input--trail': isPassword, 'af__input--center': center }"
        :type="nativeType"
        :value="modelValue"
        :placeholder="placeholder"
        :name="name"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error || hint ? errId : undefined"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
      <button
        v-if="isPassword"
        type="button"
        class="af__toggle"
        :aria-label="reveal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        :aria-pressed="reveal"
        @click="reveal = !reveal"
      >
        <span v-html="reveal ? ICON_EYE_OFF : ICON_EYE" />
      </button>
    </div>

    <p v-if="error" :id="errId" class="af__msg af__msg--error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="errId" class="af__msg">{{ hint }}</p>
  </div>
</template>

<style scoped>
.af { display: flex; flex-direction: column; gap: 6px; }

.af__label-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-2); }
.af__label {
  margin-left: 2px;
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--wx-content-secondary);
}
.af__req { color: var(--wx-danger-text); }
.af__extra { font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); }
.af__extra :deep(a) { color: var(--wx-content-link); text-decoration: none; }
.af__extra :deep(a:hover) { text-decoration: underline; }

.af__wrap { position: relative; width: 100%; }
.af__icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: var(--wx-content-muted);
  pointer-events: none;
  transition: color var(--wx-d-fast) var(--wx-ease-standard);
}
.af__icon :deep(svg) { width: 16px; height: 16px; }
.af__wrap:focus-within .af__icon { color: var(--wx-brand-primary); }

.af__input {
  width: 100%;
  height: 46px;
  padding: 0 15px;
  border: 1px solid var(--wx-border-default);
  border-radius: 10px;
  background: var(--wx-shell-field-bg);
  color: var(--wx-content-primary);
  font: inherit;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  caret-color: var(--wx-brand-primary);
  outline: none;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard),
              box-shadow var(--wx-d-fast) var(--wx-ease-standard),
              background var(--wx-d-fast) var(--wx-ease-standard);
}
.af__input--icon { padding-left: 42px; }
.af__input--trail { padding-right: 44px; }
.af__input--center { text-align: center; letter-spacing: 0.3em; font-weight: var(--wx-fw-bold); font-size: var(--wx-fs-18); }
.af__input::placeholder { color: var(--wx-content-muted); font-weight: var(--wx-fw-regular); letter-spacing: normal; }
.af__input:hover:not(:focus):not(:disabled) { border-color: var(--wx-text-muted); }
.af__input:focus-visible {
  background: var(--wx-surface-base);
  border-color: var(--wx-brand-primary);
  box-shadow: var(--wx-shadow-focus);
}
.af__input:disabled { opacity: 0.6; cursor: not-allowed; }
.af--invalid .af__input {
  border-color: var(--wx-danger-solid);
  background: var(--wx-danger-bg);
}
.af--invalid .af__input:focus-visible { box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-danger-solid) 25%, transparent); }

.af__toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--wx-content-muted);
  cursor: pointer;
  transition: color var(--wx-d-fast) var(--wx-ease-standard), background var(--wx-d-fast) var(--wx-ease-standard);
}
.af__toggle:hover { color: var(--wx-brand-primary); background: var(--wx-surface-sunken); }
.af__toggle:focus-visible { outline: 2px solid var(--wx-border-focus); outline-offset: 1px; }

.af__msg { margin: 0 0 0 2px; font-size: var(--wx-fs-12); color: var(--wx-content-muted); line-height: var(--wx-lh-normal); }
.af__msg--error { color: var(--wx-danger-text); font-weight: var(--wx-fw-medium); }
</style>
