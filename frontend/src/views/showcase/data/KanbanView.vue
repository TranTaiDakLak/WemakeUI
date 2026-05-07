<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'
import { GroupBox } from '../../../components/common'
import { Kanban } from '../../../components/data'
import type { KanbanColumn, KanbanCard } from '../../../components/data'
import { useToast } from '../../../composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const columns = ref<KanbanColumn[]>([
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'b1', title: 'Thiết kế landing page mới', priority: 'high', tags: ['design'], assignee: 'Linh' },
      { id: 'b2', title: 'Viết unit test cho auth', priority: 'medium', tags: ['test', 'backend'], assignee: 'An' },
      { id: 'b3', title: 'Khảo sát thư viện chart', description: 'So sánh ECharts / Chart.js / unovis', priority: 'low', tags: ['research'], assignee: 'Hà' },
    ],
  },
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 't1', title: 'Fix bug login với Google OAuth', priority: 'high', tags: ['bug', 'auth'], assignee: 'Bình' },
      { id: 't2', title: 'Thêm dark mode cho dashboard', description: 'Hỗ trợ system mode + toggle thủ công', priority: 'medium', tags: ['ui'], assignee: 'Linh' },
    ],
  },
  {
    id: 'progress',
    title: 'Đang làm',
    cards: [
      { id: 'p1', title: 'Refactor BaseDataGrid → DataGridPro', description: 'Thêm pin, reorder, inline edit', priority: 'high', tags: ['refactor', 'ui'], assignee: 'An' },
      { id: 'p2', title: 'Migrate database PostgreSQL 16', priority: 'medium', tags: ['infra'], assignee: 'Bình' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      { id: 'r1', title: 'PR #42 — FilterBuilder URL serialize', priority: 'medium', tags: ['pr'], assignee: 'Hà' },
    ],
    limit: 5,
  },
  {
    id: 'done',
    title: 'Đã xong',
    cards: [
      { id: 'd1', title: 'Setup CI GitHub Actions', priority: 'low', tags: ['infra'], assignee: 'An' },
      { id: 'd2', title: 'Viết tài liệu component BaseButton', priority: 'low', tags: ['docs'], assignee: 'Linh' },
      { id: 'd3', title: 'Họp kickoff dự án', priority: 'low', tags: ['meeting'] },
    ],
  },
])

function onCardMove(cardId: string, fromCol: string, toCol: string) {
  showToast('success', `Đã di chuyển "${cardId}": ${fromCol} → ${toCol}`)
}

function onCardClick(card: KanbanCard) {
  showToast('info', `Click card: ${card.title}`)
}
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI · Kanban" subtitle="Phase 4 — data display" />
    <main class="main">
      <PageHeader title="Kanban board" description="Drag-drop card giữa các column. HTML5 native drag-drop, không phụ thuộc thư viện.">
      </PageHeader>

      <GroupBox title="Project tracker (kéo thả thử)">
        <div class="muted" style="margin-bottom: 12px;">
          <b>Cách dùng:</b> kéo card từ column này sang column khác · click card để mở chi tiết · column "Review" có giới hạn 5 cards
        </div>
        <Kanban v-model="columns" @card-move="onCardMove" @card-click="onCardClick" />
      </GroupBox>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; }
.main {
  flex: 1;
  padding: var(--space-lg);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.muted { color: var(--wx-text-muted); font-size: 12px; }
</style>
