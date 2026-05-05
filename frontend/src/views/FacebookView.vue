<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useAccountsStore } from '../stores/accounts'
import { useSettingsStore } from '../stores/settings'
import { useCategoriesStore } from '../stores/categories'
import { useToast } from '../composables'
import type { ColumnConfig } from '../types/ui'
import type { AccountRow } from '../types/account'
import {
  FacebookMenuStrip,
  FacebookActionBar,
  SetupToolModal,
  SetupInteractModal,
  SetupViewModal,
  CopyModal,
  UtilsModal,
  TrashModal,
  ContactModal,
  CategoryModal,
  AddAccountModal,
  AddAccountReviewModal,
} from '../components/facebook'

const app = useAppStore()
const accountsStore = useAccountsStore()
const settingsStore = useSettingsStore()
const categoriesStore = useCategoriesStore()
const { showToast } = useToast()

/* ─── Init ─── */
onMounted(() => {
  accountsStore.loadMockData()
  categoriesStore.loadMockData()
})

/* ─── Popup state ─── */
type PopupKey = '' | 'settings' | 'interaction' | 'display' | 'utils' | 'trash' | 'contact' | 'category' | 'add' | 'addReview'
const activePopup = ref<PopupKey>('')
function openPopup(key: string) { hideDgvCtx(); activePopup.value = key as PopupKey }
function closePopup() { activePopup.value = '' }

/* ─── ActionBar handlers ─── */
const isRunning = ref(false)

function onRun() {
  isRunning.value = true
  showToast('info', 'Đang chạy tác vụ...')
}
function onStop() {
  isRunning.value = false
  showToast('info', 'Đã dừng tác vụ')
}

function onSearch(field: string, query: string) {
  accountsStore.searchField = field
  accountsStore.searchQuery = query
}

function onCategoryChange(ids: number[]) {
  accountsStore.currentCategoryIds = ids
}

/* ─── Add Account flow (2-step: input → review) ─── */
interface ParsedRow { [key: string]: string }
const addReviewAccounts = ref<ParsedRow[]>([])
const addReviewFieldKeys = ref<string[]>([])
const addReviewCategoryId = ref<number | null>(null)

function onAddPreview(accounts: ParsedRow[], fieldKeys: string[], categoryId: number | null) {
  addReviewAccounts.value = accounts
  addReviewFieldKeys.value = fieldKeys
  addReviewCategoryId.value = categoryId
  activePopup.value = 'addReview'
}

function onAddDone() {
  closePopup()
}

/* ─── Column visibility (from settings store) ─── */
const visibleColumns = computed(() => settingsStore.dgvColumns.filter(c => c.visible))

function onSaveDisplay(newCols: ColumnConfig[]) {
  settingsStore.updateDgvColumns(newCols)
  closePopup()
}

/* ─── Display helpers ─── */
const MONO_KEYS = new Set(['password', 'twofa', 'ua', 'uaAndroid', 'uaIos', 'cookie', 'token', 'clientId', 'refreshToken', 'oauth2'])

function cellValue(acc: AccountRow, key: string): string {
  if (key === 'categoryId') {
    if (acc.categoryId === null) return '—'
    const cat = categoriesStore.categories.find(c => c.id === acc.categoryId)
    return cat ? cat.name : '—'
  }
  const val = (acc as unknown as Record<string, unknown>)[key]
  if (val === undefined || val === null || val === '') return '—'
  if (typeof val === 'number') return val.toLocaleString()
  return String(val)
}

function cellClass(acc: AccountRow, col: ColumnConfig, idx: number): Record<string, boolean> {
  const key = col.key
  const val = (acc as unknown as Record<string, unknown>)[key]
  return {
    'cell-selected': isCellSelected(idx, key),
    'val-ok': (key === 'cookie' || key === 'token') ? val === '✓' : key === 'twofa' ? !!val && val !== '—' : false,
    'val-no': (key === 'cookie' || key === 'token') ? val === '✗' : key === 'twofa' ? !val || val === '' : false,
    'col-mono': MONO_KEYS.has(key),
  }
}

function colStyle(col: ColumnConfig): Record<string, string> {
  const s: Record<string, string> = {}
  if (col.width) s.width = col.width
  if (col.align) s.textAlign = col.align
  return s
}

/* ─── Accounts data (from store) ─── */
const rawAccounts = computed(() => accountsStore.filteredAccounts)
const selectedAccounts = computed(() => accountsStore.selectedAccounts)

/* ─── Column sort ─── */
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

function onSortHeader(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const accounts = computed(() => {
  const list = rawAccounts.value
  if (!sortKey.value) return list
  const k = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    const va = (a as unknown as Record<string, unknown>)[k]
    const vb = (b as unknown as Record<string, unknown>)[k]
    if (va == null && vb == null) return 0
    if (va == null) return dir
    if (vb == null) return -dir
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return String(va).localeCompare(String(vb)) * dir
  })
})

/* ─── Column resize ─── */
const columnWidths = ref<Record<string, number>>({})
let resizeCol = ''
let resizeStartX = 0
let resizeStartW = 0

function onResizeStart(colKey: string, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  resizeCol = colKey
  resizeStartX = e.clientX
  const th = (e.target as HTMLElement).parentElement
  resizeStartW = th ? th.offsetWidth : 100
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!resizeCol) return
  const delta = e.clientX - resizeStartX
  const newW = Math.max(40, resizeStartW + delta)
  columnWidths.value[resizeCol] = newW
}

