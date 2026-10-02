<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { BaseDataGrid, ContextMenu } from '../../components/common'
import MindStatBar from '../../components/mindui/MindStatBar.vue'
import type { MindStatItem } from '../../components/mindui/mind-types'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { useAccountsStore } from '../../stores/mindui/accounts'
import { useSettingsStore } from '../../stores/mindui/settings'
import { useCategoriesStore } from '../../stores/mindui/categories'
import type { ContextMenuItem } from '../../types'
import type { AccountRow } from '../../types/account'

import WCMenuStrip from '../../components/mindui/WCMenuStrip.vue'
import WCActionBar from '../../components/mindui/WCActionBar.vue'
import WMSetupToolModal from '../../components/mindui/WMSetupToolModal.vue'
import WMSetupInteractModal from '../../components/mindui/WMSetupInteractModal.vue'
import WMSetupViewModal from '../../components/mindui/WMSetupViewModal.vue'
import WCAddAccountModal from '../../components/mindui/WCAddAccountModal.vue'
import WCAddAccountReviewModal from '../../components/mindui/WCAddAccountReviewModal.vue'
import WCUpdateFieldModal from '../../components/mindui/WCUpdateFieldModal.vue'
import WCTrashModal from '../../components/mindui/WCTrashModal.vue'
import WCContactModal from '../../components/mindui/WCContactModal.vue'
import WCUtilsModal from '../../components/mindui/WCUtilsModal.vue'
import WMCategoryModal from '../../components/mindui/WMCategoryModal.vue'

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

function onPreview(rows: string[][], fields?: string[]) {
  previewRows.value = rows
  // ưu tiên nhãn của các trường người dùng vừa chọn trong hộp thoại thêm; fallback: cột đang hiển thị của bảng
  previewFields.value = fields?.length ? fields : settingsStore.dgvColumns.filter(c => c.visible).map(c => c.label)
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
    password: 'Loại', cookie: 'Tệp đính kèm', token: 'Trạng thái duyệt', email: 'Email liên hệ',
    passEmail: 'Email phụ', twofa: 'Phiên bản', birthday: 'Ngày tạo', ua: 'Nguồn',
    proxy: 'Đơn vị phụ trách', note: 'Ghi chú',
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
        id: 'sel-cp282', label: 'Lý do chờ ▶',
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
      { id: 'cp-uid',     label: 'Mã',                      action: () => copyField('uid') },
      { id: 'cp-pass',    label: 'Loại',                    action: () => copyField('password') },
      { id: 'cp-2fa',     label: 'Phiên bản',               action: () => copyField('twofa') },
      { id: 'cp-all',     label: 'Toàn bộ định dạng vào',   action: () => {} },
      { id: 'cp-email',   label: 'Email liên hệ',           action: () => copyField('email') },
      { id: 'cp-cookie',  label: 'Tệp đính kèm',            action: () => copyField('cookie') },
      { id: 'cp-token',   label: 'Trạng thái duyệt',        action: () => copyField('token') },
      { id: 'cp-2facode', label: 'Lấy mã tham chiếu',       action: () => {} },
      { id: 'cp-sep1',    label: '',                        separator: true },
      { id: 'cp-status',  label: 'Trạng thái',              action: () => copyField('status') },
      { id: 'cp-cpnote',  label: 'Ghi chú lý do chờ',       action: () => {} },
      { id: 'cp-sep2',    label: '',                        separator: true },
      { id: 'cp-custom',  label: 'Tùy chỉnh',               action: () => {} },
    ],
  },
  { id: 'delete', label: 'Xóa bản ghi', danger: true, action: () => accountsStore.deleteSelected() },
  {
    id: 'check', label: 'Kiểm tra bản ghi',
    children: [
      { id: 'chk-valid', label: 'Tính hợp lệ',           action: () => {} },
      { id: 'chk-dup',   label: 'Trùng lặp',             action: () => {} },
      { id: 'chk-info',  label: 'Thông tin bản ghi',     action: () => {} },
      { id: 'chk-ver',   label: 'Phiên bản',             action: () => {} },
      { id: 'chk-email', label: 'Liên kết email',        action: () => {} },
    ],
  },
  { id: 'sep2', label: '', separator: true },
  {
    id: 'update', label: 'Cập nhật dữ liệu',
    children: [
      { id: 'upd-pass',     label: 'Loại',             action: () => openUpdateField('password') },
      { id: 'upd-cookie',   label: 'Tệp đính kèm',     action: () => openUpdateField('cookie') },
      { id: 'upd-token',    label: 'Trạng thái duyệt', action: () => openUpdateField('token') },
      { id: 'upd-email',    label: 'Email liên hệ',    action: () => openUpdateField('email') },
      { id: 'upd-pamail',   label: 'Email phụ',        action: () => openUpdateField('passEmail') },
      { id: 'upd-2fa',      label: 'Phiên bản',        action: () => openUpdateField('twofa') },
      { id: 'upd-birthday', label: 'Ngày tạo',         action: () => openUpdateField('birthday') },
      { id: 'upd-ua',       label: 'Nguồn',            action: () => openUpdateField('ua') },
      { id: 'upd-proxy',    label: 'Đơn vị phụ trách', action: () => openUpdateField('proxy') },
      { id: 'upd-note',     label: 'Ghi chú',          action: () => openUpdateField('note') },
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
    id: 'request', label: 'Đồng bộ',
    children: [
      { id: 'req-sync', label: 'Đồng bộ từ nguồn', action: () => {} },
    ],
  },
  {
    id: 'hotmail', label: 'Hộp thư',
    children: [
      { id: 'hm-browser', label: 'Mở hộp thư',         action: () => {} },
      { id: 'hm-oauth',   label: 'Cấp quyền truy cập', action: () => {} },
    ],
  },
  { id: 'sep4', label: '', separator: true },
  {
    id: 'ads-bm', label: 'Thống kê và báo cáo',
    children: [
      { id: 'ads-analyze', label: 'Phân tích',            action: () => {} },
      { id: 'ads-create',  label: 'Tạo báo cáo tổng hợp', action: () => {} },
    ],
  },
  { id: 'sep5', label: '', separator: true },
  {
    id: 'other', label: 'Chức năng khác',
    children: [
      { id: 'oth-dedup', label: 'Lọc bản ghi trùng', action: () => {} },
      { id: 'oth-clear', label: 'Xóa dữ liệu chạy',   action: () => {} },
      { id: 'oth-log',   label: 'Thư mục log',         action: () => {} },
    ],
  },
  { id: 'reload', label: 'Tải lại danh sách', action: () => accountsStore.loadMockData() },
  { id: 'assign', label: 'Gán người phụ trách',       action: () => {} },
])

