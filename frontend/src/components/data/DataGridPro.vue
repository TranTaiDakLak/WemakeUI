<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { ColumnConfig } from '../../types'
import BaseSelectMenu from '@/components/common/BaseSelectMenu.vue'

export type DataGridDensity = 'sm' | 'md' | 'lg'

export interface SavedView {
  id: string
  name: string
  icon?: string
  state: {
    sortCol: string
    sortDir: 'asc' | 'desc'
    columns: ColumnConfig[]
    density: DataGridDensity
    pinnedLeft: string[]
    pinnedRight: string[]
  }
}

const props = withDefaults(defineProps<{
  columns: ColumnConfig[]
  rows: Record<string, unknown>[]
  rowKey?: string
  selected?: Set<string | number>
  density?: DataGridDensity
  virtual?: boolean | 'auto'
  resizable?: boolean
  pinnable?: boolean
  reorderable?: boolean
  inlineEdit?: boolean
  loading?: boolean
  savedViews?: SavedView[]
  bordered?: boolean
  striped?: boolean
}>(), {
  rowKey: 'id',
  density: 'md',
  virtual: 'auto',
  resizable: true,
  pinnable: false,
  reorderable: false,
  inlineEdit: false,
  loading: false,
  savedViews: () => [],
  bordered: true,
  striped: false,
})

const emit = defineEmits<{
  'update:selected': [ids: Set<string | number>]
  'update:density': [d: DataGridDensity]
  'update:columns': [cols: ColumnConfig[]]
  'cell-edit': [row: Record<string, unknown>, col: string, oldVal: unknown, newVal: unknown]
  'sort': [col: string, dir: 'asc' | 'desc']
  'save-view': [view: Omit<SavedView, 'id'>]
  'apply-view': [view: SavedView]
  'export': [format: 'csv' | 'json', rows: Record<string, unknown>[]]
  'row-contextmenu': [row: Record<string, unknown>, event: MouseEvent]
  'row-click': [row: Record<string, unknown>, event: MouseEvent]
}>()

/* ── Density → row height ────────────────────────── */
const rowHeight = computed(() => ({ sm: 32, md: 40, lg: 48 }[props.density]))

/* ── Pin state ───────────────────────────────────── */
const pinnedLeft = ref<string[]>([])
const pinnedRight = ref<string[]>([])

function isPinnedLeft(key: string) { return pinnedLeft.value.includes(key) }
function isPinnedRight(key: string) { return pinnedRight.value.includes(key) }

function pinColumn(key: string, side: 'left' | 'right' | 'none') {
  pinnedLeft.value = pinnedLeft.value.filter((k) => k !== key)
  pinnedRight.value = pinnedRight.value.filter((k) => k !== key)
  if (side === 'left') pinnedLeft.value.push(key)
  if (side === 'right') pinnedRight.value.push(key)
  closeColMenu()
}

/* ── Column ordering ─────────────────────────────── */
const orderedCols = ref<ColumnConfig[]>([...props.columns])
watch(() => props.columns, (cols) => { orderedCols.value = [...cols] }, { deep: true })

const visibleColumns = computed(() => {
  const visible = orderedCols.value.filter((c) => c.visible)
  const left = pinnedLeft.value.map((k) => visible.find((c) => c.key === k)).filter(Boolean) as ColumnConfig[]
  const right = pinnedRight.value.map((k) => visible.find((c) => c.key === k)).filter(Boolean) as ColumnConfig[]
  const middle = visible.filter((c) => !pinnedLeft.value.includes(c.key) && !pinnedRight.value.includes(c.key))
  return [...left, ...middle, ...right]
})

/* ── Drag reorder ────────────────────────────────── */
const dragColKey = ref<string | null>(null)
const dropColKey = ref<string | null>(null)