function onResizeEnd() {
  resizeCol = ''
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
}

function colStyleWithResize(col: ColumnConfig): Record<string, string> {
  const s: Record<string, string> = {}
  const rw = columnWidths.value[col.key]
  if (rw) {
    s.width = rw + 'px'
    s.minWidth = rw + 'px'
    s.maxWidth = rw + 'px'
  } else if (col.width) {
    s.width = col.width
  }
  if (col.align) s.textAlign = col.align
  return s
}

/* ─── Virtual scroll ─── */
const ROW_HEIGHT = 37
const BUFFER_ROWS = 10
const scrollRef = ref<HTMLElement | null>(null)
const dgvWrapperRef = ref<HTMLElement | null>(null)
function focusDgv() { dgvWrapperRef.value?.focus() }
const scrollTop = ref(0)

function onDgvScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

const visibleRange = computed(() => {
  const total = accounts.value.length
  if (total <= 200) return { start: 0, end: total } // skip virtual for small datasets
  const viewH = scrollRef.value ? scrollRef.value.clientHeight - 40 : 600 // minus header height
  const start = Math.max(0, Math.floor(scrollTop.value / ROW_HEIGHT) - BUFFER_ROWS)
  const visibleCount = Math.ceil(viewH / ROW_HEIGHT) + BUFFER_ROWS * 2
  const end = Math.min(total, start + visibleCount)
  return { start, end }
})

const visibleAccounts = computed(() => {
  const { start, end } = visibleRange.value
  return accounts.value.slice(start, end).map((acc, i) => ({ acc, idx: start + i }))
})

const topSpacerHeight = computed(() => visibleRange.value.start * ROW_HEIGHT)
const bottomSpacerHeight = computed(() => (accounts.value.length - visibleRange.value.end) * ROW_HEIGHT)

/* ─── Row highlight ─── */
const highlightedRows = computed(() => accountsStore.highlightedIds)
let lastClickedIdx = -1
let isDragging = false
let cellClickHandled = false  // flag: cell mousedown đã xử lý → skip row highlight

/* ─── Cell selection (DGV-style drag) ─── */
interface CellRef { row: number; col: string }
const selectedCells = ref<CellRef[]>([])
const isCellDragging = ref(false)
let anchorCellRow = -1
let anchorCellCol = ''
let lastCellRow = -1
let lastCellCol = ''

/** All selectable column keys: uid (always visible) + visible configurable columns */
const selectableColumns = computed(() => ['uid', ...visibleColumns.value.map(c => c.key)])

/** Build rectangular selection from anchor to target */
function buildRectSelection(r1: number, c1: string, r2: number, c2: string): CellRef[] {
  const cols = selectableColumns.value
  const rMin = Math.min(r1, r2), rMax = Math.max(r1, r2)
  const ci1 = cols.indexOf(c1), ci2 = cols.indexOf(c2)
  const cMin = Math.min(ci1, ci2), cMax = Math.max(ci1, ci2)
  const cells: CellRef[] = []
  for (let r = rMin; r <= rMax; r++) {
    for (let c = cMin; c <= cMax; c++) cells.push({ row: r, col: cols[c] })
  }
  return cells
}

/** Cell mousedown — start drag or single/ctrl/shift select */
function onCellMouseDown(row: number, col: string, e: MouseEvent) {
  e.stopPropagation()  // ngăn event bubble lên tr → onRowMouseDown
  e.preventDefault()   // ngăn browser text-select khi drag
  cellClickHandled = true
  const cols = selectableColumns.value
  if (e.ctrlKey || e.metaKey) {
    // Ctrl+click: toggle cell
    const idx = selectedCells.value.findIndex(c => c.row === row && c.col === col)
    if (idx >= 0) selectedCells.value.splice(idx, 1)
    else selectedCells.value.push({ row, col })
  } else if (e.shiftKey && anchorCellRow >= 0) {
    // Shift+click: vùng hình chữ nhật từ anchor → current
    selectedCells.value = buildRectSelection(anchorCellRow, anchorCellCol, row, col)
  } else {
    // Click thường → bắt đầu drag
    selectedCells.value = [{ row, col }]
    anchorCellRow = row
    anchorCellCol = col
    isCellDragging.value = true
  }
  lastCellRow = row
  lastCellCol = col
  accountsStore.setHighlighted(new Set([row]))
  lastClickedIdx = row
  focusDgv()
}

/** Cell mouseenter during drag → expand rectangular selection */
function onCellMouseEnter(row: number, col: string) {
  if (!isCellDragging.value) return
  selectedCells.value = buildRectSelection(anchorCellRow, anchorCellCol, row, col)
  // Highlight all rows in range
  const rMin = Math.min(anchorCellRow, row), rMax = Math.max(anchorCellRow, row)
  const set = new Set<number>()
  for (let r = rMin; r <= rMax; r++) set.add(r)
  accountsStore.setHighlighted(set)
  lastCellRow = row
  lastCellCol = col
}

function isCellSelected(row: number, col: string) {
  return selectedCells.value.some(c => c.row === row && c.col === col)
}

function copyToClipboard(text: string): boolean {
  try {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text); return true }
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    return true
  } catch { return false }
}

