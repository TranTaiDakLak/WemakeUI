<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import wemakeLogo from '../../assets/wemake-logo.png'

const route = useRoute()
const router = useRouter()
const app = useAppStore()

/* WeFacebook navLeftMenu tabs — exactly matching C# code:
 * navLeftMenu.Nodes.Add("Facebook");   → icon 61570
 * navLeftMenu.Nodes.Add("Thiết bị");   → icon 157429
 * navLeftMenu.Nodes.Add("Youtube");    → icon 61802
 * + Zalo, Instagram (commented out in original, now enabled for WeConnect)
 */
const menuItems = [
  { key: 'facebook', label: 'Facebook', icon: 'facebook', path: '/app/facebook', disabled: false },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', path: '/app/instagram', disabled: false },
  { key: 'youtube', label: 'YouTube', icon: 'youtube', path: '/app/youtube', disabled: false },
  { key: 'zalo', label: 'Zalo', icon: 'zalo', path: '/app/zalo', disabled: false },
  { key: 'devices', label: 'Thiết bị', icon: 'devices', path: '/app/devices', disabled: false },
]

const activeKey = computed(() => {
  const p = route.path
  const found = menuItems.find((m) => p.startsWith(m.path))
  return found?.key ?? 'facebook'
})

function navigate(item: (typeof menuItems)[0]) {
  if (item.disabled) return
  router.push(item.path)
}
</script>

<template>
  <aside
    class="sidebar no-select"
    :class="{ 'sidebar--collapsed': app.sidebarCollapsed }"
  >
    <!-- Brand Header — matches WeFacebook left header -->
    <div class="sidebar-brand" @click="router.push('/app/facebook')">
      <img :src="wemakeLogo" alt="Wemake" class="sidebar-logo" />
      <transition name="fade-text">
        <span v-if="!app.sidebarCollapsed" class="sidebar-brand-text">WeConnect</span>
      </transition>
    </div>

    <!-- Menu — style matched to WeFacebook navLeftMenu -->
    <nav class="sidebar-nav">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="sidebar-item"
        :class="{ 'sidebar-item--active': activeKey === item.key, 'sidebar-item--disabled': item.disabled }"
        :title="item.disabled ? 'Đang phát triển' : (app.sidebarCollapsed ? item.label : '')"
        @click="navigate(item)"
      >
        <!-- Platform SVG icons -->
        <!-- Facebook -->
        <svg v-if="item.icon === 'facebook'" class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <!-- Instagram -->
        <svg v-else-if="item.icon === 'instagram'" class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        <!-- YouTube -->
        <svg v-else-if="item.icon === 'youtube'" class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <!-- Zalo -->
        <svg v-else-if="item.icon === 'zalo'" class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.193 14.963H9.932l-.006-.006 3.838-5.025H10.5a.5.5 0 010-1h4.2l.006.006-3.837 5.025h3.324a.5.5 0 010 1z"/>
        </svg>
        <!-- Devices -->
        <svg v-else-if="item.icon === 'devices'" class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
        <transition name="fade-text">
          <span v-if="!app.sidebarCollapsed" class="sidebar-label">
            {{ item.label }}
            <span v-if="item.disabled" class="sidebar-badge">Dev</span>
          </span>
        </transition>
      </button>
    </nav>

    <!-- Bottom: Collapse toggle -->
    <div class="sidebar-footer">
      <button
        class="sidebar-item sidebar-toggle"
        @click="app.toggleSidebar"
        :title="app.sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'"
      >
        <svg class="sidebar-icon" :class="{ 'icon-flip': app.sidebarCollapsed }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
        </svg>
        <transition name="fade-text">
          <span v-if="!app.sidebarCollapsed" class="sidebar-label">Thu gọn</span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* ─── Sidebar — WX UI System Design ──────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100vh;
  background: var(--wx-surface-base);
  border-right: 1px solid var(--wx-border-default);
  display: flex;
  flex-direction: column;
  transition: width var(--wx-duration-normal) var(--wx-easing-default),
              min-width var(--wx-duration-normal) var(--wx-easing-default),
              background var(--wx-duration-normal) var(--wx-easing-default);
  overflow: hidden;
  z-index: var(--wx-z-sticky);
  box-shadow: var(--wx-shadow-sm);
}

.sidebar--collapsed {
  width: 64px;
  min-width: 64px;
}

/* Brand Header */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  cursor: pointer;
  height: 64px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--wx-border-subtle);
  transition: background var(--wx-duration-fast);
}

.sidebar-brand:hover {
  background: var(--wx-hover-bg);
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: var(--wx-radius-md);
}

.sidebar-brand-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--wx-text-primary);
  white-space: nowrap;
  letter-spacing: 0.3px;
  background: var(--wx-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-sm);
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: none;
  border-radius: var(--wx-radius-md);
  background: transparent;
  color: var(--wx-text-secondary);
  font-family: var(--wx-font-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--wx-duration-fast) var(--wx-easing-default);
  white-space: nowrap;
  text-align: left;
  width: 100%;
  min-height: 42px;
}

.sidebar-item:hover {
  background: var(--wx-hover-bg);
  color: var(--wx-text-primary);
}

/* Active: gradient accent */
.sidebar-item--active {
  background: var(--wx-selected-bg);
  color: var(--wx-brand-primary);
  font-weight: 600;
}

.sidebar-item--active .sidebar-icon {
  color: var(--wx-brand-primary);
}

.sidebar-icon {
  flex-shrink: 0;
  color: var(--wx-text-muted);
  transition: color var(--wx-duration-fast);
}

.sidebar-item:hover .sidebar-icon {
  color: var(--wx-text-primary);
}

.sidebar-label {
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Disabled / In-development items */
.sidebar-item--disabled {
  opacity: 0.45;
  cursor: default;
}
.sidebar-item--disabled:hover {
  background: transparent;
  color: var(--wx-text-secondary);
}
.sidebar-item--disabled:hover .sidebar-icon {
  color: var(--wx-text-muted);
}
.sidebar-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--wx-warning-bg);
  color: var(--wx-warning-text);
  padding: 1px 6px;
  border-radius: var(--wx-radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Footer */
.sidebar-footer {
  padding: var(--space-sm);
  border-top: 1px solid var(--wx-border-subtle);
  flex-shrink: 0;
}

.sidebar-toggle {
  color: var(--wx-text-muted);
}

.sidebar-toggle:hover {
  color: var(--wx-text-primary);
}

.icon-flip {
  transform: rotate(180deg);
}

/* Text fade transition */
.fade-text-enter-active { transition: opacity 0.2s ease 0.1s; }
.fade-text-leave-active { transition: opacity 0.1s ease; }
.fade-text-enter-from,
.fade-text-leave-to { opacity: 0; }
</style>
