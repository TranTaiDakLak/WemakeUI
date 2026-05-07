<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { BaseDataGrid, ContextMenu, StatusBar } from '../../components/common'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { useAccountsStore } from '../../stores/weconnect/accounts'
import { useSettingsStore } from '../../stores/weconnect/settings'
import { useCategoriesStore } from '../../stores/weconnect/categories'
import type { ContextMenuItem, GridStats } from '../../types'
import type { AccountRow } from '../../types/account'

import WCMenuStrip from '../../components/weconnect/WCMenuStrip.vue'
import WCActionBar from '../../components/weconnect/WCActionBar.vue'
import WCSetupToolModal from '../../components/weconnect/WCSetupToolModal.vue'
import WCSetupInteractModal from '../../components/weconnect/WCSetupInteractModal.vue'
import WCSetupViewModal from '../../components/weconnect/WCSetupViewModal.vue'
import WCAddAccountModal from '../../components/weconnect/WCAddAccountModal.vue'
import WCAddAccountReviewModal from '../../components/weconnect/WCAddAccountReviewModal.vue'
import WCUpdateFieldModal from '../../components/weconnect/WCUpdateFieldModal.vue'
import WCTrashModal from '../../components/weconnect/WCTrashModal.vue'
import WCContactModal from '../../components/weconnect/WCContactModal.vue'
import WCUtilsModal from '../../components/weconnect/WCUtilsModal.vue'
import WCCategoryModal from '../../components/weconnect/WCCategoryModal.vue'

// ── Stores ──────────────────────────────────────────
const accountsStore = useAccountsStore()
const settingsStore = useSettingsStore()
const categoriesStore = useCategoriesStore()

// ── Modal state ──────────────────────────────────────
type ModalName = 'settings' | 'interaction' | 'display' | 'add' | 'trash' | 'contact' | 'utils' | 'category'
const activeModal = ref<ModalName | null>(null)

function openModal(name: string) { activeModal.value = name as ModalName }

// ── ActionBar state ──────────────────────────────────
const isRunning = ref(false)

// ── Add Account flow ─────────────────────────────────
const previewRows = ref<string[][]>([])
const previewFields = ref<string[]>([])
const showAddReview = ref(false)

function onPreview(rows: string[][]) {
  previewRows.value = rows
  previewFields.value = settingsStore.dgvColumns.filter(c => c.visible).map(c => c.label)
  activeModal.value = null
  showAddReview.value = true
}

function confirmImport() {
  showAddReview.value = false
}

// ── Update Field ─────────────────────────────────────
const updateFieldState = ref({ show: false, field: '', label: '', count: 0 })

function openUpdateField(field: string) {
  const LABELS: Record<string, string> = {
    password: 'Mật khẩu', cookie: 'Cookie', token: 'Token', email: 'Email',
    passEmail: 'Pass Email', twofa: '2FA', birthday: 'Sinh nhật', ua: 'Useragent',
    proxy: 'Proxy', note: 'Ghi chú',
  }
  updateFieldState.value = {
    show: true,
    field,
    label: LABELS[field] ?? field,
    count: accountsStore.accounts.filter(a => a.chose).length,
  }
}

function onUpdateField(field: string, value: string) {
  const ids = accountsStore.accounts.filter(a => a.chose).map(a => a.id)
  accountsStore.updateField(ids, field as keyof AccountRow, value)
}

// ── DataGrid ─────────────────────────────────────────
const visibleColumns = computed(() => settingsStore.dgvColumns.filter(c => c.visible))
const selectedCells = ref<{ row: number; col: string }[]>([])

const contextMenuState = ref({ show: false, x: 0, y: 0 })
let mouseDownRow = -1

function onRowMousedown(idx: number, e: MouseEvent) {
  mouseDownRow = idx
  const ids = accountsStore.highlightedIds
  if (e.shiftKey && ids.size > 0) {
    const last = Math.max(...ids)
    const newSet = new Set<number>()
    const min = Math.min(last, idx)
    const max = Math.max(last, idx)
    for (let i = min; i <= max; i++) newSet.add(i)
    accountsStore.setHighlighted(newSet)
  } else if (e.ctrlKey || e.metaKey) {
    const newSet = new Set(ids)
    if (newSet.has(idx)) newSet.delete(idx)
    else newSet.add(idx)
    accountsStore.setHighlighted(newSet)
  } else {
    accountsStore.setHighlighted(new Set([idx]))
  }
}