function copySelectedCells() {
  const cols = selectableColumns.value

  // 1. Có cell selected → copy cells
  if (selectedCells.value.length) {
    const byRow = new Map<number, string[]>()
    for (const c of selectedCells.value) {
      if (!byRow.has(c.row)) byRow.set(c.row, [])
      byRow.get(c.row)!.push(c.col)
    }
    const rows = [...byRow.entries()].sort((a, b) => a[0] - b[0])
    const lines = rows.map(([rowIdx, rowCols]) => {
      const sorted = rowCols.sort((a, b) => cols.indexOf(a) - cols.indexOf(b))
      return sorted.map(col => String((accounts.value[rowIdx] as Record<string, unknown>)[col] ?? '')).join('|')
    })
    copyToClipboard(lines.join('\n'))
    showToast('info', `Đã sao chép ${selectedCells.value.length} ô`)
    return
  }

  // 2. Có hàng highlighted → copy tất cả visible columns của hàng đó
  if (highlightedRows.value.size) {
    const rowIndices = [...highlightedRows.value].sort((a, b) => a - b)
    const lines = rowIndices.map(idx => {
      const acc = accounts.value[idx]
      if (!acc) return ''
      return cols.map(col => {
        if (col === 'categoryId') {
          const cat = categoriesStore.categories.find(c => c.id === acc.categoryId)
          return cat ? cat.name : ''
        }
        return String((acc as Record<string, unknown>)[col] ?? '')
      }).join('|')
    }).filter(Boolean)
    copyToClipboard(lines.join('\n'))
    showToast('info', `Đã sao chép ${rowIndices.length} hàng`)
    return
  }

  // 3. Có tài khoản checked → copy checked
  const checked = accounts.value.filter(a => a.chose)
  if (checked.length) {
    const lines = checked.map(acc =>
      cols.map(col => {
        if (col === 'categoryId') {
          const cat = categoriesStore.categories.find(c => c.id === acc.categoryId)
          return cat ? cat.name : ''
        }
        return String((acc as Record<string, unknown>)[col] ?? '')
      }).join('|')
    )
    copyToClipboard(lines.join('\n'))
    showToast('info', `Đã sao chép ${checked.length} tài khoản`)
    return
  }

  showToast('warning', 'Không có dữ liệu để sao chép')
}

function onTableKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === 'c') { e.preventDefault(); copySelectedCells() }
  if (e.key === ' ') {
    e.preventDefault()
    highlightedRows.value.forEach(i => {
      if (i < accounts.value.length) accounts.value[i].chose = !accounts.value[i].chose
    })
  }
}

function onRowMouseDown(idx: number, e: MouseEvent) {
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  // Nếu cell mousedown đã xử lý → skip (tránh override cell selection)
  if (cellClickHandled) { cellClickHandled = false; return }
  isDragging = true
  // Khi click vào row (non-cell area) → clear cell selection
  selectedCells.value = []
  if (e.shiftKey && lastClickedIdx >= 0) {
    const s = Math.min(lastClickedIdx, idx), end = Math.max(lastClickedIdx, idx)
    const set = new Set<number>(); for (let i = s; i <= end; i++) set.add(i)
    accountsStore.setHighlighted(set)
  } else if (e.ctrlKey) {
    const set = new Set(highlightedRows.value); if (set.has(idx)) set.delete(idx); else set.add(idx)
    accountsStore.setHighlighted(set)
  } else { accountsStore.setHighlighted(new Set([idx])) }
  lastClickedIdx = idx
  focusDgv()
}
function onRowMouseEnter(idx: number) {
  if (!isDragging || lastClickedIdx < 0) return
  const s = Math.min(lastClickedIdx, idx), end = Math.max(lastClickedIdx, idx)
  const set = new Set<number>(); for (let i = s; i <= end; i++) set.add(i)
  accountsStore.setHighlighted(set)
}
function onMouseUp() { isDragging = false; isCellDragging.value = false }
function onRowDblClick(idx: number) { accounts.value[idx].chose = !accounts.value[idx].chose }

/* ─── StatusBar computed (from store) ─── */
const stats = computed(() => accountsStore.stats)
const allChosen = computed(() => accounts.value.length > 0 && accounts.value.every(a => a.chose))
function toggleAllChosen(e: Event) {
  const v = (e.target as HTMLInputElement).checked
  if (v) accountsStore.selectAll()
  else accountsStore.unselectAll()
}

/* ─── DGV Context menu ─── */
const dgvCtx = ref({ show: false, x: 0, y: 0 })
const openSubId = ref('')
function showDgvCtx(e: MouseEvent) {
  e.preventDefault(); openSubId.value = ''
  const mW = 220, mH = 600; let x = e.clientX, y = e.clientY
  if (x + mW > window.innerWidth) x = window.innerWidth - mW - 8
  if (y + mH > window.innerHeight) y = Math.max(8, window.innerHeight - mH - 8)
  dgvCtx.value = { show: true, x, y }
}
function hideDgvCtx() { dgvCtx.value.show = false; openSubId.value = '' }
function toggleSub(id: string) { openSubId.value = openSubId.value === id ? '' : id }

