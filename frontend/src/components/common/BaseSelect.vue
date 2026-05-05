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
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.base-select__field {
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}

/* ── Size sm ── */
.base-select--sm .base-select__field {
  padding: 4px 28px 4px 8px;
  font-size: 11px;
}
.base-select--sm .base-select__label {
  font-size: 11px;
}
</style>
