<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { ColumnConfig } from '../../types'

const props = withDefaults(defineProps<{
  columns: ColumnConfig[]
  rows: Record<string, unknown>[]
  highlightedRows?: Set<number>
  selectedCells?: { row: number; col: string }[]
  showCheckbox?: boolean
  allChosen?: boolean
  rowHeight?: number
  loading?: boolean
  /**
   * Map giá trị ô cột `status` → tông chấm trạng thái (live = xanh · die = đỏ · cp = vàng · idle = xám).
   * Dòng có tông `die`/`idle` được làm mờ. Mặc định giữ nguyên Live / Die / Checkpoint.
   */
  statusMap?: Record<string, 'live' | 'die' | 'cp' | 'idle'>
}>(), {
  highlightedRows: () => new Set(),
  selectedCells: () => [],
  showCheckbox: true,
  allChosen: false,
  rowHeight: 36,
  loading: false,
  statusMap: () => ({ Live: 'live', Die: 'die', Checkpoint: 'cp' }),
})

const emit = defineEmits<{
  'toggle-all': [checked: boolean]
  'toggle-row': [index: number]
  'row-mousedown': [index: number, event: MouseEvent]
  'row-mouseenter': [index: number]
  'row-dblclick': [index: number]
  'cell-click': [row: number, col: string, event: MouseEvent]
  'contextmenu': [event: MouseEvent]
  'keydown': [event: KeyboardEvent]
  'sort': [column: string, direction: 'asc' | 'desc']
}>()

// ── Sort ──
const sortCol = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')

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

const visibleColumns = computed(() => props.columns.filter(c => c.visible))

// ── Virtual Scroll ──
const scrollContainer = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(400)

const totalHeight = computed(() => props.rows.length * props.rowHeight)
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - 5))
const endIndex = computed(() => Math.min(props.rows.length, Math.ceil((scrollTop.value + containerHeight.value) / props.rowHeight) + 5))
const visibleRows = computed(() => props.rows.slice(startIndex.value, endIndex.value))
const offsetY = computed(() => startIndex.value * props.rowHeight)

const useVirtual = computed(() => props.rows.length > 200)

function onScroll() {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop
  }
}

function updateContainerHeight() {
  if (scrollContainer.value) {
    containerHeight.value = scrollContainer.value.clientHeight
  }
}

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerHeight)
})

watch(() => props.rows.length, () => nextTick(updateContainerHeight))

// ── Column Resize ──
const colWidths = ref<Record<string, number>>({})
const resizing = ref<{ key: string; startX: number; startW: number } | null>(null)

function initColWidth(col: ColumnConfig): string {
  if (colWidths.value[col.key]) return colWidths.value[col.key] + 'px'
  return col.width || 'auto'
}

function onResizeStart(col: ColumnConfig, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  const th = (e.target as HTMLElement).parentElement!
  const startW = th.offsetWidth
  colWidths.value[col.key] = startW
  resizing.value = { key: col.key, startX: e.clientX, startW }
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  const diff = e.clientX - resizing.value.startX
  const newW = Math.max(40, resizing.value.startW + diff)
  colWidths.value[resizing.value.key] = newW
}

function onResizeEnd() {
  resizing.value = null
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
}

// ── Keyboard shortcuts ──
function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault()
    emit('toggle-all', true)
  }
  if (e.key === ' ') {
    e.preventDefault()
    // Space toggle — handled by parent via emit
  }
  emit('keydown', e)
}

// ── Helpers ──
function isHighlighted(idx: number): boolean {
  return props.highlightedRows.has(idx)
}

function isCellSelected(row: number, col: string): boolean {
  return props.selectedCells.some(c => c.row === row && c.col === col)
}

function getStatusDot(status: string): string {
  const tone = props.statusMap[status]
  return tone ? `dot-${tone}` : ''
}

function getRowClass(row: Record<string, unknown>, idx: number): string {
  const classes: string[] = []
  const tone = props.statusMap[String(row.status ?? '')]
  if (tone === 'die' || tone === 'idle') classes.push('row-die')
  if (isHighlighted(idx)) classes.push('row-highlight')
  return classes.join(' ')
}

// Map real index for virtual scroll
function realIndex(visibleIdx: number): number {
  return startIndex.value + visibleIdx
}
</script>