/* ─── Close context menu on any click outside ─── */
const ctxMenuRef = ref<HTMLElement | null>(null)
function onDocumentMouseDown(e: MouseEvent) {
  if (!dgvCtx.value.show) return
  const target = e.target as HTMLElement
  // Nếu click bên trong context menu → không đóng
  if (ctxMenuRef.value && ctxMenuRef.value.contains(target)) return
  hideDgvCtx()
}
onMounted(() => document.addEventListener('mousedown', onDocumentMouseDown, true))
onUnmounted(() => document.removeEventListener('mousedown', onDocumentMouseDown, true))
const subOpenLeft = computed(() => dgvCtx.value.x + 440 > window.innerWidth)
const uniqueStatuses = computed(() => accountsStore.uniqueStatuses)
const uniqueNotes = computed(() => accountsStore.uniqueNotes)
const uniqueActions = computed(() => accountsStore.uniqueActions)
const uniqueCheckpoints = computed(() => accountsStore.uniqueCheckpoints)

/* ─── Context menu actions (wired to store) ─── */
function ctxSelectAll() { accountsStore.selectAll(); hideDgvCtx() }
function ctxSelectHighlighted() { accountsStore.selectHighlighted(); hideDgvCtx() }
function ctxSelectByStatus(s: string) { accountsStore.selectByStatus(s as AccountRow['status']); hideDgvCtx() }
function ctxSelectByNote(n: string) { accountsStore.selectByNote(n); hideDgvCtx() }
function ctxUnselectAll() { accountsStore.unselectAll(); hideDgvCtx() }

function ctxCopyField(field: string) {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  copyToClipboard(sel.map(a => String((a as Record<string, unknown>)[field] ?? '')).join('\n'))
  showToast('success', `Đã sao chép ${sel.length} dòng!`); hideDgvCtx()
}
function ctxCopyFullImport() {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  copyToClipboard(sel.map(a => `${a.uid}|${a.password}|${a.twofa}|${a.email}`).join('\n'))
  showToast('success', `Đã sao chép ${sel.length} dòng!`); hideDgvCtx()
}
function ctxCopyEmailPass() {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  copyToClipboard(sel.map(a => a.email).join('\n'))
  showToast('success', `Đã sao chép ${sel.length} dòng!`); hideDgvCtx()
}
function ctxGetCode2FA() {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  if (!sel[0].twofa) { showToast('error', 'Tài khoản không có mã 2FA!'); hideDgvCtx(); return }
  const counter = Math.floor(Date.now() / 1000 / 30)
  const code = (counter % 1000000).toString().padStart(6, '0')
  copyToClipboard(code); showToast('success', `Lấy mã 2FA thành công: ${code}!`); hideDgvCtx()
}

