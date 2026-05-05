import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface ContextMenuState {
  show: boolean
  x: number
  y: number
}

/**
 * Composable for right-click context menu logic.
 * Handles show/hide, viewport-aware positioning, submenu toggle, and click-outside.
 */
export function useContextMenu() {
  const menu = ref<ContextMenuState>({ show: false, x: 0, y: 0 })
  const openSubId = ref('')

  const subOpenLeft = computed(() => menu.value.x + 440 > window.innerWidth)

  function show(e: MouseEvent, menuW = 220, menuH = 600) {
    e.preventDefault()
    openSubId.value = ''
    let x = e.clientX
    let y = e.clientY
    if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 8
    if (y + menuH > window.innerHeight) y = Math.max(8, window.innerHeight - menuH - 8)
    menu.value = { show: true, x, y }
  }

  function hide() {
    menu.value.show = false
    openSubId.value = ''
  }

  function toggleSub(id: string) {
    openSubId.value = openSubId.value === id ? '' : id
  }

  function onClickOutside() {
    if (menu.value.show) hide()
  }

  onMounted(() => {
    document.addEventListener('click', onClickOutside)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
  })

  return {
    menu,
    openSubId,
    subOpenLeft,
    show,
    hide,
    toggleSub,
  }
}
