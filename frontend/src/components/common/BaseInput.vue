<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number
  type?: 'text' | 'number' | 'password' | 'email'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  return props.type ?? 'text'
})
</script>

<template>
  <div class="base-input" :class="[`base-input--${size ?? 'md'}`]">
    <label v-if="label" class="base-input__label">{{ label }}</label>
    <div class="base-input__wrapper" :class="{ 'base-input__wrapper--error': error }">
      <input
        class="form-input base-input__field"
        :class="{ 'base-input__field--has-toggle': type === 'password' }"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="base-input__eye"
        tabindex="-1"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? '◉' : '○' }}
      </button>
    </div>
    <span v-if="error" class="base-input__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.base-input__field {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background: var(--wx-surface-sunken);
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
  font-size: 13px;
  transition: border-color var(--wx-duration-fast), box-shadow var(--wx-duration-fast);
}

.base-input__field:focus {
  outline: none;
  border-color: var(--wx-brand-focus);
  box-shadow: var(--wx-shadow-focus);
}

.base-input__field--has-toggle {
  padding-right: 30px;
}

.base-input__wrapper--error .base-input__field {
  border-color: var(--wx-danger-solid);
  box-shadow: 0 0 0 3px var(--wx-danger-bg);
}

.base-input__eye {
  position: absolute;
  right: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--wx-text-muted);
  font-size: 14px;
  padding: 2px;
  line-height: 1;
  transition: color var(--wx-duration-fast);
}
.base-input__eye:hover {
  color: var(--wx-text-primary);
}

.base-input__error {
  font-size: 11px;
  color: var(--wx-danger-text);
}

/* ── Size sm ── */
.base-input--sm .base-input__field {
  padding: 4px 8px;
  font-size: 11px;
}
.base-input--sm .base-input__label {
  font-size: 11px;
}
</style>
