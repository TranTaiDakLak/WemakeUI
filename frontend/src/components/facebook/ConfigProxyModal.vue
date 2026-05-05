<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const proxyText = ref('')
const proxyCount = computed(() => proxyText.value.trim() ? proxyText.value.trim().split('\n').filter(l => l.trim()).length : 0)

const proxyType = ref('HTTP')
const proxyTypes = ['HTTP', 'Sock5']

const accountPerProxy = ref(1)
const assignMode = ref('sequential')

const skipExisting = ref(false)

function handleSave() {
  if (!proxyCount.value) { showToast('warning', 'Vui lòng nhập proxy!'); return }
  showToast('success', `Đã lưu ${proxyCount.value} proxy (${proxyType.value})`)
}

function handleDeleteAll() {
  proxyText.value = ''
  showToast('info', 'Đã xóa tất cả proxy')
}
</script>

<template>
  <BaseModal :show="show" title="Cấu hình proxy" size="md" @close="$emit('close')">
    <div class="proxy-content">
      <div class="proxy-header">
        <span class="proxy-label">Danh sách proxy ({{ proxyCount }}):</span>
      </div>
      <textarea v-model="proxyText" class="proxy-input" rows="12"
        placeholder="host:port:user:pass&#10;host:port&#10;&#10;Mỗi proxy một dòng..."></textarea>

      <div class="proxy-options">
        <div class="form-row">
          <span class="form-label">Loại proxy:</span>
          <select class="form-input form-input--sm" v-model="proxyType">
            <option v-for="t in proxyTypes" :key="t">{{ t }}</option>
          </select>
        </div>
        <div class="form-row">
          <span class="form-label">Tài khoản/proxy:</span>
          <input type="number" class="form-input form-input--sm" v-model="accountPerProxy" min="1" />
        </div>
        <div class="form-row">
          <label class="radio-label"><input type="radio" v-model="assignMode" value="sequential" /> Thêm lần lượt</label>
          <label class="radio-label"><input type="radio" v-model="assignMode" value="random" /> Thêm ngẫu nhiên</label>
        </div>
        <div class="form-row">
          <label class="chk-label"><input type="checkbox" v-model="skipExisting" /> Không nhập TK đã có proxy</label>
        </div>
      </div>

      <div class="proxy-actions">
        <button class="proxy-btn proxy-btn--primary" @click="handleSave">Lưu</button>
        <button class="proxy-btn proxy-btn--warning" @click="handleDeleteAll">Xóa hết</button>
        <button class="proxy-btn proxy-btn--secondary" @click="$emit('close')">Đóng</button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.proxy-content { display: flex; flex-direction: column; gap: 12px; }
.proxy-header { display: flex; align-items: center; }
.proxy-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
.proxy-input { padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-family: Consolas, monospace; font-size: 13px; resize: none; background: var(--bg-primary); color: var(--text-secondary); outline: none; }
.proxy-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
.proxy-input::placeholder { color: var(--text-tertiary); font-family: var(--font-family); }
.proxy-options { display: flex; flex-direction: column; gap: 4px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }
.proxy-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px; }
.proxy-btn { padding: 7px 18px; border: none; border-radius: var(--radius-sm); font-family: var(--font-family); font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
.proxy-btn:hover { opacity: 0.85; }
.proxy-btn--primary { background: var(--brand-primary); color: #fff; }
.proxy-btn--warning { background: var(--warning-color); color: #fff; }
.proxy-btn--secondary { background: var(--border-color); color: var(--text-primary); }
</style>
