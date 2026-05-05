/**
 * Composable for clipboard operations.
 * Cross-platform: works in browsers, mobile WebViews, and desktop
 * shells (Wails / Tauri / Electron) including non-HTTPS contexts,
 * with fallback to textarea + execCommand.
 */
export function useClipboard() {
  /**
   * Copy text to clipboard.
   * Returns true if successful.
   */
  function copyToClipboard(text: string): boolean {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
        return true
      }
      // Fallback: textarea + execCommand (for non-HTTPS / desktop WebView)
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }

  /**
   * Copy selected cells from a data array.
   * Groups by row, sorts by column order, tab-separated.
   */
  function copyCells(
    cells: { row: number; col: string }[],
    rows: Record<string, unknown>[],
    columnOrder: readonly string[],
  ): boolean {
    if (!cells.length) return false

    const byRow = new Map<number, string[]>()
    for (const c of cells) {
      if (!byRow.has(c.row)) byRow.set(c.row, [])
      byRow.get(c.row)!.push(c.col)
    }

    const sortedRows = [...byRow.entries()].sort((a, b) => a[0] - b[0])
    const lines = sortedRows.map(([rowIdx, cols]) => {
      const sortedCols = cols.sort(
        (a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b),
      )
      return sortedCols
        .map((col) => {
          const row = rows[rowIdx]
          const val = row?.[col]
          return val !== undefined && val !== null ? String(val) : ''
        })
        .join('\t')
    })

    return copyToClipboard(lines.join('\n'))
  }

  /**
   * Copy a specific field from an array of objects, newline-separated.
   */
  function copyField(items: Record<string, unknown>[], field: string): boolean {
    const text = items.map((item) => String(item[field] ?? '')).join('\n')
    return copyToClipboard(text)
  }

  return {
    copyToClipboard,
    copyCells,
    copyField,
  }
}
