/**
 * ═══════════════════════════════════════════════════════════════
 *  WX UI SYSTEM — Theme Composable
 *
 *  Usage:
 *    const { isDark, theme, toggleTheme, setTheme } = useTheme()
 * ═══════════════════════════════════════════════════════════════
 */
import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'wx-theme'
const theme = ref<Theme>('system')
const isDark = ref(false)

function getSystemPreference(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function applyTheme(dark: boolean) {
  isDark.value = dark
  const root = document.documentElement
  if (dark) {
    root.classList.add('wx-dark')
    root.setAttribute('data-wx-theme', 'dark')
  } else {
    root.classList.remove('wx-dark')
    root.setAttribute('data-wx-theme', 'light')
  }
}

function resolveTheme(t: Theme): boolean {
  if (t === 'dark') return true
  if (t === 'light') return false
  return getSystemPreference()
}

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
    applyTheme(resolveTheme(t))
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      theme.value = stored
    }
    applyTheme(resolveTheme(theme.value))

    // Listen for system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', (e) => {
      if (theme.value === 'system') {
        applyTheme(e.matches)
      }
    })
  })

  return { theme, isDark, setTheme, toggleTheme }
}
