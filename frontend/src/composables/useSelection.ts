import { ref, computed } from 'vue'
import type { CellRef } from '../types'

/**
 * Composable for row highlighting and cell selection.
 * Matches C# WeFacebook dgvAccount_SelectionChanged behavior:
 * - Click = select one row
 * - Shift+Click = range select
 * - Ctrl+Click = toggle
 * - Drag = range highlight
 * - Cell click with Shift/Ctrl for multi-cell
 */
export function useSelection(columnKeys: readonly string[]) {
  // Row highlighting ("Bôi đen")
  const highlightedRows = ref<Set<number>>(new Set())
  let lastClickedIdx = -1
  let isDragging = false

  // Cell selection
  const selectedCells = ref<CellRef[]>([])
  let lastCellRow = -1
  let lastCellCol = ''

  const highlightCount = computed(() => highlightedRows.value.size)

  function onRowMouseDown(idx: number, e: MouseEvent) {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    isDragging = true

    if (e.shiftKey && lastClickedIdx >= 0) {
      const start = Math.min(lastClickedIdx, idx)
      const end = Math.max(lastClickedIdx, idx)
      highlightedRows.value = new Set()
      for (let i = start; i <= end; i++) highlightedRows.value.add(i)
    } else if (e.ctrlKey || e.metaKey) {
      const s = new Set(highlightedRows.value)
      if (s.has(idx)) s.delete(idx); else s.add(idx)
      highlightedRows.value = s
    } else {
      highlightedRows.value = new Set([idx])
    }
    lastClickedIdx = idx
  }

  function onRowMouseEnter(idx: number) {
    if (!isDragging || lastClickedIdx < 0) return
    const start = Math.min(lastClickedIdx, idx)
    const end = Math.max(lastClickedIdx, idx)
    const s = new Set<number>()
    for (let i = start; i <= end; i++) s.add(i)
    highlightedRows.value = s
  }

  function onMouseUp() {
    isDragging = false
  }

  function onCellClick(row: number, col: string, e: MouseEvent) {
    e.stopPropagation()
    if (e.ctrlKey || e.metaKey) {
      const idx = selectedCells.value.findIndex(c => c.row === row && c.col === col)
      if (idx >= 0) selectedCells.value.splice(idx, 1)
      else selectedCells.value.push({ row, col })
    } else if (e.shiftKey && lastCellRow >= 0) {
      const r1 = Math.min(lastCellRow, row), r2 = Math.max(lastCellRow, row)
      const c1 = columnKeys.indexOf(lastCellCol), c2 = columnKeys.indexOf(col)
      const cMin = Math.min(c1, c2), cMax = Math.max(c1, c2)
      const cells: CellRef[] = []
      for (let r = r1; r <= r2; r++) {
        for (let c = cMin; c <= cMax; c++) cells.push({ row: r, col: columnKeys[c] })
      }
      selectedCells.value = cells
    } else {
      selectedCells.value = [{ row, col }]
    }
    lastCellRow = row
    lastCellCol = col
  }

  function isCellSelected(row: number, col: string): boolean {
    return selectedCells.value.some(c => c.row === row && c.col === col)
  }

  function clearSelection() {
    highlightedRows.value = new Set()
    selectedCells.value = []
    lastClickedIdx = -1
    lastCellRow = -1
    lastCellCol = ''
  }

  return {
    highlightedRows,
    selectedCells,
    highlightCount,
    onRowMouseDown,
    onRowMouseEnter,
    onMouseUp,
    onCellClick,
    isCellSelected,
    clearSelection,
  }
}
