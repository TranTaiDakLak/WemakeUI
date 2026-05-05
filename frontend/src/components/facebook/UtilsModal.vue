<script setup lang="ts">
import { BaseModal } from '../common'
import { useToast } from '../../composables'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()

const utils = [
  { name: 'Sao chép UID', desc: 'Copy danh sách UID đã chọn', icon: 'copy' },
  { name: 'Xuất dữ liệu', desc: 'Export Excel / CSV', icon: 'upload' },
  { name: 'Nhập dữ liệu', desc: 'Import từ file TXT / CSV', icon: 'download' },
  { name: 'Kiểm tra Cookie', desc: 'Check live/die hàng loạt', icon: 'refresh' },
  { name: 'Đổi mật khẩu', desc: 'Đổi mật khẩu hàng loạt', icon: 'lock' },
  { name: 'Mở trình duyệt', desc: 'Mở browser với cookie', icon: 'globe' },
  { name: 'Backup Database', desc: 'Sao lưu toàn bộ dữ liệu', icon: 'save' },
  { name: 'Restore Database', desc: 'Khôi phục từ bản sao lưu', icon: 'database' },
  { name: 'Log hoạt động', desc: 'Xem lịch sử thao tác', icon: 'list' },
]

function onUtilClick(name: string) {
  showToast('info', `${name} — chức năng đang phát triển`)
}
</script>

<template>
  <BaseModal :show="show" title="🔧 Tiện ích" size="lg" @close="$emit('close')">
    <div class="utils-grid">
      <button class="util-card" v-for="u in utils" :key="u.name" @click="onUtilClick(u.name)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <template v-if="u.icon === 'copy'"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></template>
          <template v-else-if="u.icon === 'upload'"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></template>
          <template v-else-if="u.icon === 'download'"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></template>
          <template v-else-if="u.icon === 'refresh'"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></template>
          <template v-else-if="u.icon === 'lock'"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></template>
          <template v-else-if="u.icon === 'globe'"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></template>
          <template v-else-if="u.icon === 'save'"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></template>
          <template v-else-if="u.icon === 'database'"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></template>
          <template v-else><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></template>
        </svg>
        <span class="util-name">{{ u.name }}</span>
        <span class="util-desc">{{ u.desc }}</span>
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.utils-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.util-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: background 0.15s, border-color 0.15s; text-align: center; color: var(--text-secondary); font-family: var(--font-family); }
.util-card:hover { background: var(--card-bg-hover); border-color: var(--brand-primary); }
.util-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.util-desc { font-size: 11px; color: var(--text-tertiary); }
</style>
