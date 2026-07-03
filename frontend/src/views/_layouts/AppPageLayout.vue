<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppShell, AppSidebar, AppTopbar, PageHeader } from '../../components/layout'
import type { SidebarSection } from '../../components/layout'
import { BaseBadge, BaseAvatar, BaseTag } from '../../components/common'

const props = withDefaults(defineProps<{
  section: 'app' | 'dashboards' | 'wemakeui'
  current: string
  pageTitle: string
  pageDescription?: string
}>(), { pageDescription: '' })

const route = useRoute()
const collapsed = ref(false)

// ── Icons ───────────────────────────────────────────────────────────────
const I: Record<string, string> = {
  user:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  mail:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  chat:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  file:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  cal:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  invoice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  book:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  key:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  log:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  map:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  learn:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  org:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="6" height="14"/><rect x="9" y="3" width="6" height="18"/><rect x="16" y="10" width="6" height="11"/></svg>`,
  bell:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  search:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  cart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  pricing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  faq:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  home:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chart:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  users:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  layers:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  money:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  saas:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  truck:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  help:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  iot:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 12a9 9 0 0 1 18 0"/><path d="M7 12a5 5 0 0 1 10 0"/></svg>`,
  campaign:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  contacts:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  session: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  plugin:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
  console: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  clock:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  link:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  canvas:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><line x1="7" y1="5" x2="10" y2="12"/><line x1="17" y1="5" x2="14" y2="12"/><line x1="7" y1="19" x2="10" y2="12"/><line x1="17" y1="19" x2="14" y2="12"/></svg>`,
}

// ── Sidebar nav data ────────────────────────────────────────────────────
const SECTIONS: Record<string, SidebarSection[]> = {
  app: [
    { label: 'Tài khoản', items: [
      { id: 'profile',       label: 'Hồ sơ',          icon: I.user,     href: '#/app/profile' },
      { id: 'notifications', label: 'Thông báo',       icon: I.bell,     href: '#/app/notifications', badge: 4 },
      { id: 'settings',      label: 'Cài đặt',         icon: I.settings, href: '#/app/settings' },
      { id: 'organization',  label: 'Tổ chức',         icon: I.org,      href: '#/app/organization' },
    ]},
    { label: 'Giao tiếp', items: [
      { id: 'mailbox', label: 'Hộp thư',  icon: I.mail, href: '#/app/mailbox', badge: 12 },
      { id: 'chat',    label: 'Nhắn tin', icon: I.chat, href: '#/app/chat',    badge: 3 },
    ]},
    { label: 'Công việc', items: [
      { id: 'invoice',  label: 'Hoá đơn',     icon: I.invoice, href: '#/app/invoices' },
      { id: 'calendar', label: 'Lịch',         icon: I.cal,     href: '#/app/calendar' },
      { id: 'files',    label: 'Tệp quản lý',  icon: I.file,    href: '#/app/files' },
    ]},
    { label: 'Khám phá', items: [
      { id: 'search',  label: 'Tìm kiếm',     icon: I.search,  href: '#/app/search' },
      { id: 'product', label: 'Sản phẩm',     icon: I.cart,    href: '#/app/product' },
      { id: 'order',   label: 'Đơn hàng',     icon: I.log,     href: '#/app/order' },
      { id: 'pricing', label: 'Gói dịch vụ',  icon: I.pricing, href: '#/app/pricing' },
      { id: 'faq',     label: 'FAQ / Hỗ trợ', icon: I.faq,     href: '#/app/faq' },
    ]},
    { label: 'Tài nguyên', items: [
      { id: 'wiki',      label: 'Wiki / Docs', icon: I.book,  href: '#/app/wiki' },
      { id: 'learning',  label: 'Học tập',     icon: I.learn, href: '#/app/learning' },
      { id: 'map',       label: 'Bản đồ',      icon: I.map,   href: '#/app/map' },
      { id: 'api-keys',  label: 'API key',     icon: I.key,   href: '#/app/api-keys' },
      { id: 'audit-log', label: 'Audit log',   icon: I.log,   href: '#/app/audit-log' },
    ]},
  ],
  dashboards: [
    { label: 'Dashboards', items: [
      { id: 'overview',  label: 'Tổng quan',       icon: I.home,   href: '#/dashboard/overview' },
      { id: 'analytics', label: 'Phân tích',        icon: I.chart,  href: '#/dashboard/analytics' },
      { id: 'ecommerce', label: 'Bán hàng',         icon: I.cart,   href: '#/dashboard/ecommerce', badge: 12 },
      { id: 'crm',       label: 'CRM',              icon: I.users,  href: '#/dashboard/crm' },
      { id: 'project',   label: 'Dự án',            icon: I.layers, href: '#/dashboard/project' },
    ]},
    { label: 'Tài chính & vận hành', items: [
      { id: 'finance',   label: 'Tài chính',        icon: I.money, href: '#/dashboard/finance' },
      { id: 'saas',      label: 'SaaS / billing',   icon: I.saas,  href: '#/dashboard/saas' },
      { id: 'logistics', label: 'Vận chuyển',       icon: I.truck, href: '#/dashboard/logistics' },
    ]},
    { label: 'Hỗ trợ & monitoring', items: [
      { id: 'helpdesk', label: 'Helpdesk',     icon: I.help, href: '#/dashboard/helpdesk', badge: 5 },
      { id: 'iot',      label: 'IoT realtime', icon: I.iot,  href: '#/dashboard/iot' },
    ]},
  ],
  wemakeui: [
    { label: 'WemakeUI', items: [
      { id: 'admin',        label: 'Tổng quan',     icon: I.home,     href: '#/wemakeui' },
      { id: 'accounts',     label: 'Tài khoản',     icon: I.users,    href: '#/wemakeui/accounts' },
      { id: 'campaigns',    label: 'Chiến dịch',    icon: I.campaign, href: '#/wemakeui/campaigns', badge: 2 },
      { id: 'contacts',     label: 'Danh bạ',       icon: I.contacts, href: '#/wemakeui/contacts' },
      { id: 'sessions',     label: 'Phiên kết nối', icon: I.session,  href: '#/wemakeui/sessions', badge: 8 },
    ]},
    { label: 'Hệ thống', items: [
      { id: 'plugins',      label: 'Plugin',            icon: I.plugin,  href: '#/wemakeui/plugins' },
      { id: 'console',      label: 'Console / Log',     icon: I.console, href: '#/wemakeui/console' },
      { id: 'scheduler',    label: 'Lịch tác vụ',      icon: I.clock,   href: '#/wemakeui/scheduler' },
      { id: 'integrations', label: 'Tích hợp',          icon: I.link,    href: '#/wemakeui/integrations' },
      { id: 'automation',   label: 'Automation canvas', icon: I.canvas,  href: '#/wemakeui/automation' },
    ]},
  ],
}

// ── Per-section config ──────────────────────────────────────────────────
const CFG = {
  app:        { brand: 'WemakeUI',  subtitlePrefix: 'app',       breadcrumb: 'app',        tagVariant: 'primary' as const, defaultId: 'profile'  },
  dashboards: { brand: 'WemakeUI',  subtitlePrefix: 'dashboard', breadcrumb: 'dashboards', tagVariant: 'primary' as const, defaultId: 'overview' },
  wemakeui:  { brand: 'WemakeUI', subtitlePrefix: '',           breadcrumb: 'wemakeui',  tagVariant: 'info'    as const, defaultId: 'admin'    },
}

const cfg = computed(() => CFG[props.section])

const topbarSubtitle = computed(() =>
  cfg.value.subtitlePrefix ? `${cfg.value.subtitlePrefix} · ${props.current}` : props.current
)

const activeId = computed(() => {
  const last = route.path.split('/').filter(Boolean).pop() || ''
  if (!last || last === 'wemakeui') return cfg.value.defaultId
  return last
})
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar :title="cfg.brand" :subtitle="topbarSubtitle">
        <template #actions>
          <button class="topbar-icon" aria-label="Tìm kiếm">
            <span v-html="I.search" />
          </button>
          <button class="topbar-icon" aria-label="Thông báo">
            <span v-html="I.bell" />
            <BaseBadge text="3" variant="danger" size="sm" solid class="topbar-icon__badge" />
          </button>
          <BaseAvatar name="Admin" size="sm" />
        </template>
      </AppTopbar>
    </template>

    <template #sidebar>
      <AppSidebar
        :sections="SECTIONS[section]"
        :active-id="activeId"
        :collapsed="collapsed"
        :brand="cfg.brand"
        logo-src="/logo.png"
        @update:collapsed="(v: boolean) => collapsed = v"
      />
    </template>

    <PageHeader :title="pageTitle" :description="pageDescription" padded>
      <template #breadcrumb>
        <RouterLink to="/" class="bc-link">trang chủ</RouterLink>
        <span class="bc-sep">/</span>
        <span>{{ cfg.breadcrumb }}</span>
        <span class="bc-sep">/</span>
        <strong>{{ current }}</strong>
        <BaseTag size="sm" :variant="cfg.tagVariant" label="demo" />
      </template>
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </PageHeader>

    <div class="page-content">
      <slot />
    </div>
  </AppShell>
</template>

<style scoped>
.topbar-icon {
  position: relative;
  width: 32px; height: 32px;
  border: none; background: transparent;
  color: #fff;
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.topbar-icon :deep(svg) { width: 16px; height: 16px; }
.topbar-icon:hover { background: rgba(255,255,255,0.18); color: #fff; }
.topbar-icon__badge { position: absolute; top: -4px; right: -4px; pointer-events: none; }
.bc-link { font-size: var(--wx-fs-12); color: var(--wx-content-link); text-decoration: none; }
.bc-link:hover { text-decoration: underline; }
.bc-sep { color: var(--wx-content-muted); }
.page-content {
  padding: 0 var(--wx-space-5) var(--wx-space-9);
  display: flex; flex-direction: column; gap: var(--wx-space-5);
}
</style>
