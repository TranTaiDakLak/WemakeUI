<script setup lang="ts">
/** dashboard/project — timeline, tasks, sprint burndown */
import AppPageLayout from '../_layouts/AppPageLayout.vue'
import { BaseCard, BasePanel, BaseTag, BaseButton, BaseAvatar, BaseAvatarGroup, BaseProgress } from '../../components/common'
import { sparkPath } from '../_layouts/dashboard-widgets'

const tasks = [
  { id: 'T-241', title: 'Triển khai design tokens',  status: 'done',     owner: 'A', priority: 'medium', due: '02/05' },
  { id: 'T-240', title: 'Xây dựng AppShell phase 3', status: 'done',     owner: 'B', priority: 'high',   due: '03/05' },
  { id: 'T-239', title: 'Test FormField + a11y',     status: 'in_progress', owner: 'C', priority: 'high',   due: '07/05' },
  { id: 'T-238', title: 'Phase 4 DataGridPro',       status: 'in_progress', owner: 'A', priority: 'high',   due: '10/05' },
  { id: 'T-237', title: 'Tài liệu hooks',            status: 'review',   owner: 'D', priority: 'low',    due: '12/05' },
  { id: 'T-236', title: 'Migration legacy showcase', status: 'todo',     owner: 'B', priority: 'medium', due: '15/05' },
] as const

const statusInfo = (s: string) => ({
  todo:        { label: 'Cần làm',  variant: 'neutral' as const },
  in_progress: { label: 'Đang làm', variant: 'primary' as const },
  review:      { label: 'Review',   variant: 'warning' as const },
  done:        { label: 'Xong',     variant: 'success' as const },
})[s as 'todo']!

const priorityVariant = (p: string) =>
  p === 'high'   ? 'danger' :
  p === 'medium' ? 'warning' : 'neutral'

const sprintIdeal = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0]
const sprintActual = [50, 48, 44, 42, 38, 36, 30, 26, 22, 18, 14]
const sprintDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3', 'T4', 'T5']
</script>

<template>
  <AppPageLayout section="dashboards"
    current="Dự án"
    page-title="Sprint #18 — WemakeUI v0.6"
    page-description="Đang chạy sprint 2 tuần · 9/12 task hoàn thành."
  >
    <template #actions>
      <BaseButton variant="ghost" size="sm">Xem backlog</BaseButton>
      <BaseButton size="sm">+ Task mới</BaseButton>
    </template>

    <div class="summary" v-reveal>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <span>Tiến độ sprint</span>
          <strong>75%</strong>
          <BaseProgress :value="75" size="sm" variant="success" />
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <span>Tasks hoàn thành</span>
          <strong>9 / 12</strong>
          <span class="muted small">Còn 3 ngày</span>
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <span>Velocity</span>
          <strong>32 SP</strong>
          <BaseTag size="sm" variant="success" label="+4 vs sprint trước" />
        </div>
      </BaseCard>
      <BaseCard padded shadow="sm">
        <div class="metric">
          <span>Bug đang mở</span>
          <strong>4</strong>
          <BaseTag size="sm" variant="warning" label="2 critical" />
        </div>
      </BaseCard>
    </div>

    <div class="cols" v-reveal>
      <BaseCard title="Burndown chart" subtitle="Lý tưởng vs thực tế" padded shadow="sm">
        <svg class="chart" viewBox="0 0 600 220" preserveAspectRatio="none">
          <line x1="32" y1="200" x2="580" y2="200" stroke="#e5e7eb" />
          <path :d="sparkPath([...sprintIdeal], 580, 200, 16)" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" fill="none" />
          <path :d="sparkPath([...sprintActual], 580, 200, 16)" stroke="#2563eb" stroke-width="2" fill="none" />
        </svg>
        <div class="legend-row">
          <span class="dot" style="background:#94a3b8" /> Lý tưởng
          <span class="dot" style="background:#2563eb" /> Thực tế
        </div>
        <div class="x-labels">
          <span v-for="(d, i) in sprintDays" :key="i">{{ d }}</span>
        </div>
      </BaseCard>

      <BasePanel title="Team online">
        <ul class="team">
          <li v-for="(m, i) in [
            { who: 'Trần Quốc Anh', role: 'Frontend lead', status: 'online' },
            { who: 'Phạm Mai Linh', role: 'Designer',      status: 'online' },
            { who: 'Vũ Hoàng',      role: 'PM',            status: 'busy' },
            { who: 'Lê Đức Hà',     role: 'Backend',       status: 'away' },
            { who: 'Nguyễn An',     role: 'QA',            status: 'offline' },
          ]" :key="i" class="team-row">
            <BaseAvatar :name="m.who" :status="m.status as 'online'|'busy'|'away'|'offline'" size="sm" />
            <div>
              <strong>{{ m.who }}</strong>
              <div class="muted small">{{ m.role }}</div>
            </div>
          </li>
        </ul>
      </BasePanel>
    </div>

    <BasePanel v-reveal title="Tasks gần đây" description="Sprint hiện tại">
      <table class="tasks">
        <thead><tr>
          <th>ID</th><th>Tiêu đề</th><th>Trạng thái</th><th>Ưu tiên</th>
          <th>Người làm</th><th>Hạn</th>
        </tr></thead>
        <tbody>
          <tr v-for="t in tasks" :key="t.id">
            <td><code class="mono">{{ t.id }}</code></td>
            <td>{{ t.title }}</td>
            <td><BaseTag :variant="statusInfo(t.status).variant" :label="statusInfo(t.status).label" size="sm" /></td>
            <td><BaseTag :variant="priorityVariant(t.priority)" :label="t.priority" size="sm" /></td>
            <td><BaseAvatar :name="t.owner" size="xs" /></td>
            <td class="muted small">{{ t.due }}</td>
          </tr>
        </tbody>
      </table>
    </BasePanel>
  </AppPageLayout>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--wx-space-3);
}
.metric { display: flex; flex-direction: column; gap: 4px; font-size: var(--wx-fs-12); color: var(--wx-content-muted); }
.metric strong { font-size: var(--wx-fs-20); color: var(--wx-content-primary); font-weight: var(--wx-fw-bold); }
.muted { color: var(--wx-content-muted); }
.small { font-size: var(--wx-fs-12); }

.cols { display: grid; grid-template-columns: 2fr 1fr; gap: var(--wx-space-4); }
@media (max-width: 960px) { .cols { grid-template-columns: 1fr; } }
.chart { width: 100%; height: 220px; }
.legend-row { display: flex; gap: var(--wx-space-3); font-size: var(--wx-fs-12); color: var(--wx-content-muted); margin-top: var(--wx-space-2); }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 9999px; margin-right: 4px; }
.x-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--wx-content-muted);
  margin-top: 4px;
}

.team { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--wx-space-2); }
.team-row { display: flex; align-items: center; gap: var(--wx-space-2); font-size: var(--wx-fs-13); }

.tasks { width: 100%; border-collapse: collapse; font-size: var(--wx-fs-13); }
.tasks th, .tasks td {
  text-align: left;
  padding: var(--wx-space-2) var(--wx-space-3);
  border-bottom: 1px solid var(--wx-border-subtle);
}
.tasks th { font-size: var(--wx-fs-12); color: var(--wx-content-muted); font-weight: var(--wx-fw-medium); }
.mono { font-family: var(--wx-font-mono); color: var(--wx-content-link); }
</style>