function onRowMouseenter(idx: number) {
  if (mouseDownRow >= 0 && mouseDownRow !== idx) {
    const newSet = new Set<number>()
    const min = Math.min(mouseDownRow, idx)
    const max = Math.max(mouseDownRow, idx)
    for (let i = min; i <= max; i++) newSet.add(i)
    accountsStore.setHighlighted(newSet)
  }
}

function onMouseup() { mouseDownRow = -1 }

function onDblclick(idx: number) { accountsStore.dblclickRow(idx) }

function onCellClick(row: number, col: string, e: MouseEvent) {
  if (e.ctrlKey || e.metaKey) {
    const exists = selectedCells.value.findIndex(c => c.row === row && c.col === col)
    if (exists > -1) selectedCells.value.splice(exists, 1)
    else selectedCells.value.push({ row, col })
  } else {
    selectedCells.value = [{ row, col }]
  }
}

function onContextMenu(e: MouseEvent) {
  contextMenuState.value = { show: true, x: e.clientX, y: e.clientY }
}

function onSort(column: string, dir: 'asc' | 'desc') {
  accountsStore.setSort(column, dir)
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    const highlighted = [...accountsStore.highlightedIds]
    if (highlighted.length === 0) return
    const rows = highlighted.map(idx => accountsStore.filteredAccounts[idx])
      .filter(Boolean)
      .map(r => visibleColumns.value.map(c => String((r as Record<string, unknown>)[c.key] ?? '')).join('\t'))
    navigator.clipboard?.writeText(rows.join('\n')).catch(() => {})
  }
  if (e.key === ' ') {
    accountsStore.selectHighlighted()
  }
}

function copyField(field: keyof AccountRow) {
  const text = accountsStore.accounts
    .filter(a => a.chose)
    .map(a => String(a[field] ?? ''))
    .join('\n')
  navigator.clipboard?.writeText(text).catch(() => {})
}

