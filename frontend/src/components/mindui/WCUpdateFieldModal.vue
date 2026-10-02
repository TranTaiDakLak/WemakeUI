<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput } from '../common'
import { SHELL_ICONS } from '../layout/shell-icons'
import MindDialog from './MindDialog.vue'
import MindField from './MindField.vue'

const show = defineModel<boolean>({ required: true })
const props = defineProps<{ field: string; label: string; count: number }>()
const emit = defineEmits<{ save: [field: string, value: string] }>()

const value = ref('')

function doSave() {
  emit('save', props.field, value.value)
  show.value = false
  value.value = ''
}
</script>

<template>
  <MindDialog
    v-model="show"
    :title="`Cập nhật ${label}`"
    :subtitle="`Áp dụng cho ${count} bản ghi đang chọn`"
    :icon="SHELL_ICONS.sliders"
    size="sm"
  >
    <div class="uf-body">
      <MindField :label="`${label} mới`" stacked>
        <BaseInput v-model="value" :placeholder="`Nhập ${label} mới...`" size="sm" @keyup.enter="value && doSave()" />
      </MindField>
      <p v-if="count === 0" class="uf-note">
        Chưa có bản ghi nào được chọn — hãy tích chọn bản ghi trong bảng trước khi cập nhật.
      </p>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
      <BaseButton variant="primary" :disabled="!value" @click="doSave">Lưu</BaseButton>
    </template>
  </MindDialog>
</template>

<style scoped>
.uf-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.uf-note {
  margin: 0;
  padding: var(--wx-space-2) var(--wx-space-3);
  border: 1px solid var(--wx-warning-border);
  border-radius: var(--wx-radius-md);
  background: var(--wx-warning-bg);
  color: var(--wx-warning-text);
  font-size: var(--wx-fs-12);
  font-weight: var(--wx-fw-medium);
}
</style>