function onColDragStart(col: ColumnConfig, e: DragEvent) {
  if (!props.reorderable) return
  dragColKey.value = col.key
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onColDragOver(col: ColumnConfig, e: DragEvent) {
  if (!props.reorderable || !dragColKey.value) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dropColKey.value = col.key
}

function onColDrop(target: ColumnConfig) {
  if (!dragColKey.value || dragColKey.value === target.key) return
  const fromIdx = orderedCols.value.findIndex((c) => c.key === dragColKey.value)
  const toIdx = orderedCols.value.findIndex((c) => c.key === target.key)
  if (fromIdx < 0 || toIdx < 0) return
  const next = [...orderedCols.value]
  const [moved] = next.splice(fromIdx, 1)
  next.splice(toIdx, 0, moved)
  orderedCols.value = next
  emit('update:columns', next)
  dragColKey.value = null
  dropColKey.value = null
}

function onColDragEnd() {
  dragColKey.value = null
  dropColKey.value = null
}

/* ── Sort ────────────────────────────────────────── */
const sortCol = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

const sortedRows = computed(() => {
  if (!sortCol.value) return props.rows
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const av = a[sortCol.value]
    const bv = b[sortCol.value]
    if (av == null && bv == null) return 0
    if (av == null) return dir
    if (bv == null) return -dir
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })
})

function onHeaderClick(col: ColumnConfig) {
  if (!col.sortable) return
  if (sortCol.value === col.key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col.key
    sortDir.value = 'asc'
  }
  emit('sort', sortCol.value, sortDir.value)
}

/* ── Selection ───────────────────────────────────── */
const localSelected = ref<Set<string | number>>(new Set(props.selected ?? []))
watch(() => props.selected, (s) => { if (s) localSelected.value = new Set(s) })

const allSelected = computed(() => {
  if (!sortedRows.value.length) return false
  return sortedRows.value.every((r) => localSelected.value.has(r[props.rowKey] as string | number))
})

function getRowId(row: Record<string, unknown>): string | number {
  return row[props.rowKey] as string | number
}

function toggleAll(checked: boolean) {
  const next = new Set(localSelected.value)
  if (checked) sortedRows.value.forEach((r) => next.add(getRowId(r)))
  else sortedRows.value.forEach((r) => next.delete(getRowId(r)))
  localSelected.value = next
  emit('update:selected', next)
}

function toggleRow(row: Record<string, unknown>) {
  const id = getRowId(row)
  const next = new Set(localSelected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  localSelected.value = next
  emit('update:selected', next)
}

/* ── Virtual scroll ──────────────────────────────── */
const useVirtualScroll = computed(() => {
  if (props.virtual === true) return true
  if (props.virtual === false) return false
  return sortedRows.value.length > 100
})

const scrollEl = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(400)

const totalHeight = computed(() => sortedRows.value.length * rowHeight.value)
const startIdx = computed(() => Math.max(0, Math.floor(scrollTop.value / rowHeight.value) - 5))
const endIdx = computed(() =>
  Math.min(sortedRows.value.length, Math.ceil((scrollTop.value + containerHeight.value) / rowHeight.value) + 5),
)
const visibleRows = computed(() =>
  useVirtualScroll.value ? sortedRows.value.slice(startIdx.value, endIdx.value) : sortedRows.value,
)
const offsetY = computed(() => useVirtualScroll.value ? startIdx.value * rowHeight.value : 0)

function onScroll() {
  if (!scrollEl.value) return
  scrollTop.value = scrollEl.value.scrollTop
}

function updateContainerHeight() {
  if (scrollEl.value) containerHeight.value = scrollEl.value.clientHeight
}

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
})
onBeforeUnmount(() => window.removeEventListener('resize', updateContainerHeight))

watch(() => sortedRows.value.length, () => nextTick(updateContainerHeight))

/* ── Column resize ───────────────────────────────── */
const colWidths = ref<Record<string, number>>({})
const resizingKey = ref<string | null>(null)

function colWidth(col: ColumnConfig): string {
  if (colWidths.value[col.key]) return colWidths.value[col.key] + 'px'
  return col.width || '160px'
}

const tableWidth = computed(() => {
  let w = 36 // dgp-col-chk
  for (const col of visibleColumns.value)
    w += colWidths.value[col.key] ?? parseInt(col.width ?? '') || 160
  return w
})

