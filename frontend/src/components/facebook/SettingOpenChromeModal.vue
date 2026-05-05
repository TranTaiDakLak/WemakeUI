<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const openMode = ref('web')
const site = ref('facebook')
const sites = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'custom', label: 'URL tùy chỉnh' },
]
const customUrl = ref('')
const threadCount = ref(5)
const delaySeconds = ref(3)
const useProxy = ref(false)
const clearCache = ref(false)

function handleOpen() {
  showToast('info', 'Mở trình duyệt — chức năng đang phát triển')
}
</script>

<template>
  <BaseModal :show="show" title="Cài đặt trình duyệt" size="md" show-save save-label="Mở" @close="$emit('close')" @save="handleOpen">
    <div class="chrome-content">
      <div class="gbox">
        <div class="gbox-header">Chế độ mở</div>
        <div class="gbox-body">
          <div class="form-row">
            <label class="radio-label"><input type="radio" v-model="openMode" value="web" /> Mở web</label>
            <label class="radio-label"><input type="radio" v-model="openMode" value="login" /> Login</label>
          </div>
        </div>
      </div>

      <div class="gbox">
        <div class="gbox-header">Trang web</div>
        <div class="gbox-body">
          <div class="form-row">
            <span class="form-label">Chọn trang:</span>
            <select class="form-input" v-model="site">
              <option v-for="s in sites" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div v-if="site === 'custom'" class="form-row">
            <span class="form-label">URL:</span>
            <input type="text" class="form-input" v-model="customUrl" placeholder="https://..." />
          </div>
        </div>
      </div>

      <div class="gbox">
        <div class="gbox-header">Cấu hình</div>
        <div class="gbox-body">
          <div class="form-row"><span class="form-label">Số luồng</span><input type="number" class="form-input form-input--sm" v-model="threadCount" min="1" /></div>
          <div class="form-row"><span class="form-label">Delay (giây)</span><input type="number" class="form-input form-input--sm" v-model="delaySeconds" min="0" /></div>
          <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="useProxy" /> Sử dụng proxy</label></div>
          <div class="form-row"><label class="chk-label"><input type="checkbox" v-model="clearCache" /> Xóa cache trước khi mở</label></div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.chrome-content { display: flex; flex-direction: column; gap: 12px; }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }
</style>
