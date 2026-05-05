import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(dark: boolean) {
    isDark.value = dark
  }

  // Sync with DOM + localStorage — uses WX theme class system
  watch(isDark, (dark) => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('wx-dark')
      root.setAttribute('data-wx-theme', 'dark')
    } else {
      root.classList.remove('wx-dark')
      root.setAttribute('data-wx-theme', 'light')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, toggleTheme, setTheme }
})
