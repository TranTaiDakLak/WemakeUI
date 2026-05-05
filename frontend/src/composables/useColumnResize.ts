import { reactive, onBeforeUnmount } from 'vue'

export interface ColumnResizeOptions {
  minWidth?: number
}

export function useColumnResize(options: ColumnResizeOptions = {}) {
  const { minWidth = 40 } = options

  const columnWidths = reactive<Record<string, number>>({})

  let activeResize: {
    key: string
    startX: number
    startWidth: number
  } | null = null

  function initWidth(key: string, defaultWidth: number) {
    if (!columnWidths[key]) {
      columnWidths[key] = defaultWidth
    }
  }

  function getWidth(key: string): number | undefined {
    return columnWidths[key]
  }

  function onResizeStart(key: string, event: MouseEvent, currentWidth: number) {
    event.preventDefault()
    event.stopPropagation()
    columnWidths[key] = currentWidth
    activeResize = { key, startX: event.clientX, startWidth: currentWidth }
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function onResizeMove(e: MouseEvent) {
    if (!activeResize) return
    const diff = e.clientX - activeResize.startX
    const newWidth = Math.max(minWidth, activeResize.startWidth + diff)
    columnWidths[activeResize.key] = newWidth
  }

  function onResizeEnd() {
    activeResize = null
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  const isResizing = () => activeResize !== null

  onBeforeUnmount(() => {
    if (activeResize) onResizeEnd()
  })

  return {
    columnWidths,
    initWidth,
    getWidth,
    onResizeStart,
    isResizing,
  }
}
