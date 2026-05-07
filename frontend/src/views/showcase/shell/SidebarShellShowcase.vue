<script setup lang="ts">
/**
 * Phase 3 — sidebar shell demo.
 * 3-cột option: sidebar chính + sub-sidebar (ẩn được) + main.
 */
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  AppShell, AppSidebar, AppTopbar, PageHeader,
} from '../../../components/layout'
import type { SidebarSection } from '../../../components/layout'
import {
  BaseCard, BasePanel, BaseButton, BaseInput, BaseSelectMenu,
  BaseBadge, BaseTag, FormField, BaseToggle, BaseTextarea,
} from '../../../components/common'

const sidebarCollapsed = ref(false)
const showSubSidebar = ref(true)
const activeId = ref('overview')

/* ── icons (SVG inline) ── */
const ICON = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
}

const sections: SidebarSection[] = [
  {
    label: 'Tổng quan',
    items: [
      { id: 'overview',  label: 'Tổng quan',  icon: ICON.home },
      { id: 'analytics', label: 'Phân tích',  icon: ICON.chart, badge: 'mới' },
      { id: 'reports',   label: 'Báo cáo',    icon: ICON.file },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      {
        id: 'customers',
        label: 'Khách hàng',
        icon: ICON.users,
        badge: 12,
        children: [
          { id: 'customers-all',     label: 'Danh sách' },
          { id: 'customers-active',  label: 'Đang hoạt động' },
          { id: 'customers-pending', label: 'Chờ duyệt', badge: 3 },
        ],
      },
      {
        id: 'orders',
        label: 'Đơn hàng',
        icon: ICON.cart,
        children: [
          { id: 'orders-new',     label: 'Đơn mới' },
          { id: 'orders-shipped', label: 'Đã giao' },
          { id: 'orders-return',  label: 'Đổi trả' },
        ],
      },
      { id: 'inbox', label: 'Hộp thư', icon: ICON.inbox, badge: 5 },
      { id: 'campaigns', label: 'Chiến dịch', icon: ICON.layers, disabled: true },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { id: 'notifications', label: 'Thông báo', icon: ICON.bell },
      { id: 'settings',      label: 'Cài đặt',   icon: ICON.settings, shortcut: 'g s' },
      { id: 'help',          label: 'Trợ giúp',  icon: ICON.help, href: '#/help' },
    ],
  },
]

/* ── form state cho main demo ── */
const form = ref({
  name: 'Nguyễn Văn A',
  email: 'a@wemake.vn',
  plan: 'pro',
  newsletter: true,
  bio: '',
})
const planOpts = [
  { value: 'free', label: 'Miễn phí' },
  { value: 'pro',  label: 'Pro' },
  { value: 'team', label: 'Doanh nghiệp' },
]

const activeLabel = computed(() => {
  for (const sec of sections) {
    for (const item of sec.items) {
      if (item.id === activeId.value) return item.label
      const child = item.children?.find((c) => c.id === activeId.value)
      if (child) return `${item.label} / ${child.label}`
    }
  }
  return 'Tổng quan'
})

function onSelect(item: { id: string }) {
  activeId.value = item.id
}
</script>

