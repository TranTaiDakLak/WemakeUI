import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const appName = ref('WemakeUI')
  const appVersion = ref('0.1.0')

  /* ── Sidebar ─────────────────────────── */
  const sidebarCollapsed = ref(false)
  const sidebarWidth = computed(() => (sidebarCollapsed.value ? 64 : 240))

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /* ── Optional user (set by host app) ── */
  const user = ref<{ name: string; email: string; avatar?: string } | null>(null)

  function setUser(value: typeof user.value) {
    user.value = value
  }

  return {
    appName,
    appVersion,
    sidebarCollapsed,
    sidebarWidth,
    toggleSidebar,
    user,
    setUser,
  }
})