<template>
  <div
    class="datagrid-wrapper"
    tabindex="0"
    aria-label="Bảng dữ liệu"
    @contextmenu.prevent="emit('contextmenu', $event)"
    @keydown="onKeydown"
  >
    <!-- Loading shimmer -->
    <div v-if="loading" class="datagrid-loading" role="status" aria-busy="true">
      <div v-for="i in 8" :key="i" class="shimmer-row" aria-hidden="true">
        <div class="shimmer-cell" v-for="j in 5" :key="j" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="rows.length === 0" class="datagrid-empty" role="status">
      <slot name="empty">
        <span class="datagrid-empty__text">Không có dữ liệu</span>
      </slot>
    </div>

    <!-- Data table -->
    <div
      v-else
      ref="scrollContainer"
      class="datagrid-scroll"
      @scroll="onScroll"
    >
      <table class="datagrid" :class="{ 'datagrid--resizing': resizing }">
        <thead>
          <tr>
            <th v-if="showCheckbox" class="col-chk">
              <input type="checkbox" aria-label="Chọn tất cả" :checked="allChosen" @change="emit('toggle-all', ($event.target as HTMLInputElement).checked)" />
            </th>
            <th class="col-stt">STT</th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="[col.class, { 'th-sortable': col.sortable }]"
              :style="{ width: initColWidth(col), textAlign: col.align }"
              :aria-sort="col.sortable ? (sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined"
              :tabindex="col.sortable ? 0 : undefined"
              @click="onHeaderClick(col)"
              @keydown.enter.space.prevent="col.sortable ? onHeaderClick(col) : undefined"
            >
              {{ col.label }}
              <span v-if="col.sortable && sortCol === col.key" class="sort-indicator" :class="sortDir">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
              <span class="col-resizer" aria-hidden="true" @mousedown="onResizeStart(col, $event)" />
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Virtual scroll: spacer + visible rows -->
          <template v-if="useVirtual">
            <tr :style="{ height: offsetY + 'px' }" class="spacer-row" aria-hidden="true" />
            <tr
              v-for="(row, vIdx) in visibleRows"
              :key="realIndex(vIdx)"
              :class="getRowClass(row, realIndex(vIdx))"
              :style="{ height: rowHeight + 'px' }"
              :aria-selected="!!row.chose"
              @mousedown="emit('row-mousedown', realIndex(vIdx), $event)"
              @mouseenter="emit('row-mouseenter', realIndex(vIdx))"
              @dblclick="emit('row-dblclick', realIndex(vIdx))"
            >
              <td v-if="showCheckbox" class="col-chk">
                <input type="checkbox" :aria-label="`Chọn dòng ${realIndex(vIdx) + 1}`" :checked="!!row.chose" @change="emit('toggle-row', realIndex(vIdx))" />
              </td>
              <td class="col-stt">{{ realIndex(vIdx) + 1 }}</td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                :class="[col.class, { 'cell-selected': isCellSelected(realIndex(vIdx), col.key) }]"
                :style="col.align ? { textAlign: col.align } : undefined"
                @click="emit('cell-click', realIndex(vIdx), col.key, $event)"
              >
                <template v-if="col.key === 'status'">
                  <span class="status-dot" :class="getStatusDot(String(row[col.key] ?? ''))"></span>
                  {{ row[col.key] }}
                </template>
                <template v-else-if="col.key === 'cookie' || col.key === 'token'">
                  <span :class="row[col.key] === '✓' ? 'val-ok' : 'val-no'">{{ row[col.key] }}</span>
                </template>
                <template v-else>{{ row[col.key] }}</template>
              </td>
            </tr>
            <tr :style="{ height: (totalHeight - offsetY - visibleRows.length * rowHeight) + 'px' }" class="spacer-row" aria-hidden="true" />
          </template>

          <!-- Non-virtual: render all -->
          <template v-else>
            <tr
              v-for="(row, idx) in rows"
              :key="idx"
              :class="getRowClass(row, idx)"
              :aria-selected="!!row.chose"
              @mousedown="emit('row-mousedown', idx, $event)"
              @mouseenter="emit('row-mouseenter', idx)"
              @dblclick="emit('row-dblclick', idx)"
            >
              <td v-if="showCheckbox" class="col-chk">
                <input type="checkbox" :aria-label="`Chọn dòng ${idx + 1}`" :checked="!!row.chose" @change="emit('toggle-row', idx)" />
              </td>
              <td class="col-stt">{{ idx + 1 }}</td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                :class="[col.class, { 'cell-selected': isCellSelected(idx, col.key) }]"
                :style="col.align ? { textAlign: col.align } : undefined"
                @click="emit('cell-click', idx, col.key, $event)"
              >
                <template v-if="col.key === 'status'">
                  <span class="status-dot" :class="getStatusDot(String(row[col.key] ?? ''))"></span>
                  {{ row[col.key] }}
                </template>
                <template v-else-if="col.key === 'cookie' || col.key === 'token'">
                  <span :class="row[col.key] === '✓' ? 'val-ok' : 'val-no'">{{ row[col.key] }}</span>
                </template>
                <template v-else>{{ row[col.key] }}</template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.datagrid-wrapper { flex: 1; min-height: 0; height: 100%; overflow: hidden; background: var(--wx-surface-base); }
