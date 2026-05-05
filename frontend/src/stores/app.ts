import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const appName = ref('WeConnect')
  const appVersion = ref('1.0.0')

  /* ── Sidebar ─────────────────────────── */
  const sidebarCollapsed = ref(false)
  const sidebarWidth = computed(() => (sidebarCollapsed.value ? 64 : 240))

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /* ── Mock user ───────────────────────── */
  const user = ref({
    name: 'Hoàng Phong',
    email: 'hoangphong@wemake.vn',
    avatar: '',
  })

  return {
    appName,
    appVersion,
    sidebarCollapsed,
    sidebarWidth,
    toggleSidebar,
    user,
  }
})
