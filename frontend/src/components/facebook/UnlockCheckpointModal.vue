<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const cpType = ref('282')
const cpTypes = [
  { value: '282', label: 'Checkpoint 282' },
  { value: '956', label: 'Checkpoint 956' },
  { value: 'selfie', label: 'Xác minh Selfie' },
  { value: 'sms', label: 'Xác minh SMS' },
]

const autoConfirmEmail = ref(false)
const autoUploadPhoto = ref(false)
const threadCount = ref(5)

function handleRun() {
  showToast('info', `Gỡ ${cpTypes.find(t => t.value === cpType.value)?.label} — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" title="Gỡ Checkpoint" size="md" show-save save-label="Chạy" @close="$emit('close')" @save="handleRun">
    <div class="cp-content">
      <div class="gbox">
        <div class="gbox-header">Loại Checkpoint</div>
        <div class="gbox-body">
          <div class="form-row">
            <label v-for="cp in cpTypes" :key="cp.value" class="radio-label">
              <input type="radio" v-model="cpType" :value="cp.value" /> {{ cp.label }}
            </label>
          </div>
        </div>
      </div>

      <div class="gbox">
        <div class="gbox-header">Tùy chọn</div>
        <div class="gbox-body">
          <div class="form-row"><span class="form-label">Số luồng</span><input type="number" class="form-input form-input--sm" v-model="threadCount" min="1" /></div>
          <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="autoConfirmEmail" /> Tự động xác nhận email</label></div>
          <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="autoUploadPhoto" /> Tự động upload ảnh</label></div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.cp-content { display: flex; flex-direction: column; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }
</style>