<template>
  <AppShell variant="sidebar" :topbar-height="56">
    <template #topbar>
      <AppTopbar title="WemakeUI" subtitle="sidebar shell demo">
        <template #actions>
        </template>
      </AppTopbar>
    </template>

    <template #sidebar>
      <AppSidebar
        :sections="sections"
        :active-id="activeId"
        :collapsed="sidebarCollapsed"
        brand="WemakeUI"
        @update:collapsed="(v: boolean) => sidebarCollapsed = v"
        @select="onSelect"
      />
    </template>

    <template v-if="showSubSidebar" #sub-sidebar>
      <div class="sub-sidebar">
        <header class="sub-sidebar__head">
          <h4 class="sub-sidebar__title">Bộ lọc nhanh</h4>
          <BaseTag size="sm" variant="primary">{{ activeLabel }}</BaseTag>
        </header>
        <BasePanel title="Tìm kiếm" tone="subtle" :padded="false">
          <BaseInput v-model="form.name" placeholder="Tìm theo tên…" size="sm" />
        </BasePanel>
        <BasePanel title="Trạng thái" tone="subtle" :padded="false">
          <ul class="filter-list">
            <li v-for="(s, i) in [
              { label: 'Tất cả', count: 124 },
              { label: 'Hoạt động', count: 86 },
              { label: 'Chờ duyệt', count: 12 },
              { label: 'Tạm dừng', count: 26 },
            ]" :key="i" class="filter-list__item">
              <span>{{ s.label }}</span>
              <BaseBadge :text="String(s.count)" size="sm" variant="neutral" />
            </li>
          </ul>
        </BasePanel>
        <BasePanel title="Thẻ" tone="subtle" :padded="false">
          <div class="tag-cloud">
            <BaseTag v-for="t in ['vip', 'doanh nghiệp', 'cá nhân', 'thử nghiệm', 'huỷ']" :key="t" size="sm" :text="t" />
          </div>
        </BasePanel>
      </div>
    </template>

    <PageHeader
      title="Sidebar shell"
      :description="`Đang xem: ${activeLabel}. Sidebar collapsible (mặc định 240px → 64px). Sub-sidebar có thể tắt qua toggle bên phải.`"
      padded
      back
      @back="() => $router.push('/')"
    >
      <template #actions>
        <BaseToggle v-model="showSubSidebar" />
        <span class="muted">Sub-sidebar</span>
        <BaseButton variant="ghost" size="sm" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar' }}
        </BaseButton>
      </template>
    </PageHeader>

    <div class="content">
      <div class="kpi-row">
        <BaseCard
          v-for="(kpi, i) in [
            { label: 'Doanh thu', value: '128 triệu', delta: '+12%', tone: 'success' },
            { label: 'Đơn hàng', value: '1,284', delta: '+5%', tone: 'success' },
            { label: 'Khách mới', value: '342', delta: '-2%', tone: 'danger' },
            { label: 'CSAT', value: '4.6/5', delta: '+0.2', tone: 'success' },
          ]"
          :key="i"
          padded
          shadow="sm"
          radius="lg"
        >
          <div class="kpi">
            <span class="kpi-label">{{ kpi.label }}</span>
            <span class="kpi-value">{{ kpi.value }}</span>
            <BaseTag size="sm" :variant="(kpi.tone as 'success' | 'danger')" :text="kpi.delta" />
          </div>
        </BaseCard>
      </div>

      <div class="cols">
        <BaseCard title="Hồ sơ tài khoản" subtitle="Cập nhật thông tin cá nhân của bạn">
          <template #actions>
            <BaseButton variant="ghost" size="sm">Huỷ</BaseButton>
            <BaseButton size="sm">Lưu thay đổi</BaseButton>
          </template>

          <FormField label="Họ và tên" required>
            <BaseInput v-model="form.name" />
          </FormField>

          <FormField label="Email" hint="Dùng để đăng nhập và nhận thông báo." required>
            <BaseInput v-model="form.email" type="email" />
          </FormField>

          <FormField label="Gói dịch vụ">
            <BaseSelectMenu v-model="form.plan" :options="planOpts" />
          </FormField>

          <FormField
            label="Giới thiệu"
            show-optional
            hint="Tối đa 280 ký tự."
          >
            <BaseTextarea v-model="form.bio" :rows="3" />
          </FormField>

          <FormField label="Nhận bản tin" label-placement="left">
            <BaseToggle v-model="form.newsletter" />
          </FormField>
        </BaseCard>

        <BasePanel
          title="Hoạt động gần đây"
          description="20 sự kiện cuối"
          collapsible
        >
          <ul class="activity">
            <li v-for="(a, i) in [
              { who: 'Nguyễn Văn A', what: 'đã tạo đơn hàng #1284', when: '2 phút trước' },
              { who: 'Trần Thị B',   what: 'cập nhật hồ sơ',        when: '15 phút trước' },
              { who: 'Lê Văn C',     what: 'hoàn tất thanh toán',    when: '1 giờ trước' },
              { who: 'Phạm Thị D',   what: 'gửi yêu cầu hỗ trợ',     when: '3 giờ trước' },
              { who: 'Hoàng Văn E',  what: 'đăng ký gói pro',        when: 'hôm qua' },
            ]" :key="i" class="activity__item">
              <span class="activity__avatar">{{ a.who.charAt(0) }}</span>
              <div class="activity__text">
                <div><strong>{{ a.who }}</strong> {{ a.what }}</div>
                <div class="muted small">{{ a.when }}</div>
              </div>
            </li>
          </ul>
        </BasePanel>
      </div>
    </div>
  </AppShell>
</template>

<style scoped>

.sub-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-4);
  height: 100%;
}
.sub-sidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--wx-space-2);
}
.sub-sidebar__title {
  margin: 0;
  font-size: var(--wx-fs-14);
  font-weight: var(--wx-fw-semibold);
}
.filter-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.filter-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--wx-space-2) var(--wx-space-3);
  font-size: var(--wx-fs-13);
  border-radius: var(--wx-radius-md);
  cursor: pointer;
  transition: background var(--wx-d-fast) var(--wx-ease-standard);
}
.filter-list__item:hover { background: var(--wx-surface-sunken); }
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--wx-space-1);
  padding: var(--wx-space-2) var(--wx-space-3);
}

.content {
  padding: 0 var(--wx-space-5) var(--wx-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--wx-space-3);
}
.kpi {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-1);
}
.kpi-label { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.kpi-value {
  font-size: var(--wx-fs-24);
  font-weight: var(--wx-fw-semibold);
  letter-spacing: var(--wx-tracking-tight);
}

.cols {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: var(--wx-space-4);
  align-items: start;
}
@media (max-width: 960px) {
  .cols { grid-template-columns: 1fr; }
}

.activity {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
}
.activity__item {
  display: flex;
  gap: var(--wx-space-2);
  align-items: flex-start;
  font-size: var(--wx-fs-13);
}
.activity__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-gradient-button);
  color: white;
  font-weight: var(--wx-fw-semibold);
  font-size: var(--wx-fs-12);
  flex-shrink: 0;
}
.activity__text { line-height: var(--wx-lh-snug); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }
</style>
