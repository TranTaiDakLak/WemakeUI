<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../stores/app'
import { useThemeStore } from '../../stores/theme'

const route = useRoute()
const app = useAppStore()
const themeStore = useThemeStore()

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  facebook: { title: 'Facebook', subtitle: 'Quản lý tài khoản Facebook' },
  instagram: { title: 'Instagram', subtitle: 'Quản lý tài khoản Instagram' },
  youtube: { title: 'YouTube', subtitle: 'Quản lý tài khoản YouTube' },
  zalo: { title: 'Zalo', subtitle: 'Quản lý tài khoản Zalo' },
}

const currentPage = computed(() => {
  const segments = route.path.split('/')
  const last = segments[segments.length - 1] || 'facebook'
  return pageTitles[last] ?? { title: 'WeConnect', subtitle: '' }
})

const showUserMenu = ref(false)

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu() {
  showUserMenu.value = false
}
</script>

<template>
  <!-- WeFacebook-style: blue topbar acting as title bar (pnRightTopMenu) -->
  <header class="topbar no-select wails-drag">
    <!-- Left: page title -->
    <div class="topbar-left">
      <h1 class="topbar-title">{{ currentPage.title }}</h1>
      <span class="topbar-subtitle" v-if="currentPage.subtitle">{{ currentPage.subtitle }}</span>
    </div>

    <!-- Right: actions -->
    <div class="topbar-right">
      <!-- Search -->
      <div class="topbar-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Tìm kiếm..." class="topbar-search-input" disabled />
      </div>

      <!-- Notification -->
      <button class="topbar-icon-btn" title="Thông báo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span class="notification-dot"></span>
      </button>

      <!-- Dark mode toggle -->
      <button class="topbar-icon-btn" @click="themeStore.toggleTheme()" :title="themeStore.isDark ? 'Chế độ sáng' : 'Chế độ tối'">
        <svg v-if="themeStore.isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>

      <!-- User dropdown -->
      <div class="topbar-user" @click="toggleUserMenu" v-click-outside="closeUserMenu">
        <div class="user-avatar">
          {{ app.user.name.charAt(0) }}
        </div>
        <span class="user-name">{{ app.user.name }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-header">
              <div class="user-avatar user-avatar--lg">{{ app.user.name.charAt(0) }}</div>
              <div>
                <div class="dropdown-name">{{ app.user.name }}</div>
                <div class="dropdown-email">{{ app.user.email }}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Hồ sơ
            </button>
            <button class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              Cài đặt
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item--danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
/* v-click-outside directive */
export default {
  directives: {
    'click-outside': {
      mounted(el: HTMLElement, binding: { value: () => void }) {
        (el as any).__clickOutside = (e: Event) => {
          if (!el.contains(e.target as Node)) binding.value()
        }
        document.addEventListener('click', (el as any).__clickOutside)
      },
      unmounted(el: HTMLElement) {
        document.removeEventListener('click', (el as any).__clickOutside)
      },
    },
  },
}
</script>

<style scoped>
/* ─── Topbar — WX Gradient Header ────────────────────────── */
.topbar {
  height: var(--wx-density-header-height, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-md);
  background: var(--wx-gradient-header);
  flex-shrink: 0;
  z-index: var(--wx-z-dropdown);
  transition: background var(--wx-duration-normal) var(--wx-easing-default);
}

.topbar-left {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}

.topbar-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--wx-text-inverse);
  letter-spacing: 0.3px;
}

.topbar-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* Search — glass style on gradient bg */
.topbar-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--wx-glass-light-bg);
  backdrop-filter: blur(var(--wx-glass-light-blur));
  border: 1px solid var(--wx-border-glass-light);
  border-radius: var(--wx-radius-full);
  color: rgba(255, 255, 255, 0.7);
  transition: background var(--wx-duration-fast), padding var(--wx-duration-fast);
}

.topbar-search:hover {
  background: var(--wx-glass-medium-bg);
}

.topbar-search-input {
  background: none;
  border: none;
  outline: none;
  color: var(--wx-text-inverse);
  font-family: var(--wx-font-primary);
  font-size: 12px;
  width: 120px;
}

.topbar-search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Icon button — glass on gradient */
.topbar-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--wx-radius-full);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: all var(--wx-duration-fast) var(--wx-easing-default);
}

.topbar-icon-btn:hover {
  background: var(--wx-glass-light-bg);
  color: var(--wx-text-inverse);
  transform: scale(1.05);
}

.topbar-icon-btn:active {
  transform: scale(0.95);
}

.notification-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-danger-solid);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}

/* User — glass pill on gradient */
.topbar-user {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  transition: background var(--wx-duration-fast);
  color: rgba(255, 255, 255, 0.85);
}

.topbar-user:hover {
  background: var(--wx-glass-light-bg);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-glass-medium-bg);
  border: 1px solid var(--wx-border-glass-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--wx-text-inverse);
  flex-shrink: 0;
}

.user-avatar--lg {
  width: 40px;
  height: 40px;
  font-size: 16px;
  background: var(--wx-gradient-button);
  border: none;
  color: var(--wx-text-inverse);
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--wx-text-inverse);
}

/* Dropdown — WX surface card */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: var(--wx-surface-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-xl);
  box-shadow: var(--wx-shadow-xl);
  padding: var(--space-sm);
  z-index: var(--wx-z-header);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
}

.dropdown-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--wx-text-primary);
}

.dropdown-email {
  font-size: 12px;
  color: var(--wx-text-muted);
}

.dropdown-divider {
  height: 1px;
  background: var(--wx-border-subtle);
  margin: var(--space-xs) 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--wx-duration-fast) var(--wx-easing-default);
  text-align: left;
}

.dropdown-item:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

.dropdown-item--danger {
  color: var(--wx-danger-text);
}

.dropdown-item--danger:hover {
  background: var(--wx-danger-bg);
  color: var(--wx-danger-text);
}

/* Dropdown transition */
.dropdown-enter-active { transition: opacity var(--wx-duration-fast) var(--wx-easing-default), transform var(--wx-duration-fast) var(--wx-easing-default); }
.dropdown-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
