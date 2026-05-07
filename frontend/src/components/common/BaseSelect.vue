<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  options: Array<{ value: string | number; label: string; group?: string }>
  label?: string
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <div class="base-select" :class="[`base-select--${size ?? 'md'}`]">
    <label v-if="label" class="base-select__label">{{ label }}</label>
    <select
      class="form-input base-select__field"
      :value="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <template v-if="options.some(o => o.group)">
        <template v-for="group in [...new Set(options.filter(o => o.group).map(o => o.group))]" :key="group">
          <optgroup :label="group!">
            <option
              v-for="opt in options.filter(o => o.group === group)"
              :key="opt.value"
              :value="opt.value"
            >{{ opt.label }}</option>
          </optgroup>
        </template>
        <template v-for="opt in options.filter(o => !o.group)" :key="opt.value">
          <option :value="opt.value">{{ opt.label }}</option>
        </template>
      </template>
      <template v-else>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </template>
    </select>
  </div>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.base-select__label {
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-text-secondary);
}

.base-select__field {
  width: 100%;
  cursor: pointer;
  appearance: none;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  background-color: var(--wx-surface-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  color: var(--wx-text-primary);
  font-family: var(--wx-font-primary);
  font-size: var(--wx-fs-13);
  transition:
    border-color var(--wx-d-fast) var(--wx-ease-standard),
    box-shadow   var(--wx-d-fast) var(--wx-ease-standard);
}

.base-select__field:focus {
  outline: none;
  border-color: var(--wx-brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wx-brand-primary) 18%, transparent);
}

.base-select__field:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ── Size sm ── */
.base-select--sm .base-select__field {
  padding: 5px 28px 5px 10px;
  font-size: var(--wx-fs-12);
}
.base-select--sm .base-select__label {
  font-size: var(--wx-fs-11);
}

@media (prefers-reduced-motion: reduce) {
  .base-select__field { transition: none; }
}
</style>
