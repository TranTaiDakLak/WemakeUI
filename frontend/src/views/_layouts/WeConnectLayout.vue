<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppShell, AppSidebar, AppTopbar, PageHeader } from '../../components/layout'
import type { SidebarSection } from '../../components/layout'
import { BaseBadge, BaseAvatar, BaseTag } from '../../components/common'

const props = withDefaults(defineProps<{
  current: string
  pageTitle: string
  pageDescription?: string
}>(), { pageDescription: '' })

const route = useRoute()
const collapsed = ref(false)

const ICON = {
  home:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  users:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  campaign:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  contacts:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  session: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  plugin:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
  console: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  clock:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  link:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  canvas:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><line x1="7" y1="5" x2="10" y2="12"/><line x1="17" y1="5" x2="14" y2="12"/><line x1="7" y1="19" x2="10" y2="12"/><line x1="17" y1="19" x2="14" y2="12"/></svg>`,
  bell:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  search:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
}

const sections: SidebarSection[] = [
  {
    label: 'WeConnect',
    items: [
      { id: 'admin',        label: 'Tổng quan',      icon: ICON.home,     href: '#/weconnect/admin' },
      { id: 'accounts',     label: 'Tài khoản',      icon: ICON.users,    href: '#/weconnect/accounts' },
      { id: 'campaigns',    label: 'Chiến dịch',     icon: ICON.campaign, href: '#/weconnect/campaigns', badge: 2 },
      { id: 'contacts',     label: 'Danh bạ',        icon: ICON.contacts, href: '#/weconnect/contacts' },
      { id: 'sessions',     label: 'Phiên kết nối',  icon: ICON.session,  href: '#/weconnect/sessions', badge: 8 },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { id: 'plugins',      label: 'Plugin',         icon: ICON.plugin,   href: '#/weconnect/plugins' },
      { id: 'console',      label: 'Console / Log',  icon: ICON.console,  href: '#/weconnect/console' },
      { id: 'scheduler',    label: 'Lịch tác vụ',   icon: ICON.clock,    href: '#/weconnect/scheduler' },
      { id: 'integrations', label: 'Tích hợp',       icon: ICON.link,     href: '#/weconnect/integrations' },
      { id: 'canvas',       label: 'Automation canvas', icon: ICON.canvas, href: '#/weconnect/canvas' },
    ],
  },
]

const activeId = computed(() => route.path.split('/').pop() || 'admin')
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar title="WeConnect" :subtitle="props.current">
        <template #actions>
          <button class="topbar-icon" aria-label="Tìm kiếm"><span v-html="ICON.search" /></button>
          <button class="topbar-icon" aria-label="Thông báo">
            <span v-html="ICON.bell" />
            <BaseBadge text="5" variant="danger" size="sm" class="topbar-icon__badge" />
          </button>
          <BaseAvatar name="Admin" size="sm" />
        </template>
      </AppTopbar>
    </template>

    <template #sidebar>
      <AppSidebar
        :sections="sections" :active-id="activeId" :collapsed="collapsed"
        brand="WeConnect"
        @update:collapsed="(v: boolean) => collapsed = v"
      />
    </template>

    <PageHeader :title="pageTitle" :description="pageDescription" padded>
      <template #breadcrumb>
        <RouterLink to="/" class="bc-link">sitemap</RouterLink>
        <span class="bc-sep">/</span>
        <span>weconnect</span>
        <span class="bc-sep">/</span>
        <strong>{{ current }}</strong>
        <BaseTag size="sm" variant="info" text="demo" />
      </template>
      <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    </PageHeader>

    <div class="wc-content"><slot /></div>
  </AppShell>
</template>

<style scoped>
.topbar-icon {
  position: relative; width: 32px; height: 32px; border: none; background: transparent;
  color: rgba(255,255,255,0.85); border-radius: var(--wx-radius-full); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.topbar-icon :deep(svg) { width: 16px; height: 16px; }
.topbar-icon:hover { background: rgba(255,255,255,0.12); color: white; }
.topbar-icon__badge { position: absolute; top: -2px; right: -2px; }
.bc-link { font-size: var(--wx-fs-12); color: var(--wx-content-link); text-decoration: none; }
.bc-link:hover { text-decoration: underline; }
.bc-sep { color: var(--wx-content-muted); }
.wc-content { padding: 0 var(--wx-space-5) var(--wx-space-9); display: flex; flex-direction: column; gap: var(--wx-space-5); }
</style>