// ── Context menu items ────────────────────────────────
const contextMenuItems = computed<ContextMenuItem[]>(() => [
  {
    id: 'select', label: 'Chọn',
    children: [
      { id: 'sel-all',      label: 'Tất cả',    action: () => accountsStore.selectAll() },
      { id: 'sel-hl',       label: 'Bôi đen',   action: () => accountsStore.selectHighlighted() },
      {
        id: 'sel-status', label: 'Trạng thái ▶',
        children: accountsStore.uniqueStatuses.map(s => ({
          id: `sel-st-${s}`, label: s, action: () => accountsStore.selectByStatus(s),
        })),
      },
      {
        id: 'sel-action', label: 'Hoạt động ▶',
        children: accountsStore.uniqueActions.map(a => ({
          id: `sel-act-${a}`, label: a, action: () => {},
        })),
      },
      {
        id: 'sel-note', label: 'Ghi chú ▶',
        children: accountsStore.uniqueNotes.map(n => ({
          id: `sel-note-${n}`, label: n, action: () => accountsStore.selectByNote(n),
        })),
      },
      {
        id: 'sel-cp282', label: 'Trạng thái 282 ▶',
        children: accountsStore.uniqueCheckpoints.map(c => ({
          id: `sel-cp-${c}`, label: c, action: () => {},
        })),
      },
    ],
  },
  { id: 'deselect', label: 'Bỏ chọn tất cả', action: () => accountsStore.unselectAll() },
  { id: 'sep1',  label: '', separator: true },
  {
    id: 'copy', label: 'Sao chép',
    children: [
      { id: 'cp-uid',     label: 'UID',                     action: () => copyField('uid') },
      { id: 'cp-pass',    label: 'Mật khẩu',                action: () => copyField('password') },
      { id: 'cp-2fa',     label: '2FA',                     action: () => copyField('twofa') },
      { id: 'cp-all',     label: 'Toàn bộ định dạng vào',   action: () => {} },
      { id: 'cp-email',   label: 'Email|Pass email',        action: () => copyField('email') },
      { id: 'cp-cookie',  label: 'Cookie',                  action: () => copyField('cookie') },
      { id: 'cp-token',   label: 'Token',                   action: () => copyField('token') },
      { id: 'cp-2facode', label: 'Lấy code 2FA',            action: () => {} },
      { id: 'cp-sep1',    label: '',                        separator: true },
      { id: 'cp-status',  label: 'Trạng thái',              action: () => copyField('status') },
      { id: 'cp-cpnote',  label: 'Ghi chú checkpoint',      action: () => {} },
      { id: 'cp-sep2',    label: '',                        separator: true },
      { id: 'cp-custom',  label: 'Tùy chỉnh',               action: () => {} },
    ],
  },
  { id: 'delete', label: 'Xóa tài khoản', danger: true, action: () => accountsStore.deleteSelected() },
  {
    id: 'check', label: 'Kiểm tra TK',
    children: [
      { id: 'chk-fb',    label: 'Facebook',              action: () => {} },
      { id: 'chk-ig',    label: 'Instagram',             action: () => {} },
      { id: 'chk-info',  label: 'Thông tin TK',          action: () => {} },
      { id: 'chk-pass',  label: 'Kiểm tra pass',         action: () => {} },
      { id: 'chk-email', label: 'Kiểm tra liên kết mail',action: () => {} },
    ],
  },
  { id: 'sep2', label: '', separator: true },
  {
    id: 'update', label: 'Cập nhật dữ liệu',
    children: [
      { id: 'upd-pass',     label: 'Mật khẩu',  action: () => openUpdateField('password') },
      { id: 'upd-cookie',   label: 'Cookie',    action: () => openUpdateField('cookie') },
      { id: 'upd-token',    label: 'Token',     action: () => openUpdateField('token') },
      { id: 'upd-email',    label: 'Email',     action: () => openUpdateField('email') },
      { id: 'upd-pamail',   label: 'Pass Email',action: () => openUpdateField('passEmail') },
      { id: 'upd-2fa',      label: '2FA',       action: () => openUpdateField('twofa') },
      { id: 'upd-birthday', label: 'Sinh nhật', action: () => openUpdateField('birthday') },
      { id: 'upd-ua',       label: 'Useragent', action: () => openUpdateField('ua') },
      { id: 'upd-proxy',    label: 'Proxy',     action: () => openUpdateField('proxy') },
      { id: 'upd-note',     label: 'Ghi chú',   action: () => openUpdateField('note') },
    ],
  },
  {
    id: 'move', label: 'Chuyển dữ liệu',
    children: categoriesStore.categories.filter(c => c.id !== 0).map(c => ({
      id: `mv-${c.id}`, label: c.name,
      action: () => {
        const ids = accountsStore.accounts.filter(a => a.chose).map(a => a.id)
        accountsStore.moveToCategory(ids, c.id)
      },
    })),
  },
  { id: 'sep3', label: '', separator: true },
  {
    id: 'browser', label: 'Trình duyệt',
    children: [
      { id: 'br-open',    label: 'Mở',              action: () => {} },
      { id: 'br-close',   label: 'Đóng tất cả',     action: () => {} },
      { id: 'br-delete',  label: 'Xóa',             action: () => {} },
      { id: 'br-setting', label: 'Cài đặt',         action: () => {} },
      { id: 'br-opt',     label: 'Tối ưu',          action: () => {} },
      { id: 'br-clean',   label: 'Dọn dẹp thư mục', action: () => {} },
    ],
  },
  {
    id: 'request', label: 'Request',
    children: [
      { id: 'req-login', label: 'Login && Get Cookie|Token', action: () => {} },
    ],
  },
  {
    id: 'hotmail', label: 'Hotmail',
    children: [
      { id: 'hm-browser', label: 'Mở trình duyệt', action: () => {} },
      { id: 'hm-oauth',   label: 'Get OAuth2',      action: () => {} },
    ],
  },
  { id: 'sep4', label: '', separator: true },
  {
    id: 'ads-bm', label: 'Hiển thị ADS && BM',
    children: [
      { id: 'ads-analyze', label: 'Phân tích',            action: () => {} },
      { id: 'ads-create',  label: 'Tạo TK quảng cáo 2025',action: () => {} },
    ],
  },
  { id: 'sep5', label: '', separator: true },
  {
    id: 'other', label: 'Chức năng khác',
    children: [
      { id: 'oth-dedup', label: 'Lọc tài khoản trùng', action: () => {} },
      { id: 'oth-clear', label: 'Xóa dữ liệu chạy',   action: () => {} },
      { id: 'oth-log',   label: 'Thư mục log',         action: () => {} },
    ],
  },
  { id: 'reload', label: 'Tải lại danh sách', action: () => accountsStore.loadMockData() },
  { id: 'assign', label: 'Gán thiết bị',       action: () => {} },
])

// ── StatusBar stats ───────────────────────────────────
const gridStats = computed<GridStats>(() => ({
  total:       accountsStore.stats.total,
  live:        accountsStore.stats.live,
  highlighted: accountsStore.stats.highlighted,
  selected:    accountsStore.stats.selected,
}))

// ── Category toggle ───────────────────────────────────
function onCategoryIdsUpdate(ids: number[]) {
  accountsStore.currentCategoryIds = ids
}

