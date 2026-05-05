<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox } from '../../../components/common'
import { Timeline } from '../../../components/data'
import type { TimelineItem } from '../../../components/data'

const router = useRouter()

const today = new Date().toISOString().slice(0, 10)
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10)

const items: TimelineItem[] = [
  { id: 1, ts: `${today}T15:42:00`, title: 'Triển khai phiên bản 0.4.0 thành công', body: 'Build size: 73 KB ESM. Tất cả test PASS.', actor: 'CI Bot', variant: 'success' },
  { id: 2, ts: `${today}T14:30:00`, title: 'Merge PR #42 — FilterBuilder', actor: 'An', variant: 'info' },
  { id: 3, ts: `${today}T11:15:00`, title: 'Cảnh báo: memory usage > 80%', body: 'Pod api-server-3 chiếm 1.6GB.', actor: 'Monitoring', variant: 'warning' },
  { id: 4, ts: `${today}T09:00:00`, title: 'Họp standup hằng ngày', body: '15 phút, focus phase 4.', actor: 'Team', variant: 'default' },
  { id: 5, ts: `${yesterday}T18:20:00`, title: 'Lỗi 503 trên login endpoint', body: 'Đã rollback về v0.3.4. RCA: race condition trong Redis pool.', actor: 'On-call', variant: 'danger' },
  { id: 6, ts: `${yesterday}T14:00:00`, title: 'Deploy preview branch feat/calendar', actor: 'CI Bot', variant: 'info' },
  { id: 7, ts: `${yesterday}T10:30:00`, title: 'Tạo issue #56 — bug context menu', actor: 'Linh' },
  { id: 8, ts: `${twoDaysAgo}T16:45:00`, title: 'Hoàn tất phase 3 — form & layout shells', body: '3 shell variants: sidebar / top-nav / split-pane.', actor: 'An', variant: 'success' },
  { id: 9, ts: `${twoDaysAgo}T13:00:00`, title: 'Cập nhật documentation', actor: 'Hà' },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · Timeline" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="Timeline / Activity feed" description="Vertical timeline group theo ngày (Hôm nay / Hôm qua / ...). 5 variant màu.">
        <template #actions>
          <button class="back-btn" @click="router.push('/showcase/data')">← Phase 4</button>
        </template>
      </PageHeader>

      <GroupBox title="Activity feed">
        <Timeline :items="items" />
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.back-btn {
  padding: 6px 12px;
  border: 1px solid var(--wx-border-default);
  background: var(--wx-surface-base);
  border-radius: var(--wx-radius-md);
  font-size: 12px;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  color: var(--wx-text-secondary);
}
.back-btn:hover { background: var(--wx-hover-bg); color: var(--wx-text-primary); }
</style>
