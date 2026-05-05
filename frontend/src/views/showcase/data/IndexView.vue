<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppTopbar from '../../../components/layout/AppTopbar.vue'
import PageHeader from '../../../components/layout/PageHeader.vue'

const router = useRouter()

const routes = [
  {
    path: '/showcase/data/grid',
    icon: '⊞',
    title: 'DataGrid Pro',
    tags: ['sort', 'virtual scroll', 'resize', 'inline edit', 'export'],
    desc: 'Virtual scroll 10k rows, sort + pin + resize columns, multi-select, inline edit, saved views, export CSV/JSON.',
  },
  {
    path: '/showcase/data/filter',
    icon: '⧖',
    title: 'FilterBuilder',
    tags: ['AND/OR', 'nested', 'URL serialize'],
    desc: 'Nested AND/OR groups max depth 3, operators theo data type, serialize base64 lên URL, FilterChips strip.',
  },
  {
    path: '/showcase/data/log',
    icon: '▶',
    title: 'LogViewer',
    tags: ['streaming', 'level filter', 'virtual scroll', 'download'],
    desc: 'Stream log realtime, level filter, search + highlight, follow toggle, virtual scroll, export .log.',
  },
  {
    path: '/showcase/data/kanban',
    icon: '⊟',
    title: 'Kanban Board',
    tags: ['drag & drop', 'priority', 'tags', 'assignee'],
    desc: 'Drag-drop card giữa các column, HTML5 native DnD, priority + tags + assignee per card.',
  },
  {
    path: '/showcase/data/calendar',
    icon: '⊡',
    title: 'Calendar',
    tags: ['month view', 'agenda', 'events'],
    desc: 'Month grid + agenda view, events nhiều màu, navigation prev/next/today.',
  },
  {
    path: '/showcase/data/timeline',
    icon: '⊶',
    title: 'Timeline / Activity Feed',
    tags: ['group by day', 'dot icon', 'actor', 'timestamp'],
    desc: 'Group by day, dot icon variant, actor + timestamp, nhiều loại activity.',
  },
  {
    path: '/showcase/data/gallery',
    icon: '⊠',
    title: 'Gallery / Media Grid',
    tags: ['masonry', 'lightbox', 'keyboard nav'],
    desc: 'CSS columns masonry layout, lightbox với keyboard nav (← → Esc).',
  },
]
</script>

<template>
  <div class="page">
    <AppTopbar title="WemakeUI" subtitle="phase 4 — data display" />
    <main class="main">
      <PageHeader
        title="Phase 4 — Data Display"
        description="7 component dữ liệu nâng cao. Click vào từng card để xem demo đầy đủ."
      />

      <div class="grid">
        <button
          v-for="r in routes"
          :key="r.path"
          class="demo-card"
          @click="router.push(r.path)"
        >
          <div class="card-top">
            <span class="card-icon">{{ r.icon }}</span>
            <span class="card-title">{{ r.title }}</span>
            <span class="card-arrow">→</span>
          </div>
          <p class="card-desc">{{ r.desc }}</p>
          <div class="card-tags">
            <span v-for="t in r.tags" :key="t" class="tag">{{ t }}</span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; min-height: 100vh; background: var(--wx-bg-sunken); }
.main {
  flex: 1;
  padding: var(--wx-space-5) var(--wx-space-5) var(--wx-space-8);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-5);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--wx-space-4);
}
.demo-card {
  display: flex;
  flex-direction: column;
  gap: var(--wx-space-3);
  padding: var(--wx-space-5);
  background: var(--wx-bg-base);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-lg);
  text-align: left;
  cursor: pointer;
  font-family: var(--wx-font-primary);
  transition: all 0.15s ease;
  box-shadow: var(--wx-shadow-sm);
}
.demo-card:hover {
  border-color: var(--wx-brand-600);
  box-shadow: var(--wx-shadow-md);
  transform: translateY(-2px);
}
.card-top {
  display: flex;
  align-items: center;
  gap: var(--wx-space-2);
}
.card-icon {
  font-size: 20px;
  flex-shrink: 0;
  color: var(--wx-brand-600);
}
.card-title {
  font-size: var(--wx-fs-16);
  font-weight: var(--wx-fw-semibold);
  color: var(--wx-content-primary);
  flex: 1;
}
.card-arrow {
  font-size: var(--wx-fs-16);
  color: var(--wx-content-muted);
  transition: transform 0.15s;
}
.demo-card:hover .card-arrow { transform: translateX(4px); color: var(--wx-brand-600); }
.card-desc {
  font-size: var(--wx-fs-13);
  color: var(--wx-content-secondary);
  line-height: 1.5;
  margin: 0;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tag {
  font-size: 10px;
  font-family: var(--wx-font-mono);
  padding: 2px 7px;
  background: var(--wx-bg-sunken);
  border: 1px solid var(--wx-border-default);
  border-radius: var(--wx-radius-sm);
  color: var(--wx-content-muted);
}
</style>