function onResizeStart(col: ColumnConfig, e: MouseEvent) {
  if (!props.resizable) return
  e.preventDefault()
  e.stopPropagation()
  const th = (e.target as HTMLElement).closest('th') as HTMLElement
  const startW = th.offsetWidth
  const startX = e.clientX
  resizingKey.value = col.key

  function onMove(ev: MouseEvent) {
    const newW = Math.max(60, startW + (ev.clientX - startX))
    colWidths.value = { ...colWidths.value, [col.key]: newW }
  }
  function onUp() {
    resizingKey.value = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/* ── Inline edit ─────────────────────────────────── */
const editing = ref<{ row: number; col: string } | null>(null)
const editValue = ref('')

function onCellDblclick(rowIdx: number, col: ColumnConfig, row: Record<string, unknown>) {
  if (!props.inlineEdit) return
  if (col.key === '__chk' || col.key === '__stt') return
  editing.value = { row: rowIdx, col: col.key }
  editValue.value = String(row[col.key] ?? '')
}

function commitEdit(row: Record<string, unknown>, col: string) {
  if (!editing.value) return
  const oldVal = row[col]
  const newVal = editValue.value
  if (String(oldVal ?? '') !== newVal) {
    emit('cell-edit', row, col, oldVal, newVal)
  }
  editing.value = null
}

function cancelEdit() {
  editing.value = null
}

/* ── Column menu ─────────────────────────────────── */
const colMenuKey = ref<string | null>(null)
const colMenuPos = ref({ x: 0, y: 0 })

function openColMenu(col: ColumnConfig, e: MouseEvent) {
  e.stopPropagation()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  colMenuPos.value = { x: rect.left, y: rect.bottom + 4 }
  colMenuKey.value = col.key
}
function closeColMenu() { colMenuKey.value = null }

function toggleColumnVisible(key: string) {
  orderedCols.value = orderedCols.value.map((c) =>
    c.key === key ? { ...c, visible: !c.visible } : c,
  )
  emit('update:columns', orderedCols.value)
}

onMounted(() => document.addEventListener('click', closeColMenu))
onBeforeUnmount(() => document.removeEventListener('click', closeColMenu))

/* ── Density change ──────────────────────────────── */
function setDensity(d: DataGridDensity) {
  emit('update:density', d)
}

/* ── Saved views ─────────────────────────────────── */
const showSaveViewDialog = ref(false)
const newViewName = ref('')

function captureState() {
  return {
    sortCol: sortCol.value,
    sortDir: sortDir.value,
    columns: [...orderedCols.value],
    density: props.density,
    pinnedLeft: [...pinnedLeft.value],
    pinnedRight: [...pinnedRight.value],
  }
}

function saveCurrentView() {
  if (!newViewName.value.trim()) return
  emit('save-view', { name: newViewName.value, state: captureState() })
  newViewName.value = ''
  showSaveViewDialog.value = false
}

function applyView(v: SavedView) {
  sortCol.value = v.state.sortCol
  sortDir.value = v.state.sortDir
  orderedCols.value = [...v.state.columns]
  pinnedLeft.value = [...v.state.pinnedLeft]
  pinnedRight.value = [...v.state.pinnedRight]
  emit('apply-view', v)
}

/* ── Export ──────────────────────────────────────── */
function exportCSV() {
  const cols = visibleColumns.value
  const head = cols.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',')
  const body = sortedRows.value.map((r) =>
    cols.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(','),
  ).join('\n')
  downloadFile(`${head}\n${body}`, 'text/csv', 'export.csv')
  emit('export', 'csv', sortedRows.value)
}

function exportJSON() {
  const cols = visibleColumns.value.map((c) => c.key)
  const data = sortedRows.value.map((r) => {
    const out: Record<string, unknown> = {}
    cols.forEach((k) => { out[k] = r[k] })
    return out
  })
  downloadFile(JSON.stringify(data, null, 2), 'application/json', 'export.json')
  emit('export', 'json', sortedRows.value)
}

function downloadFile(content: string, type: string, name: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div :class="['dgp', `dgp--d-${density}`]">
    <!-- Toolbar -->
    <div class="dgp-toolbar">
      <div class="dgp-toolbar__group">
        <span class="dgp-meta">{{ sortedRows.length }} dòng</span>
        <span v-if="localSelected.size" class="dgp-meta dgp-meta--selected">
          {{ localSelected.size }} đã chọn
        </span>
      </div>
      <div class="dgp-toolbar__group">
        <!-- Slot tuỳ biến: nút/filter của consumer (search, filter-chips…) -->
        <slot name="toolbar-actions" />
        <!-- Density -->
        <div class="dgp-density">
          <button
            v-for="d in ['sm', 'md', 'lg'] as DataGridDensity[]"
            :key="d"
            type="button"
            class="dgp-tool-btn"
            :class="{ 'dgp-tool-btn--active': density === d }"
            @click="setDensity(d)"
          >{{ d }}</button>
        </div>
        <!-- Saved views -->
        <BaseSelectMenu
          v-if="savedViews.length"
          class="dgp-select"
          size="sm"
          model-value=""
          placeholder="Chọn view..."
          :options="savedViews.map(v => ({ value: v.id, label: `${v.icon ?? ''} ${v.name}`.trim() }))"
          @update:model-value="(id) => { const v = savedViews.find(x => x.id === id); if (v) applyView(v) }"
        />
        <button type="button" class="dgp-tool-btn" @click="showSaveViewDialog = true">+ View</button>
        <!-- Export -->
        <button type="button" class="dgp-tool-btn" @click="exportCSV">CSV</button>
        <button type="button" class="dgp-tool-btn" @click="exportJSON">JSON</button>
      </div>
    </div>

    <!-- Save view dialog (inline) -->
    <div v-if="showSaveViewDialog" class="dgp-saveview">
      <input
        v-model="newViewName"
        class="dgp-input"
        placeholder="Tên view (vd: Live đã sort)..."
        @keydown.enter="saveCurrentView"
        @keydown.esc="showSaveViewDialog = false"
      />
      <button type="button" class="dgp-tool-btn" @click="saveCurrentView">Lưu</button>
      <button type="button" class="dgp-tool-btn" @click="showSaveViewDialog = false">Huỷ</button>
    </div>

    <!-- Body -->
    <div ref="scrollEl" class="dgp-scroll" @scroll="onScroll">
      <div v-if="loading" class="dgp-loading">Đang tải...</div>
      <div v-else-if="sortedRows.length === 0" class="dgp-empty">Không có dữ liệu</div>
      <table v-else class="dgp-table" :class="{ 'dgp-table--bordered': bordered, 'dgp-table--striped': striped }" :style="{ width: tableWidth + 'px', minWidth: '100%' }">
        <thead>
          <tr>
            <th class="dgp-col-chk">
              <input type="checkbox" :checked="allSelected" @change="toggleAll(($event.target as HTMLInputElement).checked)" />
            </th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="{
                'dgp-th': true,
                'dgp-th--sortable': col.sortable,
                'dgp-th--pinned-left': isPinnedLeft(col.key),
                'dgp-th--pinned-right': isPinnedRight(col.key),
                'dgp-th--drop': dropColKey === col.key,
              }"
              :style="{ width: colWidth(col) }"
              :draggable="reorderable"
              @dragstart="onColDragStart(col, $event)"
              @dragover="onColDragOver(col, $event)"
              @drop="onColDrop(col)"
              @dragend="onColDragEnd"
            >
              <span class="dgp-th__label" @click="onHeaderClick(col)">
                <slot :name="`header-${col.key}`" :col="col">
                  <slot name="header" :col="col">{{ col.label }}</slot>
                </slot>
              </span>
              <span v-if="col.sortable && sortCol === col.key" class="dgp-th__sort">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
              <button
                v-if="pinnable"
                type="button"
                class="dgp-th__menu"
                @click="openColMenu(col, $event)"
                aria-label="Tuỳ chọn cột"
              >⋮</button>
              <span
                v-if="resizable"
                class="dgp-th__resizer"
                :class="{ 'dgp-th__resizer--active': resizingKey === col.key }"
                @mousedown="onResizeStart(col, $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="useVirtualScroll">
            <tr :style="{ height: offsetY + 'px' }" class="dgp-spacer" />
          </template>
          <tr
            v-for="(row, idx) in visibleRows"
            :key="getRowId(row) ?? idx"
            class="dgp-tr"
            :class="{ 'dgp-tr--selected': localSelected.has(getRowId(row)) }"
            :style="{ height: rowHeight + 'px' }"
            @click="emit('row-click', row, $event)"
            @contextmenu="emit('row-contextmenu', row, $event)"
          >
            <td class="dgp-col-chk">
              <input type="checkbox" :checked="localSelected.has(getRowId(row))" @change="toggleRow(row)" />
            </td>
            <td
              v-for="col in visibleColumns"
              :key="col.key"
              class="dgp-td"
              :class="{
                'dgp-td--pinned-left': isPinnedLeft(col.key),
                'dgp-td--pinned-right': isPinnedRight(col.key),
              }"
              @dblclick="onCellDblclick(idx, col, row)"
            >
              <template v-if="editing && editing.row === idx && editing.col === col.key">
                <input
                  v-model="editValue"
                  class="dgp-edit-input"
                  autofocus
                  @blur="commitEdit(row, col.key)"
                  @keydown.enter="commitEdit(row, col.key)"
                  @keydown.esc="cancelEdit"
                />
              </template>
              <template v-else>
                <!-- Cell slot tuỳ biến: ưu tiên `cell-<key>` (per-cột), fallback `cell` (chung),
                     cuối cùng là text mặc định → 100% backward-compatible khi không truyền slot. -->
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :col="col" :row-index="idx">
                  <slot name="cell" :row="row" :value="row[col.key]" :col="col" :row-index="idx">{{ row[col.key] }}</slot>
                </slot>
              </template>
            </td>
          </tr>
          <template v-if="useVirtualScroll">
            <tr :style="{ height: (totalHeight - offsetY - visibleRows.length * rowHeight) + 'px' }" class="dgp-spacer" />
          </template>
        </tbody>
      </table>
    </div>

    <!-- Footer slot: stats-bar / tổng hợp của consumer (dưới grid) -->
    <div v-if="$slots.footer" class="dgp-footer">
      <slot name="footer" :rows="sortedRows" :selected="localSelected" />
    </div>

    <!-- Column menu -->
    <teleport to="body">
      <div
        v-if="colMenuKey"
        class="dgp-colmenu"
        :style="{ left: colMenuPos.x + 'px', top: colMenuPos.y + 'px' }"
        @click.stop
      >
        <button type="button" class="dgp-colmenu__item" @click="pinColumn(colMenuKey, 'left')">📌 Ghim trái</button>
        <button type="button" class="dgp-colmenu__item" @click="pinColumn(colMenuKey, 'right')">📌 Ghim phải</button>
        <button type="button" class="dgp-colmenu__item" @click="pinColumn(colMenuKey, 'none')">Bỏ ghim</button>
        <div class="dgp-colmenu__sep" />
        <button type="button" class="dgp-colmenu__item" @click="toggleColumnVisible(colMenuKey); closeColMenu()">Ẩn cột</button>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.dgp {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  overflow: hidden;
  font-family: var(--wx-font-primary);
}

