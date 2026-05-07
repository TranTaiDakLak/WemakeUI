<script setup lang="ts">
import { ref } from 'vue'
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar, BaseInput } from '../../components/common'

const FOLDERS = [
  { id: 'inbox',   label: 'Hộp thư đến', count: 12 },
  { id: 'sent',    label: 'Đã gửi',       count: 0 },
  { id: 'drafts',  label: 'Nháp',         count: 3 },
  { id: 'spam',    label: 'Spam',          count: 5 },
  { id: 'trash',   label: 'Thùng rác',    count: 0 },
]

const MAILS = [
  { id: 1, from: 'Lê Thị B', fromShort: 'LB', subject: 'Re: Review thiết kế phase 7', preview: 'Mình đã xem và feedback rồi, bạn check thử nhé...', time: '10:42', unread: true, starred: true },
  { id: 2, from: 'Team GitHub', fromShort: 'GH', subject: '[PR #301] FilterBuilder — merged', preview: 'Your PR was merged into main. Deployment started.', time: '09:15', unread: true, starred: false },
  { id: 3, from: 'Trần Văn C', fromShort: 'TC', subject: 'Cập nhật tiến độ sprint #18', preview: 'Sprint đang đi đúng lịch, 3 task còn lại sẽ xong trước thứ 6.', time: 'Hôm qua', unread: false, starred: false },
  { id: 4, from: 'Ngân hàng VIB', fromShort: 'VB', subject: 'Xác nhận giao dịch #8472881', preview: 'Giao dịch thành công. Số tiền: 1,500,000 VND.', time: 'Hôm qua', unread: false, starred: false },
  { id: 5, from: 'Hệ thống', fromShort: 'SY', subject: 'Cảnh báo đăng nhập từ thiết bị mới', preview: 'Phát hiện đăng nhập từ Safari iOS tại Đà Nẵng lúc 03:22.', time: 'T2', unread: false, starred: true },
]

const folder = ref('inbox')
const selected = ref<number | null>(1)
const search = ref('')

const selectedMail = computed(() => MAILS.find(m => m.id === selected.value))

import { computed } from 'vue'
</script>