const showCopyPopup = ref(false)
function ctxOpenCopyPopup() {
  if (!selectedAccounts.value.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  showCopyPopup.value = true; hideDgvCtx()
}
function ctxDeleteAccounts() {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  accountsStore.deleteSelected()
  showToast('success', `Đã xóa ${sel.length} tài khoản vào thùng rác!`)
  hideDgvCtx()
}
function ctxReloadList() {
  accountsStore.loadMockData()
  showToast('success', 'Tải lại danh sách thành công!')
  hideDgvCtx()
}

/* ─── "Chuyển dữ liệu" → move selected accounts to category ─── */
function ctxMoveToCategory(catId: number, catName: string) {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  accountsStore.moveToCategory(sel.map(a => a.id), catId)
  showToast('success', `Đã chuyển ${sel.length} tài khoản sang "${catName}"`)
  hideDgvCtx()
}

/* ─── "Cập nhật dữ liệu" mini-modal ─── */
const updateModal = ref({ show: false, field: '', label: '', value: '' })

const UPDATE_FIELDS: Array<{ field: string; label: string }> = [
  { field: 'password', label: 'Mật khẩu' },
  { field: 'cookie', label: 'Cookie' },
  { field: 'token', label: 'Token' },
  { field: 'email', label: 'Email' },
  { field: 'passEmail', label: 'Pass Email' },
  { field: 'twofa', label: '2FA' },
  { field: 'birthday', label: 'Sinh nhật' },
  { field: 'ua', label: 'Useragent' },
  { field: 'proxy', label: 'Proxy' },
  { field: 'note', label: 'Ghi chú' },
]

function ctxOpenUpdateField(field: string, label: string) {
  const sel = selectedAccounts.value
  if (!sel.length) { showToast('warning', 'Vui lòng chọn tài khoản!'); hideDgvCtx(); return }
  updateModal.value = { show: true, field, label, value: '' }
  hideDgvCtx()
}

function updateFieldSave() {
  const sel = selectedAccounts.value
  if (!sel.length) { updateModal.value.show = false; return }
  accountsStore.updateField(sel.map(a => a.id), updateModal.value.field, updateModal.value.value)
  showToast('success', `Đã cập nhật "${updateModal.value.label}" cho ${sel.length} tài khoản`)
  updateModal.value.show = false
}

function updateFieldCancel() {
  updateModal.value.show = false
}
</script>

<template>
  <div class="fb-page">
    <FacebookMenuStrip @open-popup="openPopup" />
    <FacebookActionBar
      :is-running="isRunning"
      :categories="categoriesStore.sortedCategories"
      :current-category-ids="accountsStore.currentCategoryIds"
      :filtered-count="accounts.length"
      @run="onRun"
      @stop="onStop"
      @add="openPopup('add')"
      @search="onSearch"
      @category-change="onCategoryChange"
      @open-category-modal="openPopup('category')"
    />

    <!-- DataGrid (dynamic 63-column rendering) -->
    <div ref="dgvWrapperRef" class="datagrid-wrapper" :class="{ 'cell-dragging': isCellDragging }" @contextmenu="showDgvCtx" @mouseup="onMouseUp" tabindex="0" @keydown="onTableKeyDown">
      <div ref="scrollRef" class="datagrid-scroll" @scroll="onDgvScroll">
        <table class="datagrid">
          <thead><tr>
            <th class="col-chk"><input type="checkbox" :checked="allChosen" @change="toggleAllChosen" /></th>
            <th class="col-stt">STT</th>
            <th class="col-uid col-sortable" @click="onSortHeader('uid')">UID<span v-if="sortKey === 'uid'" class="sort-indicator">{{ sortDir === 'asc' ? '\u25B2' : '\u25BC' }}</span><span class="col-resize-handle" @mousedown="onResizeStart('uid', $event)"></span></th>
            <th v-for="col in visibleColumns" :key="col.key" :style="colStyleWithResize(col)" class="col-sortable" @click="onSortHeader(col.key)">{{ col.label }}<span v-if="sortKey === col.key" class="sort-indicator">{{ sortDir === 'asc' ? '\u25B2' : '\u25BC' }}</span><span class="col-resize-handle" @mousedown="onResizeStart(col.key, $event)"></span></th>
          </tr></thead>
          <tbody>
            <tr v-if="topSpacerHeight > 0" :style="{ height: topSpacerHeight + 'px' }"></tr>
            <tr v-for="{ acc, idx } in visibleAccounts" :key="acc.id"
                :class="{ 'row-die': acc.status === 'Die', 'row-highlight': highlightedRows.has(idx) }"
                @mousedown="onRowMouseDown(idx, $event)" @mouseenter="onRowMouseEnter(idx)" @dblclick="onRowDblClick(idx)">
              <td class="col-chk"><input type="checkbox" v-model="acc.chose" /></td>
              <td class="col-stt">{{ idx + 1 }}</td>
              <td class="col-uid" :class="{ 'cell-selected': isCellSelected(idx, 'uid') }"
                  @mousedown="onCellMouseDown(idx, 'uid', $event)"
                  @mouseenter="onCellMouseEnter(idx, 'uid')">{{ acc.uid }}</td>
              <td v-for="col in visibleColumns" :key="col.key"
                  :style="colStyleWithResize(col)"
                  :class="cellClass(acc, col, idx)"
                  @mousedown="onCellMouseDown(idx, col.key, $event)"
                  @mouseenter="onCellMouseEnter(idx, col.key)">
                <template v-if="col.key === 'status'">
                  <span class="status-dot" :class="{ 'dot-live': acc.status === 'Live', 'dot-die': acc.status === 'Die', 'dot-cp': acc.status === 'Checkpoint' }"></span>{{ acc.status || '—' }}
                </template>
                <template v-else>{{ cellValue(acc, col.key) }}</template>
              </td>
            </tr>
            <tr v-if="bottomSpacerHeight > 0" :style="{ height: bottomSpacerHeight + 'px' }"></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- StatusBar -->
    <footer class="app-statusbar no-select">
      <div class="statusbar-group">
        <span class="statusbar-item">Live: <strong class="sb-val sb-live">{{ stats.live }}</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">Die/ CP/ None: <strong class="sb-val sb-die">{{ stats.die + stats.checkpoint }}</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">Tổng: <strong class="sb-val sb-total">{{ stats.total }}</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">Bôi đen: <strong class="sb-val sb-highlight">{{ stats.highlighted }}</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">Đã chọn: <strong class="sb-val sb-selected">{{ stats.selected }}</strong></span>
      </div>
      <div class="statusbar-group">
        <span class="statusbar-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
          <strong class="sb-val sb-status">Hoạt động</strong>
        </span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">TK: <strong class="sb-val sb-user">{{ app.user.name }}</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item">Hạn: <strong class="sb-val sb-expiry">31/12/2026</strong></span>
        <span class="sb-sep"></span>
        <span class="statusbar-item sb-version">WeConnect v{{ app.appVersion }}</span>
        <span class="sb-sep"></span>
        <a class="statusbar-link" href="#" @click.prevent="showToast('info', 'Thông tin tài khoản premium')">Xem thêm..</a>
      </div>
    </footer>

    <!-- DGV Context Menu -->
    <teleport to="body">
      <div v-if="dgvCtx.show" ref="ctxMenuRef" class="dgv-ctx" :style="{ left: dgvCtx.x + 'px', top: dgvCtx.y + 'px' }" :class="{ 'dgv-ctx--left': subOpenLeft }" @contextmenu.prevent>
        <!-- 1. Chọn (Select) -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('chon')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M2 2h12v12H2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 8l3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Chọn
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'chon' }">
            <button class="dgv-ctx-item" @click="ctxSelectAll">Tất cả</button>
            <button class="dgv-ctx-item" @click="ctxSelectHighlighted">Bôi đen</button>
            <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('chon-status')">Trạng thái
              <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'chon-status' }">
                <button v-for="s in uniqueStatuses" :key="s" class="dgv-ctx-item" @click="ctxSelectByStatus(s)">{{ s }}</button>
                <span v-if="!uniqueStatuses.length" class="dgv-ctx-item dgv-ctx-disabled">Không có dữ liệu</span>
              </div>
            </div>
            <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('chon-action')">Hoạt động
              <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'chon-action' }">
                <button v-for="a in uniqueActions" :key="a" class="dgv-ctx-item" @click="ctxSelectByStatus(a)">{{ a }}</button>
                <span v-if="!uniqueActions.length" class="dgv-ctx-item dgv-ctx-disabled">Không có dữ liệu</span>
              </div>
            </div>
            <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('chon-note')">Ghi chú
              <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'chon-note' }">
                <button v-for="n in uniqueNotes" :key="n" class="dgv-ctx-item" @click="ctxSelectByNote(n)">{{ n }}</button>
                <span v-if="!uniqueNotes.length" class="dgv-ctx-item dgv-ctx-disabled">Không có dữ liệu</span>
              </div>
            </div>
            <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('chon-cp')">Trạng thái 282
              <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'chon-cp' }">
                <button v-for="c in uniqueCheckpoints" :key="c" class="dgv-ctx-item" @click="ctxSelectByStatus(c)">{{ c }}</button>
                <span v-if="!uniqueCheckpoints.length" class="dgv-ctx-item dgv-ctx-disabled">Không có dữ liệu</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 2. Bỏ chọn -->
        <button class="dgv-ctx-item" @click="ctxUnselectAll">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M2 2h12v12H2z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Bỏ chọn tất cả</button>
        <div class="dgv-ctx-sep"></div>
        <!-- 3. Sao chép (Copy) -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('copy')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><rect x="5" y="5" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Sao chép
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'copy' }">
            <button class="dgv-ctx-item" @click="ctxCopyField('uid')">UID</button>
            <button class="dgv-ctx-item" @click="ctxCopyField('password')">Mật khẩu</button>
            <button class="dgv-ctx-item" @click="ctxCopyField('twofa')">2FA</button>
            <button class="dgv-ctx-item" @click="ctxCopyFullImport">Toàn bộ định dạng vào</button>
            <button class="dgv-ctx-item" @click="ctxCopyEmailPass">Email | Mật khẩu email</button>
            <button class="dgv-ctx-item" @click="ctxCopyField('cookie')">Cookie</button>
            <button class="dgv-ctx-item" @click="ctxCopyField('token')">Token</button>
            <button class="dgv-ctx-item" @click="ctxGetCode2FA">Lấy code 2FA</button>
            <div class="dgv-ctx-sep"></div>
            <button class="dgv-ctx-item" @click="ctxCopyField('status')">Trạng thái</button>
            <button class="dgv-ctx-item" @click="ctxCopyField('note')">Tình trạng checkpoint</button>
            <div class="dgv-ctx-sep"></div>
            <button class="dgv-ctx-item" @click="ctxOpenCopyPopup">Tùy chỉnh</button>
          </div>
        </div>
        <!-- 4. Xóa -->
        <button class="dgv-ctx-item dgv-ctx-item--danger" @click="ctxDeleteAccounts">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M3 4h10M6 4V3h4v1M5 4v9h6V4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Xóa tài khoản</button>
        <!-- 5. Kiểm tra -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('check')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5"/></svg>Kiểm tra tài khoản
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'check' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Facebook</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Instagram</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Thông tin TK (Cookie trung gian)</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Kiểm tra pass facebook</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Kiểm tra liên kết mail</button>
          </div>
        </div>
        <div class="dgv-ctx-sep"></div>
        <!-- 6. Cập nhật dữ liệu -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('update')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M11 2l3 3-8 8H3v-3z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Cập nhật dữ liệu
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'update' }">
            <button v-for="uf in UPDATE_FIELDS" :key="uf.field" class="dgv-ctx-item" @click="ctxOpenUpdateField(uf.field, uf.label)">{{ uf.label }}</button>
          </div>
        </div>
        <!-- 7. Chuyển dữ liệu -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('transfer')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M3 8h10M10 5l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Chuyển dữ liệu
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'transfer' }">
            <button v-for="cat in categoriesStore.sortedCategories" :key="cat.id" class="dgv-ctx-item" @click="ctxMoveToCategory(cat.id, cat.name)">{{ cat.name }}</button>
            <span v-if="!categoriesStore.sortedCategories.length" class="dgv-ctx-item dgv-ctx-disabled">Không có thư mục</span>
          </div>
        </div>
        <div class="dgv-ctx-sep"></div>
        <!-- 8. Trình duyệt -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('browser')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12" fill="none" stroke="currentColor" stroke-width="1"/></svg>Trình duyệt
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'browser' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Mở trình duyệt</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Đóng tất cả trình duyệt</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Xóa trình duyệt</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Cài đặt</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Tối ưu thư mục</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Dọn dẹp thư mục</button>
          </div>
        </div>
        <!-- 9. Request -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('request')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M8 2v4M5 4l3 2 3-2M2 9h12M4 12h8" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Request
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'request' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Login && Get Cookie | Token</button>
          </div>
        </div>
        <!-- 10. Hotmail -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('hotmail')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 4l6 4 6-4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Hotmail
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'hotmail' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Mở trình duyệt</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Get OAuth2</button>
          </div>
        </div>
        <div class="dgv-ctx-sep"></div>
        <!-- 11. ADS & BM -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('ads')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M2 13V7l4-4 3 3 5-4v11z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Hiển thị ADS && BM
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'ads' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Phân tích</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Tạo TK quảng cáo 2025</button>
          </div>
        </div>
        <div class="dgv-ctx-sep"></div>
        <!-- 12. Chức năng khác -->
        <div class="dgv-ctx-item dgv-ctx-parent" @click.stop="toggleSub('other')">
          <svg class="ctx-icon" viewBox="0 0 16 16"><circle cx="4" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12" cy="8" r="1.2" fill="currentColor"/></svg>Chức năng khác
          <div class="dgv-ctx-sub" :class="{ 'dgv-ctx-sub--open': openSubId === 'other' }">
            <button class="dgv-ctx-item" @click="hideDgvCtx">Lọc tài khoản trùng</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Xóa dữ liệu chạy</button>
            <button class="dgv-ctx-item" @click="hideDgvCtx">Thư mục log</button>
          </div>
        </div>
        <!-- 13. Tải lại -->
        <button class="dgv-ctx-item" @click="ctxReloadList">
          <svg class="ctx-icon" viewBox="0 0 16 16"><path d="M3 8a5 5 0 019-2M13 8a5 5 0 01-9 2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v3h-3M4 13v-3h3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>Tải lại danh sách</button>
        <!-- 14. Gán thiết bị -->
        <button class="dgv-ctx-item" @click="hideDgvCtx">
          <svg class="ctx-icon" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="12" r="0.8" fill="currentColor"/></svg>Gán thiết bị</button>
      </div>
    </teleport>

    <!-- Modals -->
    <SetupToolModal :show="activePopup === 'settings'" @close="closePopup" @save="closePopup" />
    <SetupInteractModal :show="activePopup === 'interaction'" @close="closePopup" />
    <SetupViewModal :show="activePopup === 'display'" :columns="settingsStore.dgvColumns" @close="closePopup" @save="onSaveDisplay" />
    <UtilsModal :show="activePopup === 'utils'" @close="closePopup" />
    <TrashModal :show="activePopup === 'trash'" @close="closePopup" />
    <ContactModal :show="activePopup === 'contact'" @close="closePopup" />
    <CategoryModal :show="activePopup === 'category'" @close="closePopup" />
    <AddAccountModal :show="activePopup === 'add'" @close="closePopup" @preview="onAddPreview" />
    <AddAccountReviewModal :show="activePopup === 'addReview'" :accounts="addReviewAccounts" :field-keys="addReviewFieldKeys" :category-id="addReviewCategoryId" @close="closePopup" @done="onAddDone" />
    <CopyModal :show="showCopyPopup" @close="showCopyPopup = false" />

    <!-- Update Field mini-modal -->
    <teleport to="body">
      <div v-if="updateModal.show" class="update-overlay" @mousedown.self="updateFieldCancel">
        <div class="update-dialog">
          <div class="update-header">Cập nhật {{ updateModal.label }}</div>
          <div class="update-body">
            <label class="update-label">Giá trị mới cho {{ selectedAccounts.length }} tài khoản đã chọn:</label>
            <input v-model="updateModal.value" class="update-input" :placeholder="updateModal.label" @keydown.enter="updateFieldSave" />
          </div>
          <div class="update-footer">
            <button class="update-btn update-btn--save" @click="updateFieldSave">Lưu</button>
            <button class="update-btn update-btn--cancel" @click="updateFieldCancel">Hủy</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
