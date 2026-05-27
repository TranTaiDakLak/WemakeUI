<script setup lang="ts">
import { ref, computed, useSlots, type Slots } from 'vue'
import { AppShell, AppSidebar, AppTopbar, PageHeader } from '../../components/layout'
import type { SidebarSection } from '../../components/layout'
import UserDropdown from '../../components/common/UserDropdown.vue'
import NotificationCenter from '../../components/common/NotificationCenter.vue'

const props = withDefaults(defineProps<{
  current: string
  pageTitle: string
  pageDescription?: string
}>(), {
  pageDescription: '',
})

const slots: Slots = useSlots()
const collapsed = ref(false)
const mobileNavOpen = ref(false)

function openMobileNav() { mobileNavOpen.value = true }
function closeMobileNav() { mobileNavOpen.value = false }

const ICON = {
  home:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  users:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  box:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
  receipt:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/></svg>`,
  git:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>`,
  chart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  bell:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  search:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  close:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  menu:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
}

const sections: SidebarSection[] = [
  {
    label: 'Tổng quan',
    items: [
      { id: 'dashboard',    label: 'Dashboard',    icon: ICON.home,     href: '#/saas/dashboard' },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      { id: 'members',      label: 'Thành viên',   icon: ICON.users,   href: '#/saas/members' },
      { id: 'products',     label: 'Sản phẩm',     icon: ICON.box,     href: '#/saas/products' },
      { id: 'transactions', label: 'Giao dịch',    icon: ICON.receipt, href: '#/saas/transactions' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { id: 'statistics',   label: 'Thống kê',     icon: ICON.chart,   href: '#/saas/statistics' },
      { id: 'versions',     label: 'Phiên bản',    icon: ICON.git,     href: '#/saas/versions' },
      { id: 'settings',     label: 'Cài đặt',      icon: ICON.settings, href: '#/saas/settings' },
    ],
  },
]

const allNavItems = sections.flatMap(s => s.items.map(item => ({ ...item, group: s.label })))

const activeId = computed(() => props.current)
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar title="WemakeUI" :subtitle="`saas · ${props.current}`">
        <!-- Hamburger — chỉ hiện trên mobile -->
        <template #left>
          <button class="topbar-hamburger" aria-label="Mở menu" @click="openMobileNav">
            <span v-html="ICON.menu" />
          </button>
        </template>
        <template #actions>
          <button class="topbar-icon" title="Tìm kiếm" aria-label="Tìm kiếm">
            <span v-html="ICON.search" />
          </button>
          <NotificationCenter />
          <UserDropdown />
        </template>
      </AppTopbar>
    </template>

    <template #sidebar>
      <AppSidebar
        :sections="sections"
        :active-id="activeId"
        :collapsed="collapsed"
        brand="WemakeUI"
        @update:collapsed="(v: boolean) => collapsed = v"
      />
    </template>

    <PageHeader
      :title="pageTitle"
      :description="pageDescription"
      padded
    >
      <template v-if="slots.actions" #actions>
        <slot name="actions" />
      </template>
    </PageHeader>

    <div class="saas-content">
      <slot />
    </div>

    <!-- Mobile nav overlay (Teleport — render ngoài DOM nhưng giữ trong root để Transition không warn) -->
    <Teleport to="body">
    <transition name="mob-backdrop">
      <div v-if="mobileNavOpen" class="mob-backdrop" @click="closeMobileNav" />
    </transition>
    <transition name="mob-drawer">
      <nav v-if="mobileNavOpen" class="mob-drawer" aria-label="Navigation">
        <!-- Drawer header -->
        <div class="mob-drawer__head">
          <span class="mob-drawer__brand">WemakeUI</span>
          <button class="mob-drawer__close" aria-label="Đóng menu" @click="closeMobileNav">
            <span v-html="ICON.close" />
          </button>
        </div>

        <!-- Nav sections -->
        <div class="mob-drawer__body">
          <div v-for="section in sections" :key="section.label" class="mob-nav-section">
            <p class="mob-nav-section__label">{{ section.label }}</p>
            <a
              v-for="item in section.items"
              :key="item.id"
              :href="item.href"
              class="mob-nav-item"
              :class="{ 'mob-nav-item--active': item.id === activeId }"
              @click="closeMobileNav"
            >
              <span class="mob-nav-item__icon" v-html="item.icon" />
              <span class="mob-nav-item__label">{{ item.label }}</span>
            </a>
          </div>
        </div>
      </nav>
    </transition>
    </Teleport>
  </AppShell>
</template>

<style scoped>
.topbar-icon {
  position: relative;
  width: 32px; height: 32px;
  border: none;
  background: transparent;
  color: #fff;
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.topbar-icon :deep(svg) { width: 16px; height: 16px; }
.topbar-icon:hover { background: rgba(255,255,255,0.18); color: #fff; }

/* Hamburger — ẩn trên desktop, hiện trên mobile */
.topbar-hamburger {
  display: none;
  width: 32px; height: 32px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.9);
  border-radius: var(--wx-radius-md);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-right: var(--wx-space-1);
}
.topbar-hamburger :deep(svg) { width: 18px; height: 18px; }
.topbar-hamburger:hover { background: rgba(255,255,255,0.15); }

@media (max-width: 480px) {
  .topbar-hamburger { display: inline-flex; }
}

:deep(.wx-page-header) { margin-bottom: var(--wx-space-2); }
:deep(.wx-page-header--padded) { padding-bottom: var(--wx-space-3); }

.saas-content {
  padding: 0 var(--wx-space-5) var(--wx-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}

@media (max-width: 640px) {
  .saas-content { padding: 0 var(--wx-space-3) var(--wx-space-5); gap: var(--wx-space-3); }
  :deep(.wx-page-header--padded) { padding: var(--wx-space-3); }
}

/* ── Mobile nav backdrop ── */
.mob-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  z-index: 999;
}
.mob-backdrop-enter-active { transition: opacity 0.2s ease; }
.mob-backdrop-leave-active { transition: opacity 0.18s ease; }
.mob-backdrop-enter-from, .mob-backdrop-leave-to { opacity: 0; }

/* ── Mobile nav drawer ── */
.mob-drawer {
  position: fixed;
  top: 0; left: 0;
  width: 272px;
  height: 100dvh;
  background: var(--wx-surface-base);
  box-shadow: 4px 0 24px rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mob-drawer-enter-active { transition: transform 0.22s cubic-bezier(0.4,0,0.2,1); }
.mob-drawer-leave-active { transition: transform 0.18s cubic-bezier(0.4,0,0.2,1); }
.mob-drawer-enter-from, .mob-drawer-leave-to { transform: translateX(-100%); }

.mob-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--wx-space-4);
  height: 56px;
  background: var(--wx-gradient-header);
  flex-shrink: 0;
}
.mob-drawer__brand {
  font-size: var(--wx-fs-15);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}
.mob-drawer__close {
  width: 32px; height: 32px;
  border: none;
  background: rgba(255,255,255,0.15);
  border-radius: var(--wx-radius-md);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mob-drawer__close :deep(svg) { width: 16px; height: 16px; }
.mob-drawer__close:hover { background: rgba(255,255,255,0.25); }

.mob-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--wx-space-3) var(--wx-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-4);
}

.mob-nav-section {}
.mob-nav-section__label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--wx-text-muted);
  padding: 0 var(--wx-space-2);
  margin: 0 0 var(--wx-space-2);
}

.mob-nav-item {
  display: flex;
  align-items: center;
  gap: var(--wx-space-3);
  padding: 10px var(--wx-space-3);
  border-radius: var(--wx-radius-lg);
  text-decoration: none;
  color: var(--wx-text-secondary);
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-medium);
  transition: background var(--wx-d-fast) var(--wx-ease-standard),
              color var(--wx-d-fast) var(--wx-ease-standard);
}
.mob-nav-item:hover {
  background: var(--wx-surface-hover);
  color: var(--wx-text-primary);
}
.mob-nav-item--active {
  background: color-mix(in srgb, var(--wx-brand-primary) 10%, transparent);
  color: var(--wx-brand-primary);
  font-weight: var(--wx-fw-semibold);
}
.mob-nav-item__icon {
  width: 20px; height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mob-nav-item__icon :deep(svg) { width: 18px; height: 18px; }
.mob-nav-item__label { flex: 1; }
</style>
