<script setup lang="ts">
import { ref, computed } from 'vue'
import WeConnectLayout from '../_layouts/WeConnectLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar, BaseInput, BaseTag } from '../../components/common'

const search = ref('')
const CONTACTS = [
  { id: 1, name: 'Nguyễn Văn Minh', phone: '+84912345678', tags: ['VIP', 'Hà Nội'], lastMsg: '10 phút trước', status: 'active' },
  { id: 2, name: 'Lê Thị Lan', phone: '+84987654321', tags: ['new'], lastMsg: '1 giờ trước', status: 'active' },
  { id: 3, name: 'Trần Đức Anh', phone: '+84901234567', tags: ['blocked'], lastMsg: '3 ngày trước', status: 'blocked' },
  { id: 4, name: 'Phạm Thị Hoa', phone: '+84956789012', tags: ['VIP', 'TP.HCM'], lastMsg: '30 phút trước', status: 'active' },
  { id: 5, name: 'Hoàng Văn Nam', phone: '+84923456789', tags: ['pending'], lastMsg: '2 giờ trước', status: 'pending' },
]
const filtered = computed(() => CONTACTS.filter(c => !search.value || c.name.toLowerCase().includes(search.value.toLowerCase()) || c.phone.includes(search.value)))
const STATUS_MAP: Record<string, 'success' | 'danger' | 'warning'> = { active: 'success', blocked: 'danger', pending: 'warning' }
</script>
<template>
  <WeConnectLayout current="contacts" page-title="Danh bạ liên hệ" page-description="Quản lý danh bạ và phân nhóm khách hàng">
    <template #actions>
      <BaseButton size="sm" variant="ghost">Nhập CSV</BaseButton>
      <BaseButton size="sm" variant="primary">+ Thêm liên hệ</BaseButton>
    </template>
    <div class="toolbar">
      <BaseInput v-model="search" placeholder="Tìm tên hoặc số điện thoại..." size="sm" clearable style="max-width: 300px;" />
      <BaseBadge :text="`${filtered.length} liên hệ`" variant="neutral" />
    </div>
    <div class="contacts-table-wrap">
      <table class="contacts-table">
        <thead><tr><th>Liên hệ</th><th>Số điện thoại</th><th>Nhãn</th><th>Trạng thái</th><th>Tin cuối</th><th></th></tr></thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td><div class="contact-cell"><BaseAvatar :name="c.name" size="sm" /><span class="contact-name">{{ c.name }}</span></div></td>
            <td><code class="phone">{{ c.phone }}</code></td>
            <td><div class="tags-cell"><BaseTag v-for="t in c.tags" :key="t" :text="t" size="sm" variant="neutral" /></div></td>
            <td><BaseBadge :text="c.status" :variant="STATUS_MAP[c.status] || 'neutral'" dot /></td>
            <td class="last-msg">{{ c.lastMsg }}</td>
            <td><div class="row-actions"><BaseButton size="sm" variant="ghost">Nhắn tin</BaseButton><BaseButton size="sm" variant="ghost">Sửa</BaseButton></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </WeConnectLayout>
</template>
<style scoped>
.toolbar { display: flex; align-items: center; gap: var(--wx-space-4); }
.contacts-table-wrap { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.contacts-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-14); }
.contacts-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.contacts-table td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.contacts-table tbody tr:last-child td { border-bottom: none; }
.contacts-table tbody tr:hover td { background: var(--wx-hover-bg); }
.contact-cell { display: flex; align-items: center; gap: var(--wx-space-3); }
.contact-name { font-weight: var(--wx-fw-medium); }
.phone { font-family: var(--wx-font-mono); font-size: var(--wx-fs-12); }
.tags-cell { display: flex; gap: var(--wx-space-1); flex-wrap: wrap; }
.last-msg { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.row-actions { display: flex; gap: var(--wx-space-2); }
</style>
