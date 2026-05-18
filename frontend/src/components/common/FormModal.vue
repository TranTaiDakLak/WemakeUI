<script setup lang="ts">
/**
 * FormModal — wrapper pattern over BaseModal for standard form popups.
 *
 * Usage:
 *   <FormModal v-model="show" title="Thêm người dùng" @submit="handleSubmit">
 *     <FormField label="Tên"><BaseInput v-model="form.name" /></FormField>
 *   </FormModal>
 */
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { ModalSize } from '../../types'

withDefaults(defineProps<{
  modelValue: boolean
  title: string
  size?: ModalSize
  loading?: boolean
  submitLabel?: string
  cancelLabel?: string
  danger?: boolean
  submitDisabled?: boolean
  closable?: boolean
}>(), {
  size: 'md',
  loading: false,
  submitLabel: 'Lưu',
  cancelLabel: 'Huỷ',
  danger: false,
  submitDisabled: false,
  closable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :show="modelValue"
    :title="title"
    :size="size"
    :loading="loading"
    :closable="closable"
    @close="close"
  >
    <slot />

    <template #footer>
      <div class="fm-footer">
        <slot name="footer-extra" />
        <div class="fm-footer__actions">
          <BaseButton variant="ghost" :disabled="loading" @click="close">
            {{ cancelLabel }}
          </BaseButton>
          <BaseButton
            :variant="danger ? 'danger' : 'primary'"
            :loading="loading"
            :disabled="submitDisabled"
            type="submit"
            @click="emit('submit')"
          >
            {{ submitLabel }}
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.fm-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--wx-space-2);
}

.fm-footer__actions {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
  margin-left: auto;
}
</style>