/* ─── Page Layout ─── */
.fb-page { display: flex; flex-direction: column; height: calc(100% + var(--wx-density-container-pad) * 2); margin: calc(var(--wx-density-container-pad) * -1); position: relative; overflow: hidden; }

/* ─── DataGrid ─── */
.datagrid-wrapper { flex: 1; min-height: 0; overflow: hidden; background: var(--wx-surface-base); }
.datagrid-wrapper:focus { outline: none; }
.datagrid-scroll { height: 100%; overflow: auto; }
.datagrid-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.datagrid-scroll::-webkit-scrollbar-track { background: var(--wx-scrollbar-track); }
.datagrid-scroll::-webkit-scrollbar-thumb { background: var(--wx-scrollbar-thumb); border-radius: 4px; }
.datagrid-scroll::-webkit-scrollbar-thumb:hover { background: var(--wx-scrollbar-thumb-hover); }
.datagrid { width: 100%; border-collapse: collapse; font-size: var(--wx-density-font-size, 13px); background: var(--wx-surface-base); table-layout: auto; }
.datagrid thead { position: sticky; top: 0; z-index: 5; }
.datagrid th {
  padding: 0 var(--wx-density-cell-px, 12px); height: 36px; text-align: left; font-size: 12px; font-weight: 700;
  color: var(--wx-text-primary); letter-spacing: 0.3px; text-transform: uppercase;
  background: var(--wx-surface-elevated);
  border-bottom: 2px solid var(--wx-border-default); border-right: 1px solid var(--wx-border-subtle);
  white-space: nowrap; position: relative;
  font-family: var(--wx-font-primary);
}
.datagrid th:last-child { border-right: none; }
.datagrid td {
  padding: 0 var(--wx-density-cell-px, 12px); height: var(--wx-density-row-height, 32px); color: var(--wx-text-primary); border-bottom: 1px solid var(--wx-border-subtle);
  white-space: nowrap; transition: background 0.08s;
}
.datagrid tbody tr { cursor: pointer; user-select: none; }
.datagrid tbody tr:nth-child(even) td { background: var(--wx-surface-sunken); }
.datagrid tbody tr:hover td { background: var(--wx-hover-bg); }
.datagrid tbody tr:nth-child(even):hover td { background: var(--wx-hover-bg); }
.datagrid input[type="checkbox"] { accent-color: var(--wx-brand-primary); cursor: pointer; width: 14px; height: 14px; }