// ── Thanh thống kê chân lưới ──────────────────────────
const statItems = computed<MindStatItem[]>(() => [
  { label: 'Hoạt động', value: accountsStore.stats.active,   tone: 'success' },
  { label: 'Chờ duyệt', value: accountsStore.stats.pending,  tone: 'warning' },
  { label: 'Lưu trữ',   value: accountsStore.stats.archived },
  { label: 'Tổng',      value: accountsStore.stats.total, divider: true },
  { label: 'Bôi đen',   value: accountsStore.stats.highlighted, tone: 'brand' },
  { label: 'Đã chọn',   value: accountsStore.stats.selected, tone: 'violet' },
])

/** Chấm trạng thái của lưới: Hoạt động = xanh · Chờ duyệt = vàng · Lưu trữ = xám (làm mờ dòng). */
const STATUS_TONES: Record<string, 'live' | 'cp' | 'idle'> = {
  'Hoạt động': 'live',
  'Chờ duyệt': 'cp',
  'Lưu trữ': 'idle',
}

/** Hàng hiển thị: bổ sung tên thư mục để cột "THƯ MỤC" có dữ liệu. */
const gridRows = computed(() =>
  accountsStore.displayRows.map(r => ({
    ...r,
    category: categoriesStore.categories.find(c => c.id === r.categoryId)?.name ?? '',
  }))
)

// ── Category toggle ───────────────────────────────────
function onCategoryIdsUpdate(ids: number[]) {
  accountsStore.currentCategoryIds = ids
}

// ── Lifecycle ────────────────────────────────────────
onMounted(() => document.addEventListener('mouseup', onMouseup))
onBeforeUnmount(() => document.removeEventListener('mouseup', onMouseup))
</script>

<template>
  <AppPageLayout section="mindui" current="records" page-title="Bản ghi dữ liệu" page-description="Quản lý bản ghi mẫu, nhóm dữ liệu và công cụ xử lý hàng loạt">
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
        :rows="gridRows"
        :status-map="STATUS_TONES"
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
      <MindStatBar :items="statItems">
        <template #right>
          <span class="sb-status"><span class="sb-status-dot" /> Hoạt động</span>
          <span>Người dùng: Quản trị</span>
          <span>Hạn: 31/12/2026</span>
          <span>MindUI v1.0.0</span>
        </template>
      </MindStatBar>

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
    <WMSetupToolModal :model-value="activeModal === 'settings'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WMSetupInteractModal :model-value="activeModal === 'interaction'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WMSetupViewModal :model-value="activeModal === 'display'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCTrashModal :model-value="activeModal === 'trash'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCContactModal :model-value="activeModal === 'contact'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WCUtilsModal :model-value="activeModal === 'utils'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
    <WMCategoryModal :model-value="activeModal === 'category'" @update:model-value="(v: boolean) => !v && (activeModal = null)" />
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
/* Override MindUILayout content wrapper để DataGrid fill hết height */
:deep(.wc-content) {
  padding: 0 !important;
  gap: 0 !important;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Container chính: card bo góc. Chiều cao ôm theo nội dung (ít dòng → không còn khoảng trống dưới bảng),
   tối đa --acc-max-h; vượt quá thì chỉ vùng lưới cuộn (menu / action bar / stat bar giữ nguyên). */
.wc-accounts-page {
  --acc-max-h: clamp(440px, calc(100vh - 240px), 920px);
  --acc-chrome-h: 150px; /* menu strip + action bar + stat bar + viền */
  display: flex;
  flex-direction: column;
  max-height: var(--acc-max-h);
  overflow: hidden;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  background: var(--wx-surface-base);
  box-shadow: var(--wx-shadow-md);
}

.wc-accounts-page :deep(.datagrid-wrapper) { flex: 0 1 auto; }
.wc-accounts-page :deep(.datagrid-scroll) {
  height: auto;
  max-height: calc(var(--acc-max-h) - var(--acc-chrome-h));
}
.wc-accounts-page :deep(.datagrid-empty) { min-height: 140px; }

/* STATUS BAR — cụm bên phải */
.sb-status { display: inline-flex; align-items: center; gap: var(--wx-space-1); white-space: nowrap; color: var(--wx-success-text); font-weight: var(--wx-fw-semibold); }
.sb-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--wx-success-solid);
  box-shadow: 0 0 0 3px var(--wx-success-bg);
}
</style>
