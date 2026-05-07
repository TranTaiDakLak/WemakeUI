import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string; email: string; role: string } | null>({
    name: 'Nguyễn Admin',
    email: 'admin@wemakeui.vn',
    role: 'admin',
  })

  const isLoggedIn = computed(() => !!user.value)

  function login(email: string, _password: string) {
    user.value = { name: 'Nguyễn Admin', email, role: 'admin' }
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