// ── Lifecycle ────────────────────────────────────────
onMounted(() => document.addEventListener('mouseup', onMouseup))
onBeforeUnmount(() => document.removeEventListener('mouseup', onMouseup))
</script>

<template>
  <AppPageLayout section="weconnect" current="accounts" page-title="Tài khoản Facebook" page-description="Quản lý toàn bộ tài khoản, chiến dịch và công cụ tự động hóa">
    <div class="wc-accounts-page">

      <!-- MENU STRIP -->
      <WCMenuStrip @open-modal="openModal" />

      <!-- ACTION BAR -->
      <WCActionBar
        v-model:running="isRunning"
        v-model:search-field="accountsStore.searchField"
        v-model:search-query="accountsStore.searchQuery"
        v-model:selected-category-ids="accountsStore.currentCategoryIds"
        :categories="categoriesStore.categories"
        @add-account="openModal('add')"
        @open-category="openModal('category')"
      />

      <!-- DATA GRID -->
      <BaseDataGrid
        :columns="visibleColumns"
        :rows="accountsStore.displayRows"
        :highlighted-rows="accountsStore.highlightedIds"
        :selected-cells="selectedCells"
        :all-chosen="accountsStore.allChosen"
        :row-height="37"
        @toggle-all="accountsStore.toggleAll"
        @toggle-row="accountsStore.toggleRow"
        @row-mousedown="onRowMousedown"
        @row-mouseenter="onRowMouseenter"
        @row-dblclick="onDblclick"
        @cell-click="onCellClick"
        @contextmenu="onContextMenu"
        @keydown="onKeydown"
        @sort="onSort"
      />

      <!-- STATUS BAR -->
      <StatusBar
        :stats="gridStats"
        status-text="Hoạt động"
        user-name="Hoàng Phong"
        expiry-date="31/12/2026"
        version="WeConnect v1.0.0"
      >
        <template #left>
          <span class="sb-seg">Live: {{ accountsStore.stats.live }}</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">Die/CP: {{ accountsStore.stats.die + accountsStore.stats.checkpoint }}</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">Tổng: {{ accountsStore.stats.total }}</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">Bôi đen: {{ accountsStore.stats.highlighted }}</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">Đã chọn: {{ accountsStore.stats.selected }}</span>
        </template>
        <template #right>
          <span class="sb-status-dot" />
          <span class="sb-seg">Hoạt động</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">TK: Hoàng Phong</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">Hạn: 31/12/2026</span>
          <span class="sb-div">|</span>
          <span class="sb-seg">WeConnect v1.0.0</span>
          <span class="sb-div">|</span>
          <button class="sb-more">Xem thêm..</button>
        </template>
      </StatusBar>

    </div>

    <!-- CONTEXT MENU -->
    <ContextMenu
      :show="contextMenuState.show"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :items="contextMenuItems"
      @close="contextMenuState.show = false"
    />

    <!-- MODALS -->
    <WCSetupToolModal :model-value="activeModal === 'settings'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCSetupInteractModal :model-value="activeModal === 'interaction'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCSetupViewModal :model-value="activeModal === 'display'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCTrashModal :model-value="activeModal === 'trash'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCContactModal :model-value="activeModal === 'contact'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCUtilsModal :model-value="activeModal === 'utils'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCCategoryModal :model-value="activeModal === 'category'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCAddAccountModal
      :model-value="activeModal === 'add'"
      :categories="categoriesStore.categories"
      @update:model-value="(v: boolean) => !v && (activeModal = null)"
      @preview="onPreview"
    />
    <WCAddAccountReviewModal
      v-model="showAddReview"
      :rows="previewRows"
      :fields="previewFields"
      @confirm="confirmImport"
    />
    <WCUpdateFieldModal
      v-model="updateFieldState.show"
      :field="updateFieldState.field"
      :label="updateFieldState.label"
      :count="updateFieldState.count"
      @save="onUpdateField"
    />
  </AppPageLayout>
</template>

<style scoped>
/* Override WeConnectLayout content wrapper để DataGrid fill hết height */
:deep(.wc-content) {
  padding: 0 !important;
  gap: 0 !important;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Container chính: flex column, fill remaining height sau PageHeader */
.wc-accounts-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* STATUS BAR segments */
.sb-seg { font-size: var(--wx-fs-11); color: var(--wx-text-secondary); }
.sb-div { font-size: var(--wx-fs-11); color: var(--wx-border-default); margin: 0 4px; }
.sb-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  margin-right: 4px;
}
.sb-more {
  font-size: var(--wx-fs-11);
  color: var(--wx-brand-600);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
</style>