<template>
  <AppPageLayout section="app" current="hộp thư" page-title="Hộp thư" page-description="Quản lý email nội bộ và thông báo">
    <template #actions>
      <BaseButton size="sm" variant="primary">+ Soạn thư</BaseButton>
    </template>

    <div class="mailbox">
      <!-- folders -->
      <aside class="folders">
        <ul class="folder-list">
          <li v-for="f in FOLDERS" :key="f.id"
            class="folder-item" :class="{ active: folder === f.id }"
            @click="folder = f.id">
            <span class="folder-label">{{ f.label }}</span>
            <BaseBadge v-if="f.count > 0" :text="String(f.count)" size="sm" :variant="f.id === 'inbox' ? 'primary' : 'neutral'" />
          </li>
        </ul>
      </aside>

      <!-- list -->
      <div class="mail-list-panel">
        <div class="mail-search">
          <BaseInput v-model="search" placeholder="Tìm trong hộp thư..." size="sm" clearable />
        </div>
        <ul class="mail-list">
          <li v-for="m in MAILS" :key="m.id"
            class="mail-item" :class="{ selected: selected === m.id, unread: m.unread }"
            @click="selected = m.id">
            <BaseAvatar :name="m.fromShort" size="sm" />
            <div class="mail-info">
              <div class="mail-row1">
                <span class="mail-from">{{ m.from }}</span>
                <span class="mail-time">{{ m.time }}</span>
              </div>
              <span class="mail-subject">{{ m.subject }}</span>
              <span class="mail-preview">{{ m.preview }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- detail -->
      <div v-if="selectedMail" class="mail-detail">
        <div class="detail-header">
          <h2 class="detail-subject">{{ selectedMail.subject }}</h2>
          <div class="detail-meta">
            <BaseAvatar :name="selectedMail.fromShort" size="sm" />
            <div>
              <span class="detail-from">{{ selectedMail.from }}</span>
              <span class="detail-time">{{ selectedMail.time }}</span>
            </div>
          </div>
        </div>
        <div class="detail-body">
          <p>{{ selectedMail.preview }}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at tincidunt neque, vel fringilla purus. Sed rhoncus nisl vel nibh gravida, at luctus metus volutpat. Nulla at est id erat tincidunt congue.</p>
          <p>Trân trọng,<br>{{ selectedMail.from }}</p>
        </div>
        <div class="detail-actions">
          <BaseButton size="sm" variant="primary">Trả lời</BaseButton>
          <BaseButton size="sm" variant="secondary">Chuyển tiếp</BaseButton>
          <BaseButton size="sm" variant="ghost">Xoá</BaseButton>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.mailbox { display: grid; grid-template-columns: 180px 300px 1fr; gap: 0; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; min-height: 600px; }

.folders { border-right: 1px solid var(--wx-border-subtle); padding: var(--wx-space-3); }
.folder-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.folder-item { display: flex; align-items: center; justify-content: space-between; padding: var(--wx-space-2) var(--wx-space-3); border-radius: var(--wx-radius-md); cursor: pointer; font-size: var(--wx-fs-14); color: var(--wx-content-secondary); transition: background var(--wx-d-micro); }
.folder-item:hover { background: var(--wx-hover-bg); color: var(--wx-content-primary); }
.folder-item.active { background: var(--wx-brand-50); color: var(--wx-brand-600); font-weight: var(--wx-fw-medium); }

.mail-list-panel { border-right: 1px solid var(--wx-border-subtle); display: flex; flex-direction: column; }
.mail-search { padding: var(--wx-space-3); border-bottom: 1px solid var(--wx-border-subtle); }
.mail-list { list-style: none; margin: 0; padding: 0; overflow-y: auto; flex: 1; }
.mail-item { display: flex; gap: var(--wx-space-3); padding: var(--wx-space-3) var(--wx-space-4); cursor: pointer; border-bottom: 1px solid var(--wx-border-subtle); transition: background var(--wx-d-micro); }
.mail-item:hover { background: var(--wx-hover-bg); }
.mail-item.selected { background: var(--wx-brand-50); }
.mail-item.unread .mail-from, .mail-item.unread .mail-subject { font-weight: var(--wx-fw-semibold); }
.mail-info { flex: 1; min-width: 0; }
.mail-row1 { display: flex; justify-content: space-between; }
.mail-from { font-size: var(--wx-fs-13); color: var(--wx-content-primary); }
.mail-time { font-size: var(--wx-fs-11); color: var(--wx-content-muted); }
.mail-subject { display: block; font-size: var(--wx-fs-13); color: var(--wx-content-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mail-preview { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.mail-detail { padding: var(--wx-space-5); overflow-y: auto; }
.detail-subject { font-size: var(--wx-fs-20); font-weight: var(--wx-fw-semibold); margin: 0 0 var(--wx-space-3); letter-spacing: var(--wx-tracking-tight); }
.detail-meta { display: flex; align-items: center; gap: var(--wx-space-3); margin-bottom: var(--wx-space-5); padding-bottom: var(--wx-space-4); border-bottom: 1px solid var(--wx-border-subtle); }
.detail-from { display: block; font-size: var(--wx-fs-14); font-weight: var(--wx-fw-medium); }
.detail-time { display: block; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.detail-body { font-size: var(--wx-fs-15); line-height: var(--wx-lh-relaxed); color: var(--wx-content-secondary); display: flex; flex-direction: column; gap: var(--wx-space-3); }
.detail-actions { display: flex; gap: var(--wx-space-2); margin-top: var(--wx-space-5); }

@media (max-width: 900px) { .mailbox { grid-template-columns: 1fr; } .mail-detail, .folders { display: none; } }
</style>