/* ─── Columns ─── */
.col-chk { width: 36px; text-align: center; }
.col-stt { width: 42px; text-align: center; color: var(--wx-text-muted); font-size: 12px; }
.col-uid { width: 130px; font-family: var(--wx-font-mono); font-size: 12px; color: var(--wx-brand-primary); }
.col-mono { font-family: var(--wx-font-mono); font-size: 12px; }

/* ─── Column Sort ─── */
.col-sortable { cursor: pointer; position: relative; user-select: none; padding-right: 22px !important; }
.col-sortable:hover { background: var(--wx-hover-bg); }
.sort-indicator { margin-left: 4px; font-size: 9px; color: var(--wx-brand-primary); opacity: 0.9; }
.col-resize-handle { position: absolute; right: 0; top: 4px; bottom: 4px; width: 4px; cursor: col-resize; z-index: 2; border-radius: 2px; }
.col-resize-handle:hover { background: var(--wx-border-default); }

/* ─── Status & Value ─── */
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: var(--wx-radius-full); margin-right: 6px; vertical-align: middle; box-shadow: 0 0 0 2px rgba(0,0,0,0.06); }
.dot-live { background: var(--wx-success-solid); } .dot-die { background: var(--wx-danger-solid); } .dot-cp { background: var(--wx-warning-solid); }
.val-ok { color: var(--wx-success-text); font-weight: 500; } .val-no { color: var(--wx-text-disabled); }
.row-die td { opacity: 0.45; }
.row-highlight td { background: var(--wx-active-bg) !important; }
.cell-selected { background: var(--wx-selected-bg) !important; outline: 2px solid var(--wx-brand-primary); outline-offset: -2px; }
.cell-dragging { user-select: none; cursor: crosshair; }
.cell-dragging td { cursor: crosshair; }

