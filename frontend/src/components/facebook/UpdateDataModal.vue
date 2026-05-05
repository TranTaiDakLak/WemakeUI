<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const updateType = ref('password')
const updateTypes = [
  { value: 'password', label: 'Mật khẩu' },
  { value: 'cookie', label: 'Cookie' },
  { value: 'token', label: 'Token' },
  { value: 'email', label: 'Email' },
  { value: 'passEmail', label: 'Pass Email' },
  { value: '2fa', label: '2FA' },
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'useragent', label: 'Useragent' },
  { value: 'proxy', label: 'Proxy' },
  { value: 'note', label: 'Ghi chú' },
]

const dataText = ref('')
const lineCount = computed(() => dataText.value.trim() ? dataText.value.trim().split('\n').filter(l => l.trim()).length : 0)

function handleUpdate() {
  if (!lineCount.value) { showToast('warning', 'Vui lòng nhập dữ liệu!'); return }
  showToast('success', `Đã cập nhật ${lineCount.value} dòng "${updateTypes.find(t => t.value === updateType.value)?.label}"`)
}
</script>

<template>
  <BaseModal :show="show" title="Cập nhật dữ liệu" size="md" show-save save-label="Cập nhật" @close="$emit('close')" @save="handleUpdate">
    <div class="update-content">
      <div class="update-header">
        <span class="update-label">Loại cập nhật:</span>
        <select class="form-input" v-model="updateType">
          <option v-for="t in updateTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div class="data-header">
        <span class="data-label">Dữ liệu ({{ lineCount }} dòng):</span>
      </div>
      <textarea v-model="dataText" class="data-input" rows="14" placeholder="Mỗi dòng một giá trị..."></textarea>
    </div>
  </BaseModal>
</template>

<style scoped>
.update-content { display: flex; flex-direction: column; gap: 12px; }
.update-header { display: flex; align-items: center; gap: 10px; }
.update-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; white-space: nowrap; }
.data-header { display: flex; align-items: center; }
.data-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
.data-input { padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-family: Consolas, monospace; font-size: 13px; resize: none; background: var(--bg-primary); color: var(--text-secondary); outline: none; }
.data-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.data-input::placeholder { color: var(--text-tertiary); font-family: var(--font-family); }
</style>