.dgp-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--wx-surface-sunken);
  border-bottom: 1px solid var(--wx-border-default);
  flex-wrap: wrap;
  gap: 8px;
}

.dgp-toolbar__group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dgp-meta {
  font-size: 12px;
  color: var(--wx-text-muted);
  font-family: var(--wx-font-mono);
}

.dgp-meta--selected {
  color: var(--wx-brand-primary);
  font-weight: 700;
}

.dgp-tool-btn {
  padding: 4px 10px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  color: var(--wx-text-secondary);
  cursor: pointer;
  font-family: var(--wx-font-primary);
  white-space: nowrap;
}

.dgp-tool-btn:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.dgp-tool-btn--active {
  background: var(--wx-brand-primary);
  color: var(--wx-text-inverse);
  border-color: var(--wx-brand-primary);
}

.dgp-density {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
}

.dgp-density .dgp-tool-btn {
  border: none;
  text-transform: uppercase;
  padding: 2px 8px;
}

.dgp-select {
  padding: 4px 10px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  color: var(--wx-text-secondary);
  cursor: pointer;
  font-family: var(--wx-font-primary);
}

.dgp-saveview {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background: var(--wx-info-bg);
  border-bottom: 1px solid var(--wx-info-border);
}

.dgp-input {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  font-family: var(--wx-font-primary);
}

