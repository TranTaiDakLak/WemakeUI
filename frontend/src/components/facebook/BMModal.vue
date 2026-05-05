<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const activeTab = ref('create')
const tabs = [
  { key: 'create', label: 'Tạo BM' },
  { key: 'createTKQC', label: 'Tạo TKQC' },
  { key: 'getLink', label: 'Nhận link BM' },
  { key: 'receive', label: 'Nhận BM' },
  { key: 'change', label: 'Thay đổi BM' },
  { key: 'check', label: 'Kiểm tra BM' },
  { key: 'out', label: 'Out BM' },
  { key: 'restore', label: 'Restore BM' },
]

function handleRun() {
  showToast('info', `${tabs.find(t => t.key === activeTab.value)?.label} — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" title="Business Manager" size="lg" show-save save-label="Chạy" @close="$emit('close')" @save="handleRun">
    <div class="bm-content">
      <div class="bm-tabs">
        <button v-for="t in tabs" :key="t.key" class="bm-tab" :class="{ 'bm-tab--active': activeTab === t.key }" @click="activeTab = t.key">{{ t.label }}</button>
      </div>
      <div class="bm-panel">
        <template v-if="activeTab === 'create'">
          <div class="gbox">
            <div class="gbox-header">Tạo Business Manager</div>
            <div class="gbox-body">
              <div class="form-row"><span class="form-label">Tên BM</span><input type="text" class="form-input" placeholder="Nhập tên BM..." /></div>
              <div class="form-row"><span class="form-label">Timezone</span>
                <select class="form-input"><option>Asia/Ho_Chi_Minh</option><option>America/New_York</option><option>Europe/London</option></select>
              </div>
              <div class="form-row"><span class="form-label">Tiền tệ</span>
                <select class="form-input"><option>VND</option><option>USD</option><option>EUR</option></select>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="activeTab === 'createTKQC'">
          <div class="gbox">
            <div class="gbox-header">Tạo tài khoản quảng cáo trên BM</div>
            <div class="gbox-body">
              <div class="form-row"><span class="form-label">Tên TKQC</span><input type="text" class="form-input" placeholder="Nhập tên TKQC..." /></div>
              <div class="form-row"><span class="form-label">Tiền tệ</span>
                <select class="form-input"><option>VND</option><option>USD</option></select>
              </div>
              <div class="form-row"><span class="form-label">Múi giờ</span>
                <select class="form-input"><option>Asia/Ho_Chi_Minh</option><option>America/New_York</option></select>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="placeholder-panel">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            <p>{{ tabs.find(t => t.key === activeTab)?.label }} — đang phát triển</p>
          </div>
        </template>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.bm-content { display: flex; flex-direction: column; gap: 12px; }
.bm-tabs { display: flex; flex-wrap: wrap; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
.bm-tab { padding: 5px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-primary); color: var(--text-secondary); font-family: var(--font-family); font-size: 11px; cursor: pointer; transition: all 0.15s; }
.bm-tab:hover { background: var(--hover-bg); }
.bm-tab--active { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
.gbox { border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; }
.gbox-header { padding: 8px 14px; font-size: 12px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.4px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.gbox-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.form-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-secondary); gap: 16px; }
.form-row:last-child { border-bottom: none; }
.form-label { flex: 1; }
.placeholder-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 60px 20px; color: var(--text-tertiary); }
.placeholder-panel p { font-size: 14px; font-style: italic; }
</style>
