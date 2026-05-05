<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  description?: string
  vertical?: boolean
  layout?: 'horizontal' | 'vertical'
  required?: boolean
  helpText?: string
}>(), {
  description: '',
  vertical: false,
  layout: 'horizontal',
  required: false,
  helpText: '',
})

const isVertical = computed(() => props.vertical || props.layout === 'vertical')
</script>

<template>
  <div class="form-row" :class="{ 'form-row--vertical': isVertical }">
    <span class="form-label">
      {{ props.label }}
      <span v-if="props.required" class="form-required">*</span>
    </span>
    <p v-if="props.description" class="form-desc">{{ props.description }}</p>
    <div class="form-control">
      <slot />
    </div>
    <p v-if="props.helpText" class="form-help">{{ props.helpText }}</p>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  color: var(--text-secondary);
  gap: 16px;
}
.form-row:last-child { border-bottom: none; }
.form-row--vertical {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}
.form-label { flex-shrink: 0; }
.form-required { color: var(--error-color); margin-left: 2px; }
.form-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}
.form-help {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 2px 0 0;
}
.form-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