/* ─── StatusBar ─── */
.app-statusbar {
  height: 30px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px; background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color); flex-shrink: 0;
  font-family: 'Segoe UI', var(--font-family); font-size: 12px; color: var(--text-secondary);
}
.statusbar-group { display: flex; align-items: center; gap: 10px; }
.statusbar-item { display: inline-flex; align-items: center; gap: 3px; white-space: nowrap; }
.sb-sep { width: 1px; height: 14px; background: var(--border-color); flex-shrink: 0; }
.sb-val { font-weight: 700; }
.sb-live { color: #16a34a; } .sb-die { color: #dc2626; } .sb-total { color: var(--brand-primary); }
.sb-highlight { color: #6366f1; } .sb-selected { color: #dc2626; } .sb-status { color: #16a34a; }
.sb-user { color: var(--brand-primary); } .sb-expiry { color: var(--brand-primary); } .sb-version { font-size: 11px; color: var(--text-tertiary); }
.statusbar-link { font-size: 12px; color: var(--brand-primary); text-decoration: none; cursor: pointer; font-weight: 500; }
.statusbar-link:hover { text-decoration: underline; }

/* ─── Context Menu ─── */
.dgv-ctx { position: fixed; z-index: 9999; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: var(--shadow-lg); padding: 4px 0; min-width: 210px; overflow: visible; }
.dgv-ctx-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 28px 7px 12px; border: none; background: none; text-align: left; font-size: 13px; cursor: pointer; color: var(--text-primary); position: relative; white-space: nowrap; box-sizing: border-box; font-family: var(--font-family); border-radius: 0; transition: background 0.1s; }
.ctx-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.7; }
.dgv-ctx-item:hover { background: var(--hover-bg); }
.dgv-ctx-item:hover .ctx-icon { opacity: 1; }
.dgv-ctx-item--danger { color: #dc2626; }
.dgv-ctx-item--danger:hover { background: var(--error-bg-subtle); }
.dgv-ctx-sep { height: 1px; background: var(--border-color); margin: 4px 8px; }
.dgv-ctx-parent { cursor: default; padding-right: 32px; }
.dgv-ctx-parent::after { content: '\203A'; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--text-tertiary); font-weight: 300; }
.dgv-ctx-sub { display: none; position: absolute; left: 100%; top: -4px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: var(--shadow-lg); padding: 4px 0; min-width: 220px; z-index: 10000; }
.dgv-ctx-sub--open { display: block; }
.dgv-ctx--left .dgv-ctx-sub { left: auto; right: 100%; }
.dgv-ctx-parent.dgv-ctx-parent--active { background: var(--hover-bg); }
.dgv-ctx-disabled { color: var(--text-tertiary); font-style: italic; pointer-events: none; }

/* ─── Update Field mini-modal ─── */
.update-overlay { position: fixed; inset: 0; z-index: 10001; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; }
.update-dialog { background: var(--card-bg); border-radius: 10px; box-shadow: var(--shadow-lg); width: 380px; overflow: hidden; }
.update-header { padding: 12px 18px; font-size: 14px; font-weight: 700; color: var(--text-primary); background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); }
.update-body { padding: 18px; }
.update-label { display: block; font-size: 12px; color: var(--text-tertiary); margin-bottom: 10px; }
.update-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family); font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s; background: var(--bg-secondary); color: var(--text-primary); }
.update-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(80,160,255,0.1); }
.update-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px; border-top: 1px solid var(--border-color); background: var(--bg-tertiary); }
.update-btn { padding: 7px 20px; border: none; border-radius: 6px; font-family: var(--font-family); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
.update-btn--save { background: var(--brand-primary); color: #fff; }
.update-btn--save:hover { background: #4090ee; }
.update-btn--cancel { background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-color); }
.update-btn--cancel:hover { background: var(--bg-tertiary); }
</style>
