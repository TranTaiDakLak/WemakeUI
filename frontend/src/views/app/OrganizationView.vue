<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar, BaseAvatarGroup, BaseCard, BaseTabs } from '../../components/common'

const tab = ref('thanh-vien')
const tabs = [
  { key: 'thanh-vien', label: 'Thành viên' },
  { key: 'nhom', label: 'Nhóm' },
  { key: 'cai-dat', label: 'Cài đặt tổ chức' },
]

const MEMBERS = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'owner', status: 'active', joined: '2025-01-15', avatar: 'NA' },
  { id: 2, name: 'Lê Thị B', email: 'lethib@example.com', role: 'admin', status: 'active', joined: '2025-02-01', avatar: 'LB' },
  { id: 3, name: 'Trần Văn C', email: 'tranvanc@example.com', role: 'member', status: 'active', joined: '2025-03-10', avatar: 'TC' },
  { id: 4, name: 'Nguyễn Thị D', email: 'nguyenthid@example.com', role: 'member', status: 'active', joined: '2025-04-05', avatar: 'ND' },
  { id: 5, name: 'Phạm Văn E', email: 'phamvane@example.com', role: 'viewer', status: 'invited', joined: '2026-05-01', avatar: 'PE' },
]

const ROLE_MAP: Record<string, { label: string; variant: 'danger' | 'primary' | 'neutral' | 'success' }> = {
  owner:  { label: 'Owner',  variant: 'danger' },
  admin:  { label: 'Admin',  variant: 'primary' },
  member: { label: 'Member', variant: 'success' },
  viewer: { label: 'Viewer', variant: 'neutral' },
}

const TEAMS = [
  { id: 1, name: 'Frontend', desc: 'Phát triển giao diện người dùng', members: 3, avatars: [{name:'NA'},{name:'LB'},{name:'TC'}] },
  { id: 2, name: 'Backend', desc: 'API và cơ sở dữ liệu', members: 2, avatars: [{name:'TC'},{name:'ND'}] },
  { id: 3, name: 'Design', desc: 'UI/UX và thiết kế sản phẩm', members: 2, avatars: [{name:'LB'},{name:'PE'}] },
]
</script>

<template>
  <AppPageLayout section="app" current="tổ chức" page-title="Tổ chức" page-description="Quản lý thành viên, nhóm và cài đặt tổ chức">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Mời thành viên</BaseButton>
    </template>

    <BaseTabs v-model="tab" :tabs="tabs" />

    <!-- Thành viên -->
    <div v-if="tab === 'thanh-vien'" class="member-table-wrap">
      <table class="member-table">
        <thead>
          <tr><th>Thành viên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Tham gia</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in MEMBERS" :key="m.id">
            <td>
              <div class="member-cell">
                <BaseAvatar :name="m.avatar" size="sm" />
                <span class="member-name">{{ m.name }}</span>
              </div>
            </td>
            <td class="email">{{ m.email }}</td>
            <td><BaseBadge :text="ROLE_MAP[m.role].label" :variant="ROLE_MAP[m.role].variant" /></td>
            <td><BaseBadge :text="m.status === 'active' ? 'hoạt động' : 'đã mời'" :variant="m.status === 'active' ? 'success' : 'neutral'" dot /></td>
            <td class="date">{{ m.joined }}</td>
            <td>
              <div class="row-actions">
                <BaseButton size="sm" variant="ghost">Đổi vai trò</BaseButton>
                <BaseButton v-if="m.role !== 'owner'" size="sm" variant="ghost">Xoá</BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Nhóm -->
    <div v-if="tab === 'nhom'" class="teams-grid">
      <BaseCard v-for="team in TEAMS" :key="team.id">
        <template #header>
          <div class="team-head">
            <span class="team-name">{{ team.name }}</span>
            <BaseBadge :text="`${team.members} thành viên`" variant="neutral" size="sm" />
          </div>
        </template>
        <template #body>
          <p class="team-desc">{{ team.desc }}</p>
          <BaseAvatarGroup :items="team.avatars" size="sm" :max="5" />
        </template>
        <template #footer>
          <BaseButton size="sm" variant="ghost" block>Quản lý nhóm</BaseButton>
        </template>
      </BaseCard>
      <BaseCard class="add-team-card">
        <template #body>
          <div class="add-team-body">
            <span class="add-icon">+</span>
            <span>Tạo nhóm mới</span>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- Cài đặt -->
    <div v-if="tab === 'cai-dat'" class="org-settings">
      <BaseCard>
        <template #header><span class="card-label">Thông tin tổ chức</span></template>
        <template #body>
          <div class="settings-form">
            <div class="form-row"><label class="form-label">Tên tổ chức</label><input class="form-input" value="WemakeUI Corp" /></div>
            <div class="form-row"><label class="form-label">Slug</label><input class="form-input" value="wemakeui" /></div>
            <div class="form-row"><label class="form-label">Website</label><input class="form-input" value="https://wemakeui.vn" /></div>
            <BaseButton variant="primary" size="sm">Lưu thay đổi</BaseButton>
          </div>
        </template>
      </BaseCard>
      <BaseCard class="danger-zone">
        <template #header><span class="card-label danger">Vùng nguy hiểm</span></template>
        <template #body>
          <div class="danger-row">
            <div>
              <p class="danger-title">Xoá tổ chức</p>
              <p class="danger-desc">Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xoá vĩnh viễn.</p>
            </div>
            <BaseButton variant="danger" size="sm">Xoá tổ chức</BaseButton>
          </div>
        </template>
      </BaseCard>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.member-table-wrap { background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.member-table { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-14); }
