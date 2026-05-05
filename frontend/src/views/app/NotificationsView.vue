<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '../_layouts/AppLayout.vue'
import { BaseButton, BaseBadge, BaseAvatar, BaseTabs } from '../../components/common'

const tab = ref('tat-ca')
const tabs = [
  { key: 'tat-ca', label: 'Tất cả' },
  { key: 'chua-doc', label: 'Chưa đọc' },
  { key: 'da-doc', label: 'Đã đọc' },
]

const NOTIFS = ref([
  { id: 1, type: 'mention', actor: 'Lê Thị B', text: 'đã nhắc đến bạn trong PR #301', time: '10 phút trước', read: false, avatar: 'LB' },
  { id: 2, type: 'review',  actor: 'Trần Văn C', text: 'đã duyệt PR #298 của bạn', time: '1 giờ trước', read: false, avatar: 'TC' },
  { id: 3, type: 'deploy',  actor: 'Hệ thống', text: 'Deploy staging thành công — commit a3b4c5d', time: '2 giờ trước', read: false, avatar: 'SY' },
  { id: 4, type: 'comment', actor: 'Nguyễn Thị D', text: 'đã bình luận vào task #142', time: '3 giờ trước', read: false, avatar: 'ND' },
  { id: 5, type: 'invite',  actor: 'Phạm Văn E', text: 'đã mời bạn vào dự án "WeConnect v3"', time: 'Hôm qua', read: true, avatar: 'PE' },
  { id: 6, type: 'merge',   actor: 'GitHub Actions', text: 'PR #295 đã được merge vào main', time: 'Hôm qua', read: true, avatar: 'GA' },
  { id: 7, type: 'mention', actor: 'Hoàng Thị F', text: 'đã nhắc đến bạn trong issue #312', time: '2 ngày trước', read: true, avatar: 'HF' },
])

const filtered = computed(() => {
  if (tab.value === 'chua-doc') return NOTIFS.value.filter(n => !n.read)
  if (tab.value === 'da-doc') return NOTIFS.value.filter(n => n.read)
  return NOTIFS.value
})

function markAllRead() { NOTIFS.value.forEach(n => n.read = true) }

const TYPE_ICONS: Record<string, string> = {
  mention: '💬', review: '✅', deploy: '🚀', comment: '📝', invite: '✉️', merge: '🔀',
}
</script>

<template>
  <AppLayout current="thông báo" page-title="Trung tâm thông báo" page-description="Theo dõi hoạt động và cập nhật mới nhất">
    <template #actions>
      <BaseButton size="sm" variant="ghost" @click="markAllRead">Đánh dấu tất cả đã đọc</BaseButton>
    </template>

    <BaseTabs v-model="tab" :tabs="tabs" />

    <div class="notif-list">
      <TransitionGroup name="fade-list">
        <div v-for="n in filtered" :key="n.id" class="notif-item" :class="{ unread: !n.read }">
          <div class="notif-avatar">
            <BaseAvatar :name="n.avatar" size="md" />
            <span class="notif-type-icon">{{ TYPE_ICONS[n.type] || '🔔' }}</span>
          </div>
          <div class="notif-body">
            <p class="notif-text">
              <strong>{{ n.actor }}</strong> {{ n.text }}
            </p>
            <span class="notif-time">{{ n.time }}</span>
          </div>
          <div class="notif-actions">
            <button v-if="!n.read" class="mark-btn" title="Đánh dấu đã đọc" @click="n.read = true">●</button>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="filtered.length === 0" class="empty-state">
        <span class="empty-icon">🎉</span>
        <p class="empty-text">Không có thông báo {{ tab === 'chua-doc' ? 'chưa đọc' : '' }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.notif-list { display: flex; flex-direction: column; gap: 2px; background: var(--wx-bg-base); border: 1px solid var(--wx-border-default); border-radius: var(--wx-radius-lg); overflow: hidden; }
.notif-item { display: flex; align-items: flex-start; gap: var(--wx-space-4); padding: var(--wx-space-4) var(--wx-space-5); border-bottom: 1px solid var(--wx-border-subtle); transition: background var(--wx-d-micro); }
.notif-item:last-child { border-bottom: none; }
.notif-item.unread { background: color-mix(in srgb, var(--wx-brand-50) 50%, transparent); }
.notif-item:hover { background: var(--wx-hover-bg); }

.notif-avatar { position: relative; }
.notif-type-icon { position: absolute; bottom: -4px; right: -4px; font-size: 14px; background: var(--wx-bg-base); border-radius: var(--wx-radius-full); width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }

.notif-body { flex: 1; }
.notif-text { margin: 0 0 var(--wx-space-1); font-size: var(--wx-fs-14); line-height: var(--wx-lh-normal); color: var(--wx-content-primary); }
.notif-time { font-size: var(--wx-fs-12); color: var(--wx-content-muted); }

.notif-actions { align-self: center; }
.mark-btn { border: none; background: none; color: var(--wx-brand-500); cursor: pointer; font-size: 18px; line-height: 1; }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: var(--wx-space-3); padding: var(--wx-space-9); }
.empty-icon { font-size: 48px; }
.empty-text { font-size: var(--wx-fs-15); color: var(--wx-content-muted); }

.fade-list-enter-active, .fade-list-leave-active { transition: all var(--wx-d-fast) var(--wx-ease-standard); }
.fade-list-enter-from, .fade-list-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
