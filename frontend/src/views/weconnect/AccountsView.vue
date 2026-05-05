<script setup lang="ts">
import { ref, computed } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar, BaseInput } from '../../components/common'

const search = ref('')

const ACCOUNTS = [
  { id: 1, name: '@batcong.vn', display: 'Bất Cống - Nhà hàng', type: 'WhatsApp Business', status: 'connected', sessions: 18, lastActive: '2 phút trước' },
  { id: 2, name: '@startup.xyz', display: 'Startup XYZ Support', type: 'WhatsApp', status: 'connected', sessions: 45, lastActive: '5 phút trước' },
  { id: 3, name: '@corp.abc', display: 'ABC Corp CSKH', type: 'WhatsApp Business', status: 'disconnected', sessions: 0, lastActive: '2 ngày trước' },
  { id: 4, name: '@boutique.vn', display: 'Boutique Hà Nội', type: 'WhatsApp', status: 'connected', sessions: 7, lastActive: '1 giờ trước' },
  { id: 5, name: '@tech.def', display: 'DEF Technology', type: 'WhatsApp Business', status: 'qr_pending', sessions: 0, lastActive: 'Chưa kết nối' },
]

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'neutral' | 'warning' }> = {
  connected:    { label: 'Đã kết nối', variant: 'success' },
  disconnected: { label: 'Ngắt kết nối', variant: 'neutral' },
  qr_pending:   { label: 'Chờ QR', variant: 'warning' },
}

const filtered = computed(() =>
  ACCOUNTS.filter(a => !search.value || a.name.includes(search.value) || a.display.toLowerCase().includes(search.value.toLowerCase()))
)
</script>

<template>
  <WeConnectLayout current="accounts" page-title="Quản lý tài khoản" page-description="Kết nối và quản lý các tài khoản WhatsApp">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Kết nối tài khoản</BaseButton>
    </template>

    <div class="toolbar">
      <BaseInput v-model="search" placeholder="Tìm tài khoản..." size="sm" clearable style="max-width: 300px;" />
      <BaseBadge :text="`${ACCOUNTS.filter(a => a.status === 'connected').length} đang kết nối`" variant="success" />
    </div>

    <div class="account-table-wrap">
      <table class="account-table">
        <thead>
          <tr><th>Tài khoản</th><th>Loại</th><th>Trạng thái</th><th>Phiên</th><th>Hoạt động</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="acc in filtered" :key="acc.id">
            <td>
              <div class="acc-cell">
                <BaseAvatar :name="acc.display" size="sm" />
                <div>
                  <span class="acc-name">{{ acc.display }}</span>
                  <span class="acc-id">{{ acc.name }}</span>
                </div>
              </div>
            </td>
            <td><BaseBadge :text="acc.type" variant="neutral" size="sm" /></td>
            <td><BaseBadge :text="STATUS_MAP[acc.status].label" :variant="STATUS_MAP[acc.status].variant" dot /></td>
            <td class="sessions">{{ acc.sessions }}</td>
            <td class="last-active">{{ acc.lastActive }}</td>
            <td>
              <div class="row-actions">
                <BaseButton size="sm" variant="ghost">Chi tiết</BaseButton>
                <BaseButton v-if="acc.status === 'connected'" size="sm" variant="danger">Ngắt kết nối</BaseButton>
                <BaseButton v-else-if="acc.status === 'qr_pending'" size="sm" variant="primary">Quét QR</BaseButton>
                <BaseButton v-else size="sm" variant="primary">Kết nối lại</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </WeConnectLayout>
</template>

<style scoped>
.toolbar { display: flex; align-items: center; gap: var(--wx-space-4); flex-wrap: wrap; }
.account-table-wrap { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.account-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-14); }
.account-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.account-table td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.account-table tbody tr:last-child td { border-bottom: none; }
.account-table tbody tr:hover td { background: var(--wx-hover-bg); }
.acc-cell { display: flex; align-items: center; gap: var(--wx-space-3); }
.acc-name { display: block; font-weight: var(--wx-fw-medium); font-size: var(--wx-fs-14); }
.acc-id { display: block; font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.sessions { font-weight: var(--wx-fw-semibold); }
.last-active { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.row-actions { display: flex; gap: var(--wx-space-2); }
</style>
