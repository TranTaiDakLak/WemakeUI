<script setup lang="ts">
/**
 * DashboardLayout — shared sidebar + topbar shell cho 10 dashboard.
 * Phase 6 — dashboard templates.
 *
 * sử dụng AppShell variant="sidebar" + AppSidebar có sẵn từ phase 3.
 */
import { ref, computed, useSlots } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppShell, AppSidebar, AppTopbar, PageHeader } from '../../components/layout'
import type { SidebarSection } from '../../components/layout'
import { BaseButton, BaseBadge, BaseAvatar, BaseTag } from '../../components/common'

const props = withDefaults(defineProps<{
  /** tên dashboard hiện tại (cho topbar subtitle) */
  current: string
  /** title hiển thị ở PageHeader */
  pageTitle: string
  /** mô tả PageHeader */
  pageDescription?: string
}>(), {
  pageDescription: '',
})

const slots = useSlots()
const route = useRoute()
const collapsed = ref(false)

const ICON = {
  home:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  cart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  layers:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  money: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  saas:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  help:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  iot:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 12a9 9 0 0 1 18 0"/><path d="M7 12a5 5 0 0 1 10 0"/></svg>`,
  bell:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
}

const sections: SidebarSection[] = [
  {
    label: 'Dashboards',
    items: [
      { id: 'overview',  label: 'Tổng quan',   icon: ICON.home,   href: '#/dashboard/overview' },
      { id: 'analytics', label: 'Phân tích',   icon: ICON.chart,  href: '#/dashboard/analytics' },
      { id: 'ecommerce', label: 'Bán hàng',    icon: ICON.cart,   href: '#/dashboard/ecommerce', badge: 12 },
      { id: 'crm',       label: 'CRM',         icon: ICON.users,  href: '#/dashboard/crm' },
      { id: 'project',   label: 'Dự án',       icon: ICON.layers, href: '#/dashboard/project' },
    ],
  },
  {
    label: 'Tài chính & vận hành',
    items: [
      { id: 'finance',   label: 'Tài chính',   icon: ICON.money,  href: '#/dashboard/finance' },
      { id: 'saas',      label: 'SaaS / billing', icon: ICON.saas, href: '#/dashboard/saas' },
      { id: 'logistics', label: 'Vận chuyển',  icon: ICON.truck,  href: '#/dashboard/logistics' },
    ],
  },
  {
    label: 'Hỗ trợ & monitoring',
    items: [
      { id: 'helpdesk',  label: 'Helpdesk',    icon: ICON.help,   href: '#/dashboard/helpdesk', badge: 5 },
      { id: 'iot',       label: 'IoT realtime',icon: ICON.iot,    href: '#/dashboard/iot' },
    ],
  },
]

const activeId = computed(() => {
  const path = route.path
  const seg = path.split('/').pop() || 'overview'
  return seg
})
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar title="WemakeUI" :subtitle="`dashboard · ${props.current}`">
        <template #actions>
          <button class="topbar-icon" :title="'Tìm kiếm'" aria-label="Tìm kiếm">
            <span v-html="ICON.search" />
          </button>
          <button class="topbar-icon" title="Thông báo" aria-label="Thông báo">
            <span v-html="ICON.bell" />
            <BaseBadge text="3" variant="danger" size="sm" class="topbar-icon__badge" />
          </button>
          <BaseAvatar name="Lê Văn A" size="sm" />
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
      <template #breadcrumb>
        <RouterLink to="/" class="bc-link">sitemap</RouterLink>
        <span class="bc-sep">/</span>
        <span>dashboards</span>
        <span class="bc-sep">/</span>
        <strong>{{ current }}</strong>
        <BaseTag size="sm" variant="primary" text="demo" />
      </template>
    </PageHeader>

    <div class="dash-content">
      <slot />
    </div>
  </AppShell>
</template>

<style scoped>
.topbar-icon {
  position: relative;
  width: 32px; height: 32px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.85);
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.topbar-icon :deep(svg) { width: 16px; height: 16px; }
.topbar-icon:hover { background: rgba(255,255,255,0.12); color: white; }
.topbar-icon__badge {
  position: absolute;
  top: -2px; right: -2px;
}

.bc-link {
  font-size: var(--wx-fs-12);
  color: var(--wx-content-link);
  text-decoration: none;
}
.bc-link:hover { text-decoration: underline; }
.bc-sep { color: var(--wx-content-muted); }
.dash-content {
  padding: 0 var(--wx-space-5) var(--wx-space-9);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}
</style>
