<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { BaseModal } from '../common'
import { useToast } from '../../composables'
import { useAccountsStore } from '../../stores/accounts'
import { useCategoriesStore } from '../../stores/categories'

defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()

const { showToast } = useToast()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()

function getCategoryName(catId: number | null): string {
  if (catId === null) return '—'
  const cat = categoriesStore.categories.find(c => c.id === catId)
  return cat ? cat.name : '—'
}

/* ── Selection ── */
const selectedIds = ref<Set<number>>(new Set())

const allSelected = computed({
  get: () => accountsStore.deletedAccounts.length > 0
    && selectedIds.value.size === accountsStore.deletedAccounts.length,
  set: (v: boolean) => {
    if (v) selectedIds.value = new Set(accountsStore.deletedAccounts.map(a => a.id))
    else selectedIds.value = new Set()
  },
})

function toggleSelect(id: number) {
  const s = new Set(selectedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedIds.value = s
}

const selectedCount = computed(() => selectedIds.value.size)

/* ── Inline confirm for permanent delete ── */
const showDeleteConfirm = ref(false)

function requestDelete() {
  if (!selectedCount.value) { showToast('warning', 'Vui lòng chọn tài khoản cần xóa!'); return }
  showDeleteConfirm.value = true
}

function confirmDelete() {
  for (const id of selectedIds.value) {
    accountsStore.permanentDelete(id)
  }
  showToast('success', `Đã xóa vĩnh viễn ${selectedIds.value.size} tài khoản.`)
  selectedIds.value = new Set()
  showDeleteConfirm.value = false
}

function cancelDelete() {
  showDeleteConfirm.value = false
}

/* ── Restore ── */
function restoreSelected() {
  if (!selectedCount.value) { showToast('warning', 'Vui lòng chọn tài khoản cần khôi phục!'); return }
  for (const id of selectedIds.value) {
    accountsStore.restoreAccount(id)
  }
  showToast('success', `Đã khôi phục ${selectedIds.value.size} tài khoản.`)
  selectedIds.value = new Set()
}

/* ── Reset selection when modal opens ── */
watch(() => accountsStore.deletedAccounts.length, () => {
  // Remove ids that no longer exist in deleted list
  const validIds = new Set(accountsStore.deletedAccounts.map(a => a.id))
  const cleaned = new Set([...selectedIds.value].filter(id => validIds.has(id)))
  if (cleaned.size !== selectedIds.value.size) selectedIds.value = cleaned
})
</script>

<template>
  <BaseModal :show="show" title="Thùng rác" size="lg" @close="$emit('close')">
    <div class="trash-content">
      <!-- Inline delete confirm bar -->
      <div v-if="showDeleteConfirm" class="trash-confirm-bar">
        <span>Xóa vĩnh viễn {{ selectedCount }} tài khoản? Không thể hoàn tác!</span>
        <button class="confirm-btn confirm-btn--danger" @click="confirmDelete">Xóa</button>
        <button class="confirm-btn confirm-btn--cancel" @click="cancelDelete">Hủy</button>
      </div>

      <div class="trash-toolbar">
        <button class="toolbar-btn toolbar-btn--restore" @click="restoreSelected">
          <svg class="tb-icon" viewBox="0 0 16 16"><path d="M2 8a6 6 0 0 1 10.89-3.48l.71-.71A7 7 0 0 0 1 8h1zm12 0a6 6 0 0 1-10.89 3.48l-.71.71A7 7 0 0 0 15 8h-1zM8 4v4l3 1.5-.5 1L7 9V4h1z" fill="currentColor"/></svg>
          Khôi phục
        </button>
        <button class="toolbar-btn toolbar-btn--delete" @click="requestDelete">
          <svg class="tb-icon" viewBox="0 0 16 16"><path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zM14 3a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h3.5l.5-.5h2l.5.5H13a1 1 0 0 1 1 1zM4 4.5V14a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.5H4z" fill="currentColor"/></svg>
          Xóa vĩnh viễn
        </button>
        <span class="trash-count">
          {{ accountsStore.deletedAccounts.length }} tài khoản
          <template v-if="selectedCount"> · {{ selectedCount }} đã chọn</template>
        </span>
      </div>

      <div class="trash-grid">
        <table class="trash-table">
          <thead>
            <tr>
              <th style="width:36px;text-align:center"><input type="checkbox" v-model="allSelected" /></th>
              <th style="width:40px;text-align:center">STT</th>
              <th style="min-width:130px">UID</th>
              <th style="min-width:120px">Họ tên</th>
              <th style="min-width:80px">Trạng thái</th>
              <th style="min-width:140px">Ngày xóa</th>
              <th style="min-width:100px">Thư mục</th>
              <th style="min-width:120px">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!accountsStore.deletedAccounts.length">
              <td colspan="8" style="text-align:center;padding:24px;color:var(--text-tertiary)">Thùng rác trống</td>
            </tr>
            <tr
              v-for="(acc, idx) in accountsStore.deletedAccounts"
              :key="acc.id"
              :class="{ 'row-selected': selectedIds.has(acc.id) }"
            >
              <td style="text-align:center">
                <input type="checkbox" :checked="selectedIds.has(acc.id)" @change="toggleSelect(acc.id)" />
              </td>
              <td style="text-align:center;color:var(--text-tertiary)">{{ idx + 1 }}</td>
              <td style="font-family:Consolas,monospace;font-size:11px">{{ acc.uid }}</td>
              <td style="color:var(--text-primary);font-weight:500">{{ acc.fullName }}</td>
              <td>
                <span class="status-badge" :class="'status-' + acc.status.toLowerCase()">{{ acc.status || '—' }}</span>
              </td>
              <td>{{ acc.deletedAt }}</td>
              <td>{{ getCategoryName(acc.categoryId) }}</td>
              <td style="color:var(--text-secondary)">{{ acc.note || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.trash-content { display: flex; flex-direction: column; gap: 0; }
.trash-toolbar { display: flex; align-items: center; padding: 8px 0; gap: 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 8px; }
.toolbar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border: none; border-radius: 12px; font-family: var(--wx-font-primary, 'Inter', sans-serif); font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; border-top: 1px solid rgba(255,255,255,0.2); }
.toolbar-btn:hover { filter: brightness(1.05); }
.toolbar-btn:active { transform: scale(0.98); }
.toolbar-btn--restore { background: linear-gradient(to right, #10b981, #059669); color: #fff; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.25); }
.toolbar-btn--restore:hover { box-shadow: 0 15px 25px -5px rgba(16, 185, 129, 0.4); }
.toolbar-btn--delete { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.25); }
.toolbar-btn--delete:hover { box-shadow: 0 15px 25px -5px rgba(239, 68, 68, 0.4); }
.tb-icon { width: 14px; height: 14px; flex-shrink: 0; }
.trash-count { margin-left: auto; font-size: 12px; color: var(--text-tertiary); }
.trash-grid { overflow: auto; max-height: 400px; }
.trash-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.trash-table th { position: sticky; top: 0; z-index: 1; padding: 8px 10px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.trash-table td { padding: 7px 10px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; }
.trash-table tbody tr:hover td { background: var(--hover-bg); }
.trash-table .row-selected td { background: rgba(59,130,246,0.08); }
.trash-table input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }

/* Status badges */
.status-badge { display: inline-block; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
.status-live { background: #dcfce7; color: #166534; }
.status-die { background: #fee2e2; color: #991b1b; }
.status-checkpoint { background: #fef3c7; color: #92400e; }
.status-none, .status- { background: #f3f4f6; color: #6b7280; }

/* Inline delete confirm */
.trash-confirm-bar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 8px; font-size: 12px; color: #991b1b; font-weight: 500; }
.confirm-btn { padding: 6px 16px; border: none; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; border-top: 1px solid rgba(255,255,255,0.2); }
.confirm-btn--danger { background: linear-gradient(to right, #f43f5e, #dc2626); color: #fff; box-shadow: 0 6px 12px -3px rgba(239, 68, 68, 0.3); }
.confirm-btn--danger:hover { filter: brightness(1.05); }
.confirm-btn--cancel { background: #fff; color: #334155; border: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
.confirm-btn--cancel:hover { background: #f8fafc; }
</style>