.dgp-input:focus {
  outline: none;
  border-color: var(--wx-brand-focus);
}

/* Body */
.dgp-scroll {
  flex: 1;
  overflow: auto;
  position: relative;
}

.dgp-loading,
.dgp-empty {
  padding: 32px;
  text-align: center;
  color: var(--wx-text-muted);
}

.dgp-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--wx-surface-sunken);
  border-top: 1px solid var(--wx-border-default);
  font-size: 12px;
  color: var(--wx-text-secondary);
  flex-wrap: wrap;
}

.dgp-table {
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.dgp-table thead {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--wx-surface-sunken);
}

.dgp-th {
  padding: 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--wx-text-muted);
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--wx-border-default);
  background: var(--wx-surface-sunken);
  position: relative;
  white-space: nowrap;
}

.dgp-th--sortable .dgp-th__label {
  cursor: pointer;
}

.dgp-th--sortable:hover {
  color: var(--wx-text-primary);
}

.dgp-th--drop {
  background: var(--wx-info-bg);
  color: var(--wx-info-text);
}

.dgp-th--pinned-left,
.dgp-td--pinned-left {
  position: sticky;
  left: 0;
  background: var(--wx-surface-base);
  z-index: 2;
  box-shadow: 1px 0 0 0 var(--wx-border-default);
}

