<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { AppShell, AppSidebar, AppTopbar, PageHeader } from '../../components/layout'
import type { SidebarSection } from '../../components/layout'
import { BaseButton, BaseBadge, BaseAvatar, BaseTag } from '../../components/common'

const props = withDefaults(defineProps<{
  current: string
  pageTitle: string
  pageDescription?: string
}>(), {
  pageDescription: '',
})

const route = useRoute()
const collapsed = ref(false)

const ICON = {
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
}

const sections: SidebarSection[] = [
  {
    label: 'Tài khoản',
    items: [
      { id: 'profile',       label: 'Hồ sơ',          icon: ICON.user,     href: '#/app/profile' },
      { id: 'notifications', label: 'Thông báo',       icon: ICON.bell,     href: '#/app/notifications', badge: 4 },
      { id: 'settings',      label: 'Cài đặt',         icon: ICON.settings, href: '#/app/settings' },
      { id: 'organization',  label: 'Tổ chức',         icon: ICON.org,      href: '#/app/organization' },
    ],
  },
  {
    label: 'Giao tiếp',
    items: [
      { id: 'mailbox', label: 'Hộp thư',  icon: ICON.mail, href: '#/app/mailbox', badge: 12 },
      { id: 'chat',    label: 'Nhắn tin', icon: ICON.chat, href: '#/app/chat',    badge: 3 },
    ],
  },
  {
    label: 'Công việc',
    items: [
      { id: 'invoice',  label: 'Hoá đơn',   icon: ICON.invoice, href: '#/app/invoice' },
      { id: 'calendar', label: 'Lịch',      icon: ICON.cal,     href: '#/app/calendar' },
      { id: 'files',    label: 'Tệp quản lý', icon: ICON.file,  href: '#/app/files' },
    ],
  },
  {
    label: 'Khám phá',
    items: [
      { id: 'search',  label: 'Tìm kiếm',    icon: ICON.search,  href: '#/app/search' },
      { id: 'product', label: 'Sản phẩm',    icon: ICON.cart,    href: '#/app/product' },
      { id: 'order',   label: 'Đơn hàng',    icon: ICON.log,     href: '#/app/order' },
      { id: 'pricing', label: 'Gói dịch vụ', icon: ICON.pricing, href: '#/app/pricing' },
      { id: 'faq',     label: 'FAQ / Hỗ trợ', icon: ICON.faq,   href: '#/app/faq' },
    ],
  },
  {
    label: 'Tài nguyên',
    items: [
      { id: 'wiki',     label: 'Wiki / Docs',  icon: ICON.book,  href: '#/app/wiki' },
      { id: 'learning', label: 'Học tập',      icon: ICON.learn, href: '#/app/learning' },
      { id: 'map',      label: 'Bản đồ',       icon: ICON.map,   href: '#/app/map' },
      { id: 'api-keys', label: 'API key',      icon: ICON.key,   href: '#/app/api-keys' },
      { id: 'audit-log',label: 'Audit log',    icon: ICON.log,   href: '#/app/audit-log' },
    ],
  },
]

const activeId = computed(() => route.path.split('/').pop() || 'profile')
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar title="WemakeUI" :subtitle="`app · ${props.current}`">
        <template #actions>
          <button class="topbar-icon" aria-label="Tìm kiếm">
            <span v-html="ICON.search" />
          </button>
          <button class="topbar-icon" aria-label="Thông báo">
            <span v-html="ICON.bell" />
            <BaseBadge text="4" variant="danger" size="sm" class="topbar-icon__badge" />
          </button>
          <BaseAvatar name="Nguyễn Văn A" size="sm" />
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

    <PageHeader :title="pageTitle" :description="pageDescription" padded>
      <template #breadcrumb>
        <RouterLink to="/" class="bc-link">sitemap</RouterLink>
        <span class="bc-sep">/</span>
        <span>app</span>
        <span class="bc-sep">/</span>
        <strong>{{ current }}</strong>
        <BaseTag size="sm" variant="primary" text="demo" />
      </template>
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </PageHeader>

    <div class="app-content">
      <slot />
    </div>
  </AppShell>
</template>

<style scoped>
.topbar-icon {
  position: relative;
  width: 32px; height: 32px;
  border: none; background: transparent;
  color: rgba(255,255,255,0.85);
  border-radius: var(--wx-radius-full);
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.topbar-icon :deep(svg) { width: 16px; height: 16px; }
.topbar-icon:hover { background: rgba(255,255,255,0.12); color: white; }
.topbar-icon__badge { position: absolute; top: -2px; right: -2px; }
.bc-link { font-size: var(--wx-fs-12); color: var(--wx-content-link); text-decoration: none; }
.bc-link:hover { text-decoration: underline; }
.bc-sep { color: var(--wx-content-muted); }
.app-content {
  padding: 0 var(--wx-space-5) var(--wx-space-9);
  display: flex; flex-direction: column; gap: var(--wx-space-5);
}
</style>
