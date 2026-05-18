<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, BaseInput, BaseModal } from '../common'

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
  <BaseModal :show="show" :title="`Cập nhật ${label}`" size="sm" @close="show = false">
    <div class="uf-body">
      <p class="uf-desc">Áp dụng cho <strong>{{ count }}</strong> tài khoản đang chọn.</p>
      <BaseInput v-model="value" :placeholder="`Nhập ${label} mới...`" size="sm" autofocus />
    </div>
    <template #footer>
      <div class="uf-footer">
        <BaseButton variant="ghost" @click="show = false">Hủy</BaseButton>
        <BaseButton variant="primary" :disabled="!value" @click="doSave">Lưu</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.uf-body { display: flex; flex-direction: column; gap: var(--wx-space-3); }
.uf-desc { font-size: var(--wx-fs-13); color: var(--wx-text-secondary); margin: 0; }
.uf-footer { display: flex; justify-content: flex-end; gap: var(--wx-space-2); width: 100%; }
</style>