.dgp-th--pinned-left {
  background: var(--wx-surface-sunken);
}

.dgp-th--pinned-right,
.dgp-td--pinned-right {
  position: sticky;
  right: 0;
  background: var(--wx-surface-base);
  z-index: 2;
  box-shadow: -1px 0 0 0 var(--wx-border-default);
}

.dgp-th--pinned-right {
  background: var(--wx-surface-sunken);
}

.dgp-th__label { display: inline-block; }

.dgp-th__sort {
  margin-left: 4px;
  color: var(--wx-brand-primary);
  font-size: 9px;
}

.dgp-th__menu {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 14px;
  color: var(--wx-text-muted);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: var(--wx-radius-sm);
}

.dgp-th__menu:hover {
  color: var(--wx-text-primary);
  background: var(--wx-hover-bg);
}

.dgp-th__resizer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  user-select: none;
}

.dgp-th__resizer:hover,
.dgp-th__resizer--active {
  background: var(--wx-brand-primary);
  opacity: 0.5;
}

.dgp-tr {
  background: var(--wx-surface-base);
  transition: background var(--wx-duration-fast);
}

.dgp-table--striped .dgp-tr:nth-child(even):not(.dgp-spacer) {
  background: var(--wx-surface-sunken);
}

.dgp-tr:hover .dgp-td:not(.dgp-td--pinned-left):not(.dgp-td--pinned-right) {
  background: var(--wx-hover-bg);
}

.dgp-tr--selected .dgp-td {
  background: var(--wx-info-bg) !important;
}

.dgp-td {
  padding: 0 12px;
  border-bottom: 1px solid var(--wx-border-subtle);
  color: var(--wx-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.dgp-table--bordered .dgp-td,
.dgp-table--bordered .dgp-th {
  border-right: 1px solid var(--wx-border-subtle);
}

.dgp-table--bordered .dgp-td:last-child,
.dgp-table--bordered .dgp-th:last-child {
  border-right: none;
}

.dgp-col-chk {
  width: 36px !important;
  padding: 0 !important;
  text-align: center;
}

.dgp-col-chk input[type="checkbox"] {
  accent-color: var(--wx-brand-primary);
  cursor: pointer;
}

.dgp-edit-input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid var(--wx-brand-focus);
  border-radius: var(--wx-radius-sm);
  background: var(--wx-surface-base);
  font-size: 12px;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-primary);
}

.dgp-edit-input:focus {
  outline: none;
  box-shadow: var(--wx-shadow-focus);
}

.dgp-spacer td {
  padding: 0;
  border: none;
}

.dgp-colmenu {
  position: fixed;
  z-index: 9999;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-md);
  box-shadow: var(--wx-shadow-lg);
  padding: 4px;
  min-width: 160px;
  font-family: var(--wx-font-primary);
}

.dgp-colmenu__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  color: var(--wx-text-primary);
  border-radius: var(--wx-radius-sm);
  font-family: var(--wx-font-primary);
}

.dgp-colmenu__item:hover {
  background: var(--wx-hover-bg);
}

.dgp-colmenu__sep {
  height: 1px;
  margin: 4px 0;
  background: var(--wx-border-subtle);
}

/* Header padding theo density — khớp AccountsView */
.dgp--d-sm .dgp-th { padding: 7px 10px; }
.dgp--d-md .dgp-th { padding: 12px; }
.dgp--d-lg .dgp-th { padding: 14px 12px; }
</style>
