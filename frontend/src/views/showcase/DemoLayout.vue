<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { AppShell, AppSidebar } from '../../components/layout'
import type { SidebarSection, SidebarItem } from '../../components/layout'
import { AnchorBar } from '../../components/common'
import { phases } from './_phases-data'

const route    = useRoute()
const activeId = computed(() => route.path)

/* ── AnchorBar: lấy anchors của route hiện tại ── */
const currentAnchors = computed(() =>
  phases.flatMap(p => p.routes).find(r => r.path === route.path)?.anchors ?? []
)
const anchorActive = ref('')

/* ── Helper: convert phases → SidebarItem[] (leaf nodes) ── */
function phaseItems(nums: number[]): SidebarItem[] {
  return phases
    .filter(p => nums.includes(p.n))
    .flatMap(p => p.routes)
    .map(r => ({
      id:    r.path,
      label: r.navLabel ?? r.label.split(' — ')[0],
      href:  '#' + r.path,
    }))
}

/* ── Helper: create collapsible group item ── */
function group(id: string, label: string, nums: number[]): SidebarItem {
  return { id, label, children: phaseItems(nums) }
}

const ICON_HOME = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
const ICON_GRID = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
const ICON_BOX  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
const ICON_DATA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
const ICON_PAT  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
const ICON_CODE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
const ICON_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
const ICON_WARN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
const ICON_DASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`
const ICON_APP  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/></svg>`
const ICON_LAND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
const ICON_WC   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`

const SECTIONS: SidebarSection[] = [
  /* ── Top ── */
  {
    items: [
      { id: '/', label: 'Sitemap', icon: ICON_HOME, href: '#/' },
    ],
  },
  /* ── Demo Apps — entry points, mỗi app có sidebar riêng ── */
  {
    label: 'Demo Apps',
    items: [
      { id: '/home',               label: 'Trang chủ',      icon: ICON_HOME, href: '#/home' },
      { id: '/saas/dashboard',     label: 'SaaS Dashboard', icon: ICON_DASH, href: '#/saas/dashboard' },
      { id: '/dashboard/overview', label: 'Dashboards',     icon: ICON_DASH, href: '#/dashboard/overview' },
      { id: '/app/profile',        label: 'App Pages',      icon: ICON_APP,  href: '#/app/profile' },
      { id: '/weconnect',          label: 'WeConnect',      icon: ICON_WC,   href: '#/weconnect' },
    ],
  },
  /* ── Component library ── */
  {
    label: 'Library',
    items: [
      { ...group('grp-foundations', 'Foundations',   [0]),        icon: ICON_GRID },
      { ...group('grp-components',  'Components',    [1, 2, 3]),  icon: ICON_BOX  },
      { ...group('grp-data',        'Data & Charts', [4, 4.5]),   icon: ICON_DATA },
      { ...group('grp-patterns',    'Patterns',      [5, 9, 9.5]),icon: ICON_PAT  },
      { ...group('grp-developer',   'Developer',     [8]),        icon: ICON_CODE },
    ],
  },
  /* ── Standalone pages (Auth/Error/Landing không có sidebar riêng) ── */
  {
    label: 'Pages',
    items: [
      { ...group('grp-auth',    'Auth',          [6.1]), icon: ICON_LOCK },
      { ...group('grp-errors',  'Error Pages',   [6.2]), icon: ICON_WARN },
      { ...group('grp-landing', 'Landing Pages', [7.2]), icon: ICON_LAND },
    ],
  },
]
</script>

<template>
  <AppShell variant="sidebar">
    <template #sidebar>
      <AppSidebar
        :sections="SECTIONS"
        :active-id="activeId"
        brand="WemakeUI"
        :logo-gradient="true"
        collapse-position="header"
      />

    </template>

    <div class="demo-content">
      <AnchorBar
        v-if="currentAnchors.length"
        v-model="anchorActive"
        :sections="currentAnchors"
        :sticky-top="56"
        class="demo-anchor"
      />
      <RouterView />
    </div>
  </AppShell>
</template>

<style scoped>
.demo-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.demo-anchor {
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
  z-index: 9;
}
</style>