.member-table th { padding: var(--wx-space-3) var(--wx-space-4); text-align: left; font-size: var(--wx-fs-12); font-weight: var(--wx-fw-semibold); color: var(--wx-content-muted); background: var(--wx-bg-sunken); border-bottom: 1px solid var(--wx-border-default); }
.member-table td { padding: var(--wx-space-3) var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.member-table tbody tr:last-child td { border-bottom: none; }
.member-table tbody tr:hover td { background: var(--wx-hover-bg); }
.member-cell { display: flex; align-items: center; gap: var(--wx-space-3); }
.member-name { font-weight: var(--wx-fw-medium); }
.email { font-size: var(--wx-fs-13); color: var(--wx-content-muted); }
.date { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.row-actions { display: flex; gap: var(--wx-space-2); }

.teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--wx-space-4); }
.team-head { display: flex; align-items: center; justify-content: space-between; }
.team-name { font-size: var(--wx-fs-16); font-weight: var(--wx-fw-semibold); }
.team-desc { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: 0 0 var(--wx-space-3); }
.add-team-card { cursor: pointer; border-style: dashed; }
.add-team-body { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-2); padding: var(--wx-space-6) 0; color: var(--wx-content-muted); font-size: var(--wx-fs-14); }
.add-icon { font-size: 32px; font-weight: 300; }

.org-settings { display: flex; flex-direction: column; gap: var(--wx-space-4); max-width: 640px; }
.card-label { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); }
.card-label.danger { color: var(--wx-status-danger-text); }
.settings-form { display: flex; flex-direction: column; gap: var(--wx-space-4); }
.form-row { display: flex; flex-direction: column; gap: var(--wx-space-1); }
.form-label { font-size: var(--wx-fs-13); font-weight: var(--wx-fw-medium); color: var(--wx-content-secondary); }
.form-input { padding: var(--wx-space-2) var(--wx-space-3); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-md); background: var(--wx-bg-base); color: var(--wx-content-primary); font-size: var(--wx-fs-14); }
.danger-zone { border-color: var(--wx-status-danger-border); }
.danger-row { display: flex; align-items: center; justify-content: space-between; gap: var(--wx-space-4); }
.danger-title { font-size: var(--wx-fs-14); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-1); }
.danger-desc { font-size: var(--wx-fs-13); color: var(--wx-content-muted); margin: 0; }
</style>
