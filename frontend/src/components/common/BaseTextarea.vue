<script setup lang="ts">
/**
 * BaseTextarea — multi-line input with autosize.
 * Defaults: rows=3, autosize=true, size='md'.
 * Radius: --wx-radius-md (8px).
 */
import { ref, watch, nextTick, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  maxlength?: number | null
  autosize?: boolean
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  rows: 3,
  autosize: true,
  maxlength: null,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const taRef = ref<HTMLTextAreaElement>()

function resize() {
  if (!props.autosize || !taRef.value) return
  taRef.value.style.height = 'auto'
  taRef.value.style.height = taRef.value.scrollHeight + 'px'
}

function onInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
  nextTick(resize)
}

watch(() => props.modelValue, () => nextTick(resize))
onMounted(() => nextTick(resize))
</script>

<template>
  <textarea
    ref="taRef"
    class="wx-textarea"
    :data-size="size"
    :data-state="invalid ? 'invalid' : (disabled ? 'disabled' : (readonly ? 'readonly' : 'default'))"
    :value="modelValue ?? ''"
    :placeholder="placeholder"
    :rows="rows"
    :maxlength="maxlength ?? undefined"
    :disabled="disabled"
    :readonly="readonly"
    :aria-invalid="invalid"
    @input="onInput"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />
</template>

<style scoped>
.wx-textarea {
  width: 100%;
  font-family: var(--wx-font-primary);
  font-size: var(--wx-control-fs);
  line-height: var(--wx-lh-normal);
  color: var(--wx-content-primary);
  background: var(--wx-surface-elevated);
  border: 1px solid var(--wx-border-control);
  border-radius: var(--wx-radius-ctrl);
  padding: var(--wx-space-2) var(--wx-control-px);
  resize: vertical;
  transition: border-color var(--wx-d-fast) var(--wx-ease-standard),
              box-shadow var(--wx-d-fast) var(--wx-ease-standard);
}
.wx-textarea[data-size="sm"] { font-size: var(--wx-fs-12); padding: 6px 10px; border-radius: var(--wx-radius-ctrl-sm); }
.wx-textarea[data-size="lg"] { font-size: var(--wx-fs-14); padding: var(--wx-space-3) 14px; }

.wx-textarea::placeholder { color: var(--wx-text-placeholder); }

.wx-textarea:hover:not([disabled]):not([readonly]):not(:focus) {
  border-color: var(--wx-border-control-hover);
}
.wx-textarea:focus { outline: none; }
.wx-textarea:focus-visible {
  border-color: var(--wx-border-focus);
  box-shadow: var(--wx-ring-focus);
}

.wx-textarea[data-state="invalid"] {
  border-color: var(--wx-danger-solid);
}
.wx-textarea[data-state="invalid"]:focus-visible {
  box-shadow: var(--wx-ring-danger);
}
.wx-textarea[disabled] {
  color: var(--wx-disabled-text);
  border-color: var(--wx-border-default);
  cursor: not-allowed;
  background: var(--wx-disabled-bg);
}
.wx-textarea[readonly] {
  background: var(--wx-bg-sunken);
  cursor: default;
}
</style>
