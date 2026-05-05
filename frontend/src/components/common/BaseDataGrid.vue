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
}>(), {
  highlightedRows: () => new Set(),
  selectedCells: () => [],
  showCheckbox: true,
  allChosen: false,
  rowHeight: 36,
  loading: false,
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
  if (status === 'Live') return 'dot-live'
  if (status === 'Die') return 'dot-die'
  if (status === 'Checkpoint') return 'dot-cp'
  return ''
}

function getRowClass(row: Record<string, unknown>, idx: number): string {
  const classes: string[] = []
  if (row.status === 'Die') classes.push('row-die')
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
    @contextmenu.prevent="emit('contextmenu', $event)"
    @keydown="onKeydown"
  >
    <!-- Loading shimmer -->
    <div v-if="loading" class="datagrid-loading">
      <div v-for="i in 8" :key="i" class="shimmer-row">
        <div class="shimmer-cell" v-for="j in 5" :key="j" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="rows.length === 0" class="datagrid-empty">
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
              <input type="checkbox" :checked="allChosen" @change="emit('toggle-all', ($event.target as HTMLInputElement).checked)" />
            </th>
            <th class="col-stt">STT</th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="[col.class, { 'th-sortable': col.sortable }]"
              :style="{ width: initColWidth(col) }"
              @click="onHeaderClick(col)"
            >
              {{ col.label }}
              <span v-if="col.sortable && sortCol === col.key" class="sort-indicator" :class="sortDir">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
              <span class="col-resizer" @mousedown="onResizeStart(col, $event)" />
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Virtual scroll: spacer + visible rows -->
          <template v-if="useVirtual">
            <tr :style="{ height: offsetY + 'px' }" class="spacer-row" />
            <tr
              v-for="(row, vIdx) in visibleRows"
              :key="realIndex(vIdx)"
              :class="getRowClass(row, realIndex(vIdx))"
              :style="{ height: rowHeight + 'px' }"
              @mousedown="emit('row-mousedown', realIndex(vIdx), $event)"
              @mouseenter="emit('row-mouseenter', realIndex(vIdx))"
              @dblclick="emit('row-dblclick', realIndex(vIdx))"
            >
              <td v-if="showCheckbox" class="col-chk">
                <input type="checkbox" :checked="!!row.chose" @change="emit('toggle-row', realIndex(vIdx))" />
              </td>
              <td class="col-stt">{{ realIndex(vIdx) + 1 }}</td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                :class="[col.class, { 'cell-selected': isCellSelected(realIndex(vIdx), col.key) }]"
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
            <tr :style="{ height: (totalHeight - offsetY - visibleRows.length * rowHeight) + 'px' }" class="spacer-row" />
          </template>

          <!-- Non-virtual: render all -->
          <template v-else>
            <tr
              v-for="(row, idx) in rows"
              :key="idx"
              :class="getRowClass(row, idx)"
              @mousedown="emit('row-mousedown', idx, $event)"
              @mouseenter="emit('row-mouseenter', idx)"
              @dblclick="emit('row-dblclick', idx)"
            >
              <td v-if="showCheckbox" class="col-chk">
                <input type="checkbox" :checked="!!row.chose" @change="emit('toggle-row', idx)" />
              </td>
              <td class="col-stt">{{ idx + 1 }}</td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                :class="[col.class, { 'cell-selected': isCellSelected(idx, col.key) }]"
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
.datagrid-wrapper { flex: 1; min-height: 0; overflow: hidden; background: var(--bg-primary); }
.datagrid-wrapper:focus { outline: none; }
.datagrid-scroll { height: 100%; overflow: auto; }
.datagrid { width: 100%; border-collapse: collapse; font-size: var(--font-size-small, 12px); background: var(--bg-primary); table-layout: fixed; }
.datagrid--resizing { cursor: col-resize; user-select: none; }
.datagrid thead { position: sticky; top: 0; z-index: 5; }
.datagrid th { padding: 9px 12px; text-align: left; font-size: 13px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.3px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); white-space: nowrap; position: relative; }
.datagrid td { padding: 8px 12px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.datagrid tbody tr:hover td { background: var(--hover-bg); }
.datagrid tbody tr { cursor: pointer; user-select: none; }
.datagrid input[type="checkbox"] { accent-color: var(--brand-primary); cursor: pointer; }

.col-chk { width: 36px; text-align: center; }
.col-stt { width: 40px; text-align: center; color: var(--text-tertiary); }

.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
.dot-live { background: var(--success-color); }
.dot-die { background: var(--error-color); }
.dot-cp { background: var(--warning-color); }
.val-ok { color: var(--success-color); }
.val-no { color: var(--text-tertiary); }
.row-die td { opacity: 0.6; }
.row-highlight td { background: var(--active-bg) !important; }
.cell-selected { background: var(--hover-bg) !important; outline: 2px solid var(--brand-primary); outline-offset: -2px; }

/* Sort */
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: var(--text-primary); }
.sort-indicator { font-size: 10px; margin-left: 4px; color: var(--brand-primary); transition: transform 0.2s; }
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
.col-resizer:hover { background: var(--brand-primary); opacity: 0.3; }

/* Spacer rows for virtual scroll */
.spacer-row td { padding: 0; border: none; }

/* Loading shimmer */
.datagrid-loading { padding: 12px; }
.shimmer-row { display: flex; gap: 12px; margin-bottom: 8px; }
.shimmer-cell {
  height: 28px;
  flex: 1;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
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
  color: var(--text-tertiary);
}
</style>
