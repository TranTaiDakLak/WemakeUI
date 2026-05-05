<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputRef = ref<HTMLInputElement>()

watch(() => props.indeterminate, (val) => {
  if (inputRef.value) inputRef.value.indeterminate = !!val
}, { immediate: true })
</script>

<template>
  <label class="chk-label base-checkbox" :class="{ 'base-checkbox--disabled': disabled }">
    <input
      ref="inputRef"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="label">{{ label }}</span>
  </label>
</template>

<style scoped>
.base-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