.datagrid-wrapper:focus { outline: none; }
.datagrid-wrapper:focus-visible { box-shadow: var(--wx-shadow-focus); }
.datagrid-scroll { height: 100%; overflow: auto; }
.datagrid { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); background: var(--wx-surface-base); table-layout: fixed; }
.datagrid--resizing { cursor: col-resize; user-select: none; }
.datagrid thead { position: sticky; top: 0; z-index: 5; }
/* Header kiểu bảng nguồn (compact): 12px / 600 / slate-600, nền sunken, không viết hoa; vạch phân cột mờ ở mép phải */
.datagrid th { height: 36px; padding: 0 var(--wx-space-3); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-text-secondary); letter-spacing: 0.015em; background: var(--wx-surface-sunken); border-bottom: 1px solid var(--wx-border-default); white-space: nowrap; position: relative; }
.datagrid th::after { content: ''; position: absolute; right: 0; top: 11px; height: 14px; width: 1px; background: var(--wx-border-default); opacity: 0.6; pointer-events: none; }
.datagrid td { padding: var(--wx-space-2) var(--wx-space-3); color: var(--wx-text-primary); border-bottom: 1px solid var(--wx-border-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.datagrid tbody tr { transition: background var(--wx-d-micro) var(--wx-ease-standard); }
.datagrid tbody tr:hover td { background: var(--wx-hover-neutral); }
.datagrid tbody tr { cursor: pointer; user-select: none; }
.datagrid input[type="checkbox"] { accent-color: var(--wx-brand-primary); cursor: pointer; }

/* Cột chọn: rộng cố định, KHÔNG padding (th/td mặc định padding 12px mỗi bên + border-box
   chỉ chừa ~12px nội dung → checkbox bị td overflow:hidden/ellipsis cắt thành "☐…").
   Selector 2 class thắng `.datagrid th/td`; bỏ ellipsis/clip để checkbox không bao giờ bị cắt. */
.datagrid .col-chk {
  width: var(--wx-grid-chk-w, 44px);
  padding: 0;
  text-align: center;
  overflow: visible;
  text-overflow: clip;
}
.datagrid .col-chk input[type="checkbox"] { display: block; margin: 0 auto; }
.col-stt { width: 40px; text-align: center; color: var(--wx-text-muted); }

.status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; vertical-align: middle; flex-shrink: 0; }
/* Live / Die nhấp nháy nhẹ như status-dot của nguồn (không nhấp nháy khi reduce-motion) */
.dot-live { background: var(--wx-success-solid); animation: wx-grid-dot-live 2s infinite; }
.dot-die { background: var(--wx-danger-solid); animation: wx-grid-dot-die 2s infinite; }
.dot-cp { background: var(--wx-warning-solid); }
.dot-idle { background: var(--wx-text-muted); }
@keyframes wx-grid-dot-live {
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0 color-mix(in srgb, var(--wx-success-solid) 70%, transparent); }
  70%  { transform: scale(1.1);  box-shadow: 0 0 0 4px transparent; }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 transparent; }
}
@keyframes wx-grid-dot-die {
  0%   { transform: scale(0.95); box-shadow: 0 0 0 0 color-mix(in srgb, var(--wx-danger-solid) 70%, transparent); }
  70%  { transform: scale(1.1);  box-shadow: 0 0 0 4px transparent; }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 transparent; }
}
@media (prefers-reduced-motion: reduce) { .dot-live, .dot-die { animation: none; } }
.val-ok { color: var(--wx-success-solid); }
.val-no { color: var(--wx-text-muted); }
.row-die td { opacity: 0.6; }
.row-highlight td { background: var(--wx-selected-bg) !important; }
.row-highlight:hover td { background: var(--wx-selected-bg-hover) !important; }
.cell-selected { background: var(--wx-selected-bg-hover) !important; outline: 2px solid var(--wx-brand-600); outline-offset: -2px; border-radius: var(--wx-radius-sm); }

/* Sort */
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: var(--wx-text-primary); background: var(--wx-hover-neutral); }
.sort-indicator { font-size: 10px; margin-left: var(--wx-space-1); color: var(--wx-brand-primary); transition: transform 0.2s; }
.sort-indicator.desc { display: inline-block; }

/* Column resizer */
.col-resizer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  user-select: none;
}
.col-resizer:hover { background: var(--wx-brand-primary); opacity: 0.3; }

/* Spacer rows for virtual scroll */
.spacer-row td { padding: 0; border: none; }

/* Loading shimmer */
.datagrid-loading { padding: var(--wx-space-3); }
.shimmer-row { display: flex; gap: var(--wx-space-3); margin-bottom: var(--wx-space-2); }
.shimmer-cell {
  height: 28px;
  flex: 1;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--wx-surface-sunken) 25%, var(--wx-surface-elevated) 50%, var(--wx-surface-sunken) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Empty state */
.datagrid-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
}
.datagrid-empty__text {
  font-size: 14px;
  color: var(--wx-text-muted);
}
</style>
