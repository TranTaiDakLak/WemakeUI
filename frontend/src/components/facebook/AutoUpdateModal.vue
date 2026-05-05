<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

/* ── State ── */
const currentVersion = ref('1.0.0')
const latestVersion = ref('—')
const releaseNotes = ref('')
const isChecking = ref(false)
const hasUpdate = ref(false)
const isForceUpdate = ref(false)

/* Download state */
const isDownloading = ref(false)
const downloadProgress = ref(0)
const downloadTotal = ref(0)
const downloadCurrent = ref(0)
const downloadCancelled = ref(false)

const progressPercent = computed(() =>
  downloadTotal.value > 0 ? Math.round((downloadCurrent.value / downloadTotal.value) * 100) : 0
)

const downloadSizeMB = computed(() => ({
  current: (downloadCurrent.value / 1024 / 1024).toFixed(1),
  total: (downloadTotal.value / 1024 / 1024).toFixed(1),
}))

/* ── Check update ── */
async function handleCheckUpdate() {
  isChecking.value = true
  hasUpdate.value = false
  releaseNotes.value = ''
  // Simulate API call
  await new Promise(r => setTimeout(r, 1500))
  latestVersion.value = '1.1.0'
  releaseNotes.value = `Phiên bản 1.1.0 — 2026-03-22

• Sửa lỗi checkpoint 282 không gỡ được
• Thêm chức năng quản lý BM nâng cao
• Cải thiện hiệu suất auto-like
• Hỗ trợ proxy SOCKS5
• Sửa lỗi nhập tài khoản bị trùng`
  hasUpdate.value = true
  isForceUpdate.value = false // change to true to simulate force update
  isChecking.value = false
  showToast('success', 'Đã tìm thấy phiên bản mới!')
}

/* ── Download ── */
async function handleUpdate() {
  isDownloading.value = true
  downloadCancelled.value = false
  downloadTotal.value = 52_428_800 // 50MB
  downloadCurrent.value = 0

  // Simulate download progress
  const chunkSize = 524_288 // 0.5MB per tick
  const interval = setInterval(() => {
    if (downloadCancelled.value) {
      clearInterval(interval)
      isDownloading.value = false
      downloadCurrent.value = 0
      showToast('warning', 'Đã hủy tải cập nhật.')
      return
    }
    downloadCurrent.value += chunkSize
    downloadProgress.value = progressPercent.value
    if (downloadCurrent.value >= downloadTotal.value) {
      clearInterval(interval)
      downloadCurrent.value = downloadTotal.value
      isDownloading.value = false
      showToast('success', 'Tải cập nhật hoàn tất! Khởi động lại để áp dụng.')
    }
  }, 100)
}

function cancelDownload() {
  downloadCancelled.value = true
}

/* ── Computed ── */
const canClose = computed(() => !isForceUpdate.value || !hasUpdate.value)
</script>

<template>
  <BaseModal
    :show="show"
    title="Cập nhật phần mềm"
    size="md"
    @close="canClose && $emit('close')"
  >
    <div class="update-content">
      <!-- Force update warning -->
      <div v-if="isForceUpdate && hasUpdate" class="force-banner">
        <svg class="force-icon" viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 8 3.5zM8 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="currentColor"/></svg>
        <span>Bắt buộc cập nhật! Vui lòng cập nhật để tiếp tục sử dụng.</span>
      </div>

      <!-- Version info -->
      <div class="version-info">
        <div class="version-row">
          <span class="version-label">Phiên bản hiện tại:</span>
          <span class="version-value">{{ currentVersion }}</span>
        </div>
        <div class="version-row">
          <span class="version-label">Phiên bản mới nhất:</span>
          <span class="version-value" :class="{ 'version-new': hasUpdate }">{{ latestVersion }}</span>
        </div>
      </div>

      <!-- Release notes -->
      <div v-if="releaseNotes" class="gbox">
        <div class="gbox-header">Thông tin cập nhật</div>
        <div class="gbox-body">
          <pre class="release-notes">{{ releaseNotes }}</pre>
        </div>
      </div>

      <!-- Download progress -->
      <div v-if="isDownloading" class="download-section">
        <div class="progress-header">
          <span>Đang tải cập nhật...</span>
          <span class="progress-text">{{ downloadSizeMB.current }} / {{ downloadSizeMB.total }} MB ({{ progressPercent }}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <button class="btn-cancel" @click="cancelDownload">Hủy tải</button>
      </div>

      <!-- Actions -->
      <div v-if="!isDownloading" class="update-actions">
        <button class="btn-check" :disabled="isChecking" @click="handleCheckUpdate">
          <template v-if="isChecking">
            <span class="spinner"></span> Đang kiểm tra...
          </template>
          <template v-else>Kiểm tra cập nhật</template>
        </button>
        <button v-if="hasUpdate" class="btn-update" @click="handleUpdate">
          Cập nhật ngay
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.update-content { display: flex; flex-direction: column; gap: 16px; }
.version-info { display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color); }
.version-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.version-label { color: var(--text-secondary); }
.version-value { font-weight: 600; color: var(--text-primary); font-family: 'Consolas', monospace; }
.version-new { color: var(--success-color); }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; }
.release-notes { font-family: var(--font-family); font-size: 12px; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; margin: 0; max-height: 200px; overflow-y: auto; }

/* Force update banner */
.force-banner { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-md); font-size: 12px; font-weight: 600; color: #991b1b; }
.force-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* Download progress */
.download-section { display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-color); }
.progress-header { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); }
.progress-text { font-family: 'Consolas', monospace; font-weight: 600; }
.progress-bar { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--brand-primary); border-radius: 4px; transition: width 0.15s ease; }
.btn-cancel { align-self: flex-end; padding: 4px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #fff; color: var(--text-secondary); font-size: 11px; cursor: pointer; font-family: var(--font-family); }
.btn-cancel:hover { background: #fef2f2; color: var(--error-color); border-color: #fecaca; }

/* Actions */
.update-actions { display: flex; gap: 8px; justify-content: center; }
.btn-check { padding: 8px 20px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-tertiary); color: var(--text-secondary); font-family: var(--font-family); font-size: 13px; cursor: pointer; transition: background 0.15s; display: inline-flex; align-items: center; gap: 6px; }
.btn-check:hover:not(:disabled) { background: var(--hover-bg); }
.btn-check:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-update { padding: 8px 20px; border: none; border-radius: var(--radius-sm); background: var(--brand-primary); color: #fff; font-family: var(--font-family); font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
.btn-update:hover { opacity: 0.85; }
.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid var(--border-color); border-top-color: var(--brand-primary); border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
